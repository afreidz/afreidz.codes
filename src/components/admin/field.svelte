<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  interface $$Props extends HTMLInputAttributes {
    label: string;
    value?: string;
    class?: string;
    checked?: boolean;
    removeable?: boolean;
  }

  interface $$Events {
    remove: CustomEvent;
    focus: Event & { currentTarget: HTMLInputElement };
    change: Event & { currentTarget: HTMLInputElement };
  }

  let label = "";
  let value = "";
  let checked = false;
  let removeable = false;
  let customClasses = "";
  let dispatch = createEventDispatcher();

  export { label, value, checked, removeable, customClasses as class };
</script>

<label
  class="grid grid-rows-[1.5rem_auto] mb-6 justify-stretch focus-within:text-accent-300 {customClasses}"
>
  <span class="block text-sm leading-4 font-semibold">{label}</span>
  {#if $$slots.default}
    <slot />
  {:else if $$props.type === "checkbox"}
    <input
      type="checkbox"
      class="accent-accent-200"
      bind:checked
      on:change
      on:focus
      {...$$restProps}
    />
  {:else}
    <span class="flex">
      <input
        bind:value
        on:change
        on:focus
        class:flex-1={true}
        {...$$restProps}
      />
      {#if removeable}
        <button
          on:click={() => dispatch("remove")}
          class="w-10 p-2 disabled:opacity-10 flex-none"
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
      {/if}
    </span>
  {/if}
</label>

<style lang="postcss">
  label :global(input),
  label :global(select),
  label :global(select[multiple]) {
    @apply w-full font-mono p-3 bg-neutral-200 rounded-md border border-default-100/10;
  }
</style>
