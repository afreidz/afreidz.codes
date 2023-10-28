import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";
import { calculateReadingTime } from "./src/utils/readingTime";

// https://astro.build/config
export default defineConfig({
  site: "https://afreidz.codes",
  markdown: {
    remarkPlugins: [calculateReadingTime],
  },
  integrations: [mdx(), svelte(), tailwind(), prefetch()],
  vite: {
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  output: "static",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: { enabled: true, },
  }),
});
