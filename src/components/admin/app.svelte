<script lang="ts">
  import {
    getAllTags,
    createPost,
    type ContentUnion,
    type PostAndContentSchema,
  } from "@/utils/data";

  import { onMount } from "svelte";
  import { FEELINGS } from "@/config";
  import { type PostSchema } from "@/content/config";
  import Field from "@/components/admin/field.svelte";
  import Ytplayer from "@/components/post/ytplayer.svelte";
  import Markdown from "@/components/admin/markdown.svelte";
  import { fade } from "svelte/transition";

  let newTag: string;
  let preview = false;
  let customSlug = false;
  let error: Error | null;
  let previousTags: PostSchema["tags"] = [];
  let postData: PostAndContentSchema = {
    tags: [],
    slug: "",
    title: "",
    content: [],
    draft: true,
    description: "",
    feeling: "copacetic",
    publishedDate: new Date(),
  };

  onMount(() => getAllTags().then((t) => (previousTags = t)));

  function addSection(e: Event & { currentTarget: HTMLSelectElement }) {
    if (!e.currentTarget.value || e.currentTarget.value === "default") return;

    let type = e.currentTarget.value as ContentUnion["type"];

    if (type === "youtube") {
      postData.content = [
        ...postData.content,
        {
          type: "youtube",
          id: "",
        },
      ];
    } else {
      postData.content = [
        ...postData.content,
        {
          type,
          content: "add some **markdown**",
        },
      ];
    }

    e.currentTarget.value = "default";
  }

  $: if (postData.title && !customSlug) {
    postData.slug = postData.title.toLocaleLowerCase().replaceAll(" ", "-");
  }

  $: if (error) {
    setTimeout(() => (error = null), 5000);
  }

  function changePublishDate(date: Date | null) {
    postData.publishedDate = date ?? new Date();
  }

  async function handleCreatePost() {
    error = null;
    try {
      await createPost(postData);
    } catch (e) {
      error = e as Error;
    }
  }
</script>

<form class="contents" on:submit|preventDefault={handleCreatePost}>
  <header class="flex justify-between">
    <h1 class="mb-6 font-bold text-3xl lg:text-4xl text-gradient-100">
      {preview ? postData.title || "No Title!" : "Create a post"}
    </h1>
    <button
      type="button"
      class="transition-colors h-10 w-10 p-2 rounded-full border-2 border-accent-100 text-accent-100 hover:bg-accent-100 hover:text-neutral-100"
      on:click={() => (preview = !preview)}
    >
      <span class="sr-only">{preview ? "edit post" : "preview post"}</span>
      {#if preview}
        <slot name="edit" />
      {:else}
        <slot name="preview" />
      {/if}
    </button>
  </header>

  <article
    class="prose contents lg:block lg:prose-lg prose-custom prose-headings:tracking-tighter prose-headings:font-bold prose-headings:text-gradient-100 pb-20"
  >
    {#if !preview}
      <section class="flex gap-8 mr-8">
        <Field
          label="Title"
          minlength={3}
          maxlength={60}
          bind:value={postData.title}
          class="flex-1"
        />
        <Field
          label="Draft"
          type="checkbox"
          bind:checked={postData.draft}
          class="flex-none"
        />
      </section>

      <Field
        label="Slug"
        on:focus={() => (customSlug = true)}
        on:change={() => {
          if (!postData.slug.length) customSlug = false;
        }}
        bind:value={postData.slug}
        class="flex-1"
      />

      <Field
        label="Description"
        minlength={50}
        maxlength={160}
        bind:value={postData.description}
      />

      <section class="lg:flex gap-8 flex-wrap">
        <Field
          type="date"
          class="flex-1"
          label="Published Date"
          on:change={(e) => changePublishDate(e.currentTarget.valueAsDate)}
          value={postData.publishedDate.toISOString().substring(0, 10)}
        />

        <Field label="Feeling" class="flex-1">
          <select bind:value={postData.feeling}>
            {#each FEELINGS as feeling}
              <option>{feeling}</option>
            {/each}
          </select>
        </Field>
      </section>

      <section class="lg:flex gap-8">
        <form
          class="flex-1"
          on:submit|preventDefault={() => {
            if (newTag.length <= 1) return;
            previousTags = [newTag, ...previousTags];
            newTag = "";
          }}
        >
          <Field label="Add a tag">
            <input bind:value={newTag} />
          </Field>
        </form>
        <Field label="Tags" class="flex-1">
          <select bind:value={postData.tags} multiple>
            {#each previousTags as tag}
              <option selected={postData.tags.includes(tag)}>{tag}</option>
            {/each}
          </select>
        </Field>
      </section>
    {/if}

    {#each postData.content as section, i}
      {#if section.type !== "youtube"}
        <Markdown
          type={section.type}
          on:remove={() => {
            postData.content = postData.content.filter((c) => c !== section);
          }}
          {preview}
          bind:content={section.content}
        />
      {:else if section.type === "youtube"}
        {#if preview}
          <Ytplayer id={section.id} />
        {:else}
          <Field
            removeable
            label="YouTube ID"
            bind:value={section.id}
            on:remove={() => {
              postData.content = postData.content.filter((c) => c !== section);
            }}
          />
        {/if}
      {/if}
    {/each}
    {#if !preview}
      <footer class="flex justify-center my-4">
        <select
          on:change={addSection}
          class="px-3 py-2 rounded-md border border-default-100/10 bg-transparent font-mono font-bold text-center text-accent-300"
        >
          <option value="default">Add a section</option>
          <option value="markdown">Markdown</option>
          <option value="tldr">TL;DR</option>
          <option value="sidenote">Sidenote</option>
          <option value="youtube">YouTube</option>
        </select>
      </footer>
    {/if}
  </article>
  <footer class="mt-auto flex justify-center lg:justify-end items-end">
    {#if error}
      <div
        transition:fade
        class="p-4 m-3 border border-accent-200 rounded-md text-accent-200 bg-accent-200/5"
      >
        {@html error.message}
      </div>
    {/if}
    <button
      type="submit"
      class="px-3 py-2 rounded-md border border-default-100/10 bg-transparent font-mono font-bold text-center text-accent-200"
    >
      Create
    </button>
  </footer>
</form>
