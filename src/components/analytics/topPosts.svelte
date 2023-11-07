<script lang="ts">
  import { onMount } from "svelte";
  import type { CollectionEntry } from "astro:content";

  type Visit = {
    id: string;
    date: Date;
    slug: string;
    flag: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };

  type PostHitsMap = {
    [slug: string]: number;
  };

  type PostHit = {
    slug: string;
    post?: CollectionEntry<"post">;
    count: number;
  };

  let limit = 10;
  let data: PostHit[] = [];
  let posts: CollectionEntry<"post">[] = [];

  onMount(async () => {
    const { visits }: { visits: Visit[] } = await (
      await fetch(`/api/analytics`)
    ).json();

    const postHits = visits
      .filter((visit) => visit.slug.includes("posts/"))
      .reduce((visits, visit) => {
        visits[visit.slug] = ++visits[visit.slug] || 1;
        return visits;
      }, {} as PostHitsMap);

    data = Object.entries(postHits)
      .map(([slug, count]) => {
        const post = posts.find((p) => slug.includes(p.slug));
        return {
          post,
          slug,
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  });

  let classList: string = "";
  export { classList as class, limit, posts };
</script>

<section class={classList}>
  <slot name="heading" />
  <div
    class="flex w-full flex-col border border-default-100/10 p-8 gap-2 bg-gradient-to-b from-default-100/5 to-transparent rounded-md font-mono"
  >
    <ul class="text-sm lg:text-base">
      {#each data.slice(0, limit) as { post, slug, count }}
        <li
          class="border-b border-default-100/10 font-semibold last-of-type:border-b-0 flex justify-between items-center px-4 py-3"
        >
          <a href={slug} style={`view-transition-name: ${post?.slug}_title;`}>
            {post?.data.title}
          </a>
          <strong>{count}</strong>
        </li>
      {/each}
    </ul>
  </div>
</section>
