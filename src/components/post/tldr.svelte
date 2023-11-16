<script lang="ts">
  import type { HTMLAttributes } from "astro/types";

  type ValidTags = "a" | "span";

  type ComponentProps = {
    as: ValidTags;
  };

  type AnchorProps = HTMLAttributes<"a">;
  type SpanProps = HTMLAttributes<"span">;

  type $$Props = (AnchorProps & ComponentProps) | (SpanProps & ComponentProps);

  let as: ValidTags = "span";

  export { as };
</script>

<div class="my-14 text-center text-2xl w-full">
  <svelte:element this={as} {...$$restProps}><slot /></svelte:element>
</div>
