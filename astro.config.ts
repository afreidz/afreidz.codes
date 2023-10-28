import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import { defineConfig } from "astro/config";
import { calculateReadingTime } from "./src/utils/readingTime";

// https://astro.build/config
export default defineConfig({
  site: "https://afreidz.codes",
  markdown: {
    remarkPlugins: [calculateReadingTime],
  },
  integrations: [
    mdx(),
    svelte(),
    tailwind(),
    prefetch(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
});
