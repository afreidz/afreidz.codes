<script lang="ts">
  import type { MarkdownHeading } from "astro";
  import { createEventDispatcher } from "svelte";

  let headings: MarkdownHeading[] = [];

  const dispatch = createEventDispatcher();
  const linkClasses = "block px-1 transition-colors link line-clamp-2";

  export { headings };
</script>

<h2 class="font-semibold pl-2">Table of Contents</h2>
<ul class="mt-4 pl-6 text-sm list-['#_'] marker:text-accent-200">
  {#each headings.filter((h) => h.depth === 2) as heading}
    <li class="mb-2">
      <a
        class={linkClasses}
        href={`#${heading.slug}`}
        on:click={() => dispatch("navigate")}
        aria-label={`Scroll to section: ${heading.text}`}
      >
        {heading.text}
      </a>
    </li>
  {/each}
  <li class="mb-2 list-['🍿']">
    <a
      href="#comments"
      class={linkClasses + " text-accent-300"}
      aria-label="Scroll to comments section"
    >
      Comments
    </a>
  </li>
</ul>
