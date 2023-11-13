<script lang="ts">
  let id: string;
  let open = false;
  let dialog: HTMLDialogElement;

  $: if (open && dialog) {
    dialog.showModal();
  } else if (dialog) {
    dialog.close();
  }

  export { id };
</script>

<a
  on:click|preventDefault={() => (open = true)}
  href={`https://www.youtube.com/watch/${id}`}
  class="group relative mx-6 lg:mx-8 rounded-md overflow-hidden flex items-center justify-center aspect-w-16 aspect-h-9"
>
  <img
    alt={`Play youtube video ${id}`}
    src={`https://img.youtube.com/vi/${id}/0.jpg`}
    class="group-hover:mix-blend-overlay h-full !m-0"
  />
  <div class="absolute inset-0 flex items-center justify-center opacity-75">
    <i class="w-16 text-neutral-50">
      <slot name="icon" />
    </i>
  </div>
</a>

<dialog {open} bind:this={dialog} class="w-full h-full max-w-6xl fixed inset-0">
  <div class="w-full h-full bg-black p-4 rounded-md overflow-clip relative">
    <button
      on:click={() => (open = false)}
      class="w-10 h-10 p-2 rounded-full absolute top-0 right-2"
    >
      <i class="h-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
          /></svg
        >
      </i>
    </button>
    {#if open}
      <iframe
        class="w-full h-full"
        title="Youtube Video id {id}"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&playlist=${id}`}
        allow="accelerometer; autoplay; clipboard-write; loop; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    {/if}
  </div>
</dialog>

<style lang="postcss">
  dialog::backdrop {
    @apply bg-black/70 backdrop-blur-md;
  }
</style>
