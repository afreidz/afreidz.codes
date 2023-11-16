import jwt from "jsonwebtoken";
import { siteConfig } from "@/config";
import type { APIRoute } from "astro";
import { Octokit } from "@octokit/rest";
import { schema } from "@/content/config";
import { getAllPosts, type PostAndContentSchema } from "@/utils/data";

export const prerender = false;
export const runtime = "edge";

export const POST: APIRoute = async ({ request, cookies }) => {
  let token = cookies.get("access-token")?.value;
  if (!token)
    return new Response(JSON.stringify({ errors: ["Authentication failed"] }), {
      status: 400,
    });

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
  } catch (e) {
    return new Response(JSON.stringify({ errors: ["Authentication failed"] }), {
      status: 400,
    });
  }

  const post = (await request.json()) as PostAndContentSchema;

  if (!post.slug || !post.content || !post.title)
    return new Response(JSON.stringify({ errors: ["Post invalid"] }), {
      status: 400,
    });

  if (!import.meta.env.GH_ACCESS_TOKEN)
    return new Response(
      JSON.stringify({ errors: ["Unable to connect to repository"] }),
      {
        status: 400,
      },
    );

  const schemaResults = schema.safeParse(post);

  if (!schemaResults.success)
    return new Response(
      JSON.stringify({
        errors: schemaResults.error.errors.map((e) => {
          return `${e.path.join(" ").toUpperCase()}:${e.message}`;
        }),
      }),
      { status: 400 },
    );

  const postSlugs = (await getAllPosts()).map((p) => p.slug) as string[];

  if (postSlugs.includes(post.slug)) {
    return new Response(
      JSON.stringify({
        errors: [`Post "${post.slug}" already exists`],
      }),
      { status: 400 },
    );
  }

  const postDate = new Date(post.publishedDate);
  const day = postDate.toLocaleDateString(siteConfig.locale, {
    day: "numeric",
  });
  const month = postDate.toLocaleDateString(siteConfig.locale, {
    month: "short",
  });
  const year = postDate.toLocaleDateString(siteConfig.locale, {
    year: "numeric",
  });

  const meta = `---
draft: ${post.draft}
title: ${post.title}
feeling: ${post.feeling}
tags: [${post.tags.join(",")}]
description: ${post.description}
publishedDate: ${day} ${month} ${year}
---

import TLDR from "@/components/post/tldr.svelte";
import YTVideo from "@/components/post/ytplayer.svelte";
import Sidenote from "@/components/post/sidenote.svelte";
`;

  const contents = post.content
    .map((c) => {
      return c.type === "markdown"
        ? c.content
        : c.type === "sidenote"
        ? `<Sidenote>${c.content}</Sidenote>`
        : c.type === "tldr"
        ? `<TLDR>${c.content}</TLDR>`
        : c.type === "youtube"
        ? `<YTVideo id="${c.id}" client:load />`
        : "";
    })
    .join("\n");

  const buffer = Buffer.from([meta, contents].join("\n").trim());
  const content = buffer.toString("base64");

  const octokit = new Octokit({
    auth: import.meta.env.GH_ACCESS_TOKEN,
  });

  await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
    content,
    owner: "afreidz",
    repo: "afreidz.codes",
    path: `src/content/post/${post.slug}.mdx`,
    message: `ADMIN: adds post titled "${post.title}"`,
    committer: {
      name: "afreidz.codes admin",
      email: "me@afreidz.codes",
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return new Response("success", { status: 200 });
};
