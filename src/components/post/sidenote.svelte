<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<div
  class="relative bg-white/5 mt-6 lg:ml-4 p-4 before:absolute before:top-0 before:bottom-0 before:left-0 before:border-l-[0.25rem] before:border-accent before:animate-hue-rotate leading-7"
>
  <div class="flex items-center gap-2">
    <Icon icon="fa-regular:hand-point-up" class="h-4 w-4" />
    <strong class="text-xl text-accent animate-hue-rotate">Note!</strong>
  </div>
  <slot />
</div>
