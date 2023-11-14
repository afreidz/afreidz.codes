<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let open = false;
  let customClasses: string = "";
  let dispatch = createEventDispatcher();
  let elm: HTMLDialogElement | undefined = undefined;

  $: if (open && elm) {
    elm.showModal();
  } else if (elm) {
    elm.close();
    dispatch("close");
  }

  export { elm, open, customClasses as class };
</script>

<dialog
  {open}
  class:grid={open}
  bind:this={elm}
  class="w-full h-full bg-transparent grid-rows-[2.5rem,_auto]"
>
  <header class="flex justify-end">
    <button on:click={() => (open = false)} class="w-10 p-2">
      <i class="h-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
          /></svg
        >
      </i>
    </button>
  </header>
  <div class="flex flex-col justify-center h-full {customClasses}">
    {#if open}
      <slot />
    {/if}
  </div>
</dialog>

<style lang="postcss">
  ::backdrop {
    @apply backdrop-blur-xl;
  }
</style>
