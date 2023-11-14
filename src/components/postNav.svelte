<script lang="ts">
  import TOC from "@/components/toc.svelte";
  import type { MarkdownHeading } from "astro";
  import Dialog from "@/components/dialog.svelte";

  let showTOC = false;
  let showBackToTop = false;
  let toc: MarkdownHeading[] = [];

  function handleScroll() {
    showBackToTop =
      document.body.scrollTop > 200 || document.documentElement.scrollTop > 200;
  }

  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  export { toc };
</script>

<svelte:window on:scroll={handleScroll} />

<div
  class="lg:sticky fixed lg:bottom-1 bottom-14 right-1 lg:right-auto bg-neutral-200 lg:bg-transparent z-10 rounded-lg flex justify-evenly gap-4 p-4"
>
  <a
    href="#main"
    on:click|preventDefault={goToTop}
    class:lg:invisible={!showBackToTop}
    class:lg:pointer-events-none={!showBackToTop}
    class="transition-all duration-1000 rounded-full border-2 border-default-100/40 hover:border-accent-100 h-8 w-8 p-1 text-default-100/40 hover:text-accent-100"
  >
    <span class="sr-only">Back to top</span>
    <slot name="top" />
  </a>
  <button
    on:click={() => (showTOC = true)}
    class="transition-all lg:hidden duration-1000 rounded-full border-2 border-default-100/40 hover:border-accent-100 h-8 w-8 p-1 text-default-100/40 hover:text-accent-100"
  >
    <span class="sr-only">Table of contents</span>
    <slot name="toc" />
  </button>
  <a
    href="/home"
    on:click|preventDefault={() => history.back()}
    class="transition-colors duration-1000 rounded-full border-2 border-default-100/40 hover:border-accent-100 h-8 w-8 p-1 text-default-100/40 hover:text-accent-100"
  >
    <span class="sr-only">Back to home</span>
    <slot name="home" />
  </a>
</div>

<Dialog
  open={showTOC}
  on:close={() => (showTOC = false)}
  class="!justify-start"
>
  <TOC headings={toc} on:navigate={() => (showTOC = false)} />
</Dialog>
