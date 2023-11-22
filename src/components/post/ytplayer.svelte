<script lang="ts">
  import Icon from "@iconify/svelte";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import Dialog from "@/components/dialog.svelte";

  const [send, receive] = crossfade({
    duration: 1000,
    easing: quintOut,
  });

  let id: string;
  let open = false;

  export { id };
</script>

<a
  in:send={{ key: id }}
  out:receive={{ key: id }}
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
      <Icon icon="octicon:play-16" class="w-14 h-14" />
    </i>
  </div>
</a>

<Dialog {send} {receive} key={id} {open} on:close={() => (open = false)}>
  {#if open}
    <div
      class="bg-black w-full aspect-w-16 aspect-h-9 rounded-md overflow-clip"
    >
      <iframe
        class="w-full h-full"
        allowfullscreen
        referrerpolicy="origin"
        title="Youtube Video id {id}"
        src={`https://www.youtube.com/embed/${id}?autoplay=1&playlist=${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
      ></iframe>
    </div>
  {/if}
</Dialog>
