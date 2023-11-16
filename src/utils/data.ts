import { FEELINGS } from "@/config";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { schema, type PostSchema } from "@/content/config";

export type GenericCount = { label: string; count: number };

export async function getAllPosts() {
  return await getCollection("post", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}

export async function getAllTags() {
  const posts = await getAllPosts();
  return [...new Set(posts.map((p) => p.data.tags).flat(2))];
}

export async function getPostByTag(t: string) {
  return await getCollection("post", ({ data }) => {
    return (
      (import.meta.env.PROD ? data.draft !== true : true) &&
      data.tags.includes(t)
    );
  });
}

export async function getAllFeelings() {
  const posts = await getAllPosts();
  return [...new Set(posts.map((p) => p.data.feeling))];
}

export async function getPostsByFeeling(f: string) {
  return await getCollection("post", ({ data }) => {
    return (
      (import.meta.env.PROD ? data.draft !== true : true) && data.feeling === f
    );
  });
}

function reduceCounts(all: { [key: string]: number }, us: string) {
  all[us] = ++all[us] || 1;
  return all;
}

export async function getAllTagCounts(limit?: number) {
  const posts = await getAllPosts();
  const tags = posts.map((p) => p.data.tags).flat(2);

  const r = tags.reduce(reduceCounts, {});

  const keys = Object.keys(r);
  const values = Object.values(r);

  const arr = keys.map((k, i) => ({ label: k, count: values[i] }));

  return limit ? sortByCount(arr).slice(0, limit) : arr;
}

export async function getAllFeelingsCounts(limit?: number) {
  const posts = await getAllPosts();
  const feelings = posts.map((p) => p.data.feeling);

  const r = feelings.reduce(reduceCounts, {});
  const arr = FEELINGS.map((k) => ({ label: k, count: r[k] || 0 }));

  return limit ? sortByCount(arr).slice(0, limit) : arr;
}

export async function getPostCountsByYearAndMonth(limit?: number) {
  const posts = await getAllPosts();
  const yearsArray = posts.map((p) =>
    new Date(p.data.publishedDate).getFullYear(),
  );
  const years = [...new Set(yearsArray)];

  const arr = years
    .map((y) => ({
      label: y,
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) => {
        const matchingPosts = posts.filter((p) => {
          const postDate = new Date(p.data.publishedDate);
          return postDate.getMonth() === m && postDate.getFullYear() === y;
        });
        return matchingPosts.length;
      }),
    }))
    .sort((a, b) => a.label - b.label);

  return limit ? arr.slice(0, limit) : arr;
}

function sortByDate(posts: Array<CollectionEntry<"post">>) {
  return posts.sort((a, b) => {
    const aDate = new Date(
      a.data.updatedDate ?? a.data.publishedDate,
    ).valueOf();
    const bDate = new Date(
      b.data.updatedDate ?? b.data.publishedDate,
    ).valueOf();
    return bDate - aDate;
  });
}

function sortByCount(o: GenericCount[]) {
  return o.sort((a, b) => b.count - a.count);
}

export type ContentSection = {
  type: "markdown" | "tldr" | "sidenote";
  content: string;
};

export type YTVidSection = {
  type: "youtube";
  id: string;
};

export type ContentUnion = ContentSection | YTVidSection;

export type PostAndContentSchema = PostSchema & {
  slug: string;
  content: ContentUnion[];
};

export async function createPost(post: PostAndContentSchema) {
  const schemaResults = schema.safeParse(post);

  if (!schemaResults.success)
    throw new Error(
      schemaResults.error.errors
        .map((e) => {
          return `<strong>${e.path.join(" ").toUpperCase()}:</strong> <span>${
            e.message
          }</span>`;
        })
        .join("<br/>"),
    );

  const postSlugs = (await getAllPosts()).map((p) => p.slug) as string[];

  if (postSlugs.includes(post.slug)) {
    throw new Error(
      `<strong>SLUG:</strong> <span>\`${post.slug}\` already exists</span>`,
    );
  }

  const meta = `
---
draft: ${post.draft}
title: ${post.title}
feeling: ${post.feeling}
tags: [${post.tags.join(",")}]
description: ${post.description}
publishedDate: ${post.publishedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}
---

import TLDR from "@/components/post/tldr.svelte";
import YTVideo from "@/components/post/ytplayer.svelte";
import Sidenote from "@/components/post/sidenote.svelte";
`;

  const content = post.content
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

  const file = [meta, content].join("\n");

  const resp = await fetch("/api/post/create", {
    credentials: "include",
    method: "post",
    body: JSON.stringify({
      slug: post.slug,
      content: file,
    }),
  });
  if (!resp.ok) {
    throw new Error(
      `<strong>ERROR:</strong> <span>${
        (await resp.text()) ?? "unknown"
      }</span>`,
    );
  }
}

export const sort = { date: sortByDate, count: sortByCount };
