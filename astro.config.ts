import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { calculateReadingTime } from "./src/utils/readingTime";

export default defineConfig({
  site: "https://afreidz.codes",
  markdown: {
    remarkPlugins: [calculateReadingTime],
  },
  integrations: [tailwind(), svelte(), mdx(), prefetch()],
});
