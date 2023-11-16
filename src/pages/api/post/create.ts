import jwt from "jsonwebtoken";
import { siteConfig } from "@/config";
import type { APIRoute, AstroCookies } from "astro";
import { Octokit } from "@octokit/rest";
import { schema } from "@/content/config";
import { getAllPosts, type PostAndContentSchema } from "@/utils/data";

export const prerender = false;
export const runtime = "edge";

function validAuth(cookies: AstroCookies) {
  let token = cookies.get("access-token")?.value;
  if (!token) return false;

  try {
    jwt.verify(token, import.meta.env.JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

function validatePost(post: PostAndContentSchema) {
  if (!post.slug || !post.content || !post.title)
    return {
      valid: false,
      errors: ["Post invalid"],
    };

  const schemaResults = schema.safeParse(post);

  if (!schemaResults.success)
    return {
      valid: false,
      errors: schemaResults.error.errors.map((e) => {
        return `${e.path.join(" ").toUpperCase()}:${e.message}`;
      }),
    };

  return { valid: true };
}

function generateContents(post: PostAndContentSchema) {
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
  return buffer.toString("base64");
}

function getOctokit() {
  if (!import.meta.env.GH_ACCESS_TOKEN)
    return { errors: ["Unable to connect to repository"], octokit: null };

  try {
    const octokit = new Octokit({
      auth: import.meta.env.GH_ACCESS_TOKEN,
    });

    return { errors: [], octokit };
  } catch (e) {
    return { errors: ["Unable to connect to repository"], octokit: null };
  }
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  if (!validAuth(cookies))
    return new Response(JSON.stringify({ errors: ["Authentication failed"] }), {
      status: 400,
    });

  const post = (await request.json()) as PostAndContentSchema;
  const postResults = validatePost(post);

  if (!postResults.valid)
    return new Response(JSON.stringify({ errors: postResults.errors }), {
      status: 400,
    });

  const postIds = (await getAllPosts()).map((p) => p.id) as string[];

  if (!post.id || !postIds.includes(post.id)) {
    return new Response(
      JSON.stringify({
        errors: [`Post "${post.slug}" does not exist`],
      }),
      { status: 400 },
    );
  }

  const content = generateContents(post);
  const { errors, octokit } = getOctokit();

  if (!octokit) {
    return new Response(
      JSON.stringify({
        errors,
      }),
      { status: 400 },
    );
  }

  const existingFile = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "afreidz",
      repo: "afreidz.codes",
      path: `src/content/post/${post.id}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const sha = (existingFile.data as any).sha as string;

  await octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
    sha,
    content,
    owner: "afreidz",
    repo: "afreidz.codes",
    path: `src/content/post/${post.id}`,
    message: `ADMIN: updates post "${post.title}"`,
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

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!validAuth(cookies))
    return new Response(JSON.stringify({ errors: ["Authentication failed"] }), {
      status: 400,
    });

  const post = (await request.json()) as PostAndContentSchema;
  const postResults = validatePost(post);

  if (!postResults.valid)
    return new Response(JSON.stringify({ errors: postResults.errors }), {
      status: 400,
    });

  const postSlugs = (await getAllPosts()).map((p) => p.slug) as string[];

  if (postSlugs.includes(post.slug)) {
    return new Response(
      JSON.stringify({
        errors: [`Post "${post.slug}" already exists`],
      }),
      { status: 400 },
    );
  }

  const content = generateContents(post);
  const { errors, octokit } = getOctokit();

  if (!octokit) {
    return new Response(
      JSON.stringify({
        errors,
      }),
      { status: 400 },
    );
  }

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
