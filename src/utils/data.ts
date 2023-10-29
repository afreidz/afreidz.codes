import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type GenericCount = { label: string; count: number };

export async function getAllPosts() {
  return await getCollection("post", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}

function reduceCounts(all: { [key: string]: number }, us: string) {
  all[us] = ++all[us] || 1;
  return all;
}

export async function getAllTagOccurances(limit?: number) {
  const posts = await getAllPosts();
  const tags = posts.map((p) => p.data.tags).flat(2);

  const r = tags.reduce(reduceCounts, {});

  const keys = Object.keys(r);
  const values = Object.values(r);

  const arr = keys.map((k, i) => ({ label: k, count: values[i] }));

  return limit ? arr.slice(0, limit) : arr;
}

export async function getAllFeelings(limit?: number) {
  const posts = await getAllPosts();
  const feelings = posts.map((p) => p.data.feeling);

  const r = feelings.reduce(reduceCounts, {});

  const keys = Object.keys(r);
  const values = Object.values(r);

  const arr = keys.map((k, i) => ({ label: k, count: values[i] }));

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
