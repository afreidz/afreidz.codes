<script lang="ts">
  import { marked } from "marked";
  import { createEventDispatcher } from "svelte";

  let preview = false;
  let content: string = "";
  let removeDisable = false;
  let textbox: HTMLDivElement;
  let dispatch = createEventDispatcher();

  export { content, preview, removeDisable };
</script>

{#if preview}
  {@html marked.parse(content)}
{:else}
  <section class="flex items-start mb-6">
    <div
      on:input={() => (content = textbox.innerText)}
      bind:this={textbox}
      contenteditable
      role="textbox"
      class="w-full font-mono min-h-max p-4 bg-neutral-200 rounded-md border border-default-100/10"
    >
      {content}
    </div>
    <button
      disabled={removeDisable}
      on:click={() => dispatch("remove")}
      class="w-10 p-2 disabled:opacity-10"
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
  </section>
{/if}
