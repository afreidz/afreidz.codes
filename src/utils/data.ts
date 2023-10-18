import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export async function getAllPosts() {
  return await getCollection("post", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
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

export const sort = { date: sortByDate };
