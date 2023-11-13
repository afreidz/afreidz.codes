import { FEELINGS } from "@/config";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

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

export const sort = { date: sortByDate, count: sortByCount };
