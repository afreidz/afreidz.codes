<script lang="ts">
  import Dialog from "@/components/dialog.svelte";

  let id: string;
  let open = false;

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

<Dialog {open} on:close={() => (open = false)}>
  <div class="bg-black w-full aspect-w-16 aspect-h-9 rounded-md overflow-clip">
    <iframe
      class="w-full h-full"
      title="Youtube Video id {id}"
      src={`https://www.youtube.com/embed/${id}?autoplay=1&playlist=${id}`}
      allow="accelerometer; autoplay; clipboard-write; loop; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="origin"
    ></iframe>
  </div>
</Dialog>
