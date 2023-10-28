<script lang="ts">
  import { onMount, tick } from "svelte";
  import { shortcut } from "@svelte-put/shortcut";

  type Result = {
    url: string;
    title: string;
    excerpt: string;
  };

  let query = "";
  let active = false;
  let find: any = null;
  let form: HTMLFormElement;
  let results: Result[] = [];
  let search: HTMLInputElement;
  let dialog: HTMLDialogElement;

  onMount(async () => {
    find = await import("/pagefind/pagefind.js");
    find.init();
  });

  $: active = dialog?.open;

  $: if (search) tick().then(() => search.focus());

  $: if (query.length && find) {
    find
      .search(query)
      .then(({ results }: any) =>
        Promise.all(results.map((r: any) => r.data())),
      )
      .then(
        (r: any) =>
          (results = r.map((r: any) => ({
            title: r.meta.title,
            excerpt: r.excerpt,
            url: r.raw_url,
          }))),
      );
  }

  function report(e: SubmitEvent) {
    const target = e.currentTarget as HTMLFormElement;
    const item = target.elements.namedItem("goto") as RadioNodeList;
    dialog && dialog.close(item.value);
  }
</script>

<svelte:window
  use:shortcut={{
    trigger: {
      key: "f",
      modifier: ["ctrl"],
      callback: () => {
        if (document.activeElement === document.body && dialog)
          dialog.showModal();
      },
    },
  }}
/>

<button
  on:click={() => dialog.showModal()}
  class="w-9 h-9 flex-none p-1 transition-colors duration-1000 text-default-100/40 rounded-full hover:text-accent-100"
>
  <slot name="trigger" />
</button>

<dialog
  bind:this={dialog}
  class="w-full h-full bg-transparent lg:max-w-[50%]"
  on:close={() => {
    if (dialog.returnValue) window.location.href = dialog.returnValue;
  }}
>
  <form bind:this={form} on:submit|preventDefault={report}>
    <label
      class="flex items-center border-0 border-b-2 border-accent-100 focus-within:border-accent-300"
    >
      <input
        bind:value={query}
        class="w-full transition-colors duration-1000 bg-transparent px-4 py-2 outline-none text-xl font-semibold peer order-2"
      />
      <span id="searchLabel" class="sr-only">Open Search Prompt</span>
      <button
        aria-labelledby="searchLabel"
        type="button"
        tabindex="-1"
        on:click={() => dialog && dialog.close()}
        class="w-8 h-8 text-default-100/40 order-1"
        ><slot name="close" /></button
      >
      <i class="w-8 h-8 text-accent-100 peer-focus:text-accent-300 order-3"
        ><slot name="trigger" /></i
      >
    </label>
    {#if results.length && query.length}
      <ul>
        {#each results as result}
          <li
            class="border-b-2 border-dotted border-default-100/40 focus-within:border-accent-300 focus-within:bg-default-100/10"
          >
            <label>
              <span class="sr-only">Search for articles</span>
              <input
                type="radio"
                value={result.url}
                class="appearance-none w-0 h-0"
                name="goto"
              />
            </label>
            <a href={result.url} class="p-6 pt-0 flex flex-col" tabindex="-1">
              <strong>{result.title}</strong>
              <small>{@html result.excerpt}</small>
            </a>
          </li>
        {/each}
      </ul>
    {/if}
    <button class="sr-only" type="submit" />
  </form>
</dialog>

<style lang="postcss">
  ::backdrop {
    @apply backdrop-blur-xl;
  }
</style>
