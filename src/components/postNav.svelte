<script lang="ts">
  let showBackToTop = false;

  function handleScroll() {
    showBackToTop =
      document.body.scrollTop > 200 || document.documentElement.scrollTop > 200;
  }

  $: console.log(showBackToTop);

  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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
  <a
    href="/home"
    on:click|preventDefault={() => history.back()}
    class="transition-colors duration-1000 rounded-full border-2 border-default-100/40 hover:border-accent-100 h-8 w-8 p-1 text-default-100/40 hover:text-accent-100"
  >
    <span class="sr-only">Back to home</span>
    <slot name="home" />
  </a>
</div>
