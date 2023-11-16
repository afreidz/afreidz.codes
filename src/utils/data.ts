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
  id?: string;
  slug: string;
  content: ContentUnion[];
};

export async function createOrUpdatePost(
  post: PostAndContentSchema,
  method: "post" | "put" = "post",
) {
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

  const resp = await fetch("/api/post/createOrUpdate", {
    method,
    credentials: "include",
    body: JSON.stringify(post),
  });

  if (!resp.ok) {
    const { errors } = await resp.json();

    const msg = errors
      .map(
        (e: string) => `<strong>ERROR:</strong> <span>${e ?? "unknown"}</span>`,
      )
      .join("<br/>");

    throw new Error(msg);
  }

  return `Your post has been ${method === "put" ? "updated" : "created"}`;
}

export const sort = { date: sortByDate, count: sortByCount };

export function postBodyToContent(body: string): ContentUnion[] {
  const imports = /^import .*$/gm;
  const ytidAttribute = /id\s*=\s*["']([^"']+)["']/gi;
  const AllComponents =
    /<(TLDR|Sidenote)\b[^>]*>((?:(?!<\/\1>).)*)<\/\1>|<YTVideo\b[^>]*\/>/gis;

  let lastIndex = 0;
  const content: ContentUnion[] = [];

  for (const match of body.matchAll(AllComponents)) {
    // Add the unmatched part as markdown
    if (match.index && match.index > lastIndex) {
      content.push({
        type: "markdown",
        content: body.slice(lastIndex, match.index).replace(imports, "").trim(),
      });
    }

    // If match[1] exists we have a "content" component
    if (match[1]) {
      const data: ContentSection = {
        type: match[1].toLowerCase() as ContentSection["type"],
        content: match[2],
      };
      content.push(data);

      // If match[1] doesn't exist we have an "id" component
      // which we get from the 'id' attribute
    } else {
      const data: YTVidSection = {
        type: "youtube",
        id: Array.from(match[0].matchAll(ytidAttribute))[0]?.[1],
      };
      content.push(data);
    }

    // Update the lastIndex to the end of the current match
    lastIndex = (match.index ?? 0) + match[0].length;
  }

  // Add any remaining unmatched part of the string as markdown
  if (lastIndex < body.length && !!body.slice(lastIndex).trim()) {
    content.push({
      type: "markdown",
      content: body.slice(lastIndex).replace(imports, "").trim(),
    });
  }

  return content;
}
