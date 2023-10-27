<script lang="ts">
  import { onMount } from "svelte";
  import { shortcut } from "@svelte-put/shortcut";

  type Result = {
    url: string;
    title: string;
    excerpt: string;
  };

  let query = "";
  let active = false;
  let find: any = null;
  let results: Result[] = [];
  let dialog: HTMLDialogElement;

  onMount(async () => {
    find = await import("@pagefind");
    find.init();
  });

  $: active = dialog?.open;

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
  class="w-9 h-9 m-auto p-1 transition-colors duration-1000 text-default-100/40 rounded-full hover:text-accent-100"
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
  <form on:submit|preventDefault={report}>
    <label
      class="flex items-center border-0 border-b-2 border-accent-100 focus-within:border-accent-300"
    >
      <input
        bind:value={query}
        class="w-full transition-colors duration-1000 bg-transparent px-4 py-2 outline-none text-xl font-semibold peer"
      />
      <i class="w-8 h-8 text-accent-100 peer-focus:text-accent-300"
        ><slot name="trigger" /></i
      >
    </label>
    {#if results.length && query.length}
      <ul>
        {#each results as result}
          <li
            class="border-b-2 border-dotted border-default-100/40 focus-within:border-accent-300 focus-within:bg-default-100/10"
          >
            <label class="p-6 flex flex-col">
              <input
                type="radio"
                value={result.url}
                class="appearance-none"
                name="goto"
              />
              <strong>{result.title}</strong>
              <small>{@html result.excerpt}</small>
            </label>
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
