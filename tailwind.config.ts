import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import defaultTheme from "tailwindcss/defaultTheme";
import containerQuery from "@tailwindcss/container-queries";

export default {
  content: ["./src/**/*.{astro,html,js,md,svelte,ts}"],
  darkMode: "class",
  corePlugins: {
    aspectRatio: false,
    touchAction: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    scrollSnapType: false,
    borderOpacity: false,
    textOpacity: false,
    fontVariantNumeric: false,
  },
  theme: {
    extend: {
      fontFamily: {
        ortho: ["Nabla", ...defaultTheme.fontFamily.sans],
        mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
        grotesk: ["Space Grotesk", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        link: "hsl(var(--theme-link) / <alpha-value>)",
        bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
        quote: "hsl(var(--theme-quote) / <alpha-value>)",
        textColor: "hsl(var(--theme-text) / <alpha-value>)",
        accent: "hsl(var(--theme-accent) / <alpha-value>)",
      },
      keyframes: {
        "hue-rotate": {
          "0%, 100%": { filter: "hue-rotate(360deg)" },
          "50%": { filter: "hue-rotate(180deg)" },
        },
      },
    },
    typography: (theme: (i: string) => void) => ({
      custom: {
        css: {
          "--tw-prose-body": theme("colors.textColor / 1"),
          "--tw-prose-headings": theme("colors.accent2 / 1"),
          "--tw-prose-links": theme("colors.textColor / 1"),
          "--tw-prose-bold": theme("colors.textColor / 1"),
          "--tw-prose-bullets": theme("colors.textColor / 1"),
          "--tw-prose-quotes": theme("colors.quote / 1"),
          "--tw-prose-code": theme("colors.textColor / 1"),
          "--tw-prose-hr": `0.5px dashed ${theme("colors.textColor / 0.5")}`,
          "--tw-prose-th-borders": theme("colors.textColor / 0.5"),
        },
      },
      DEFAULT: {
        css: {
          a: {
            "@apply wavy-link": "",
          },
        },
      },
    }),
  },
  plugins: [
    typography,
    aspectRatio,
    containerQuery,
    plugin(({ addComponents }) => {
      addComponents({
        ".animate-hue-rotate": {
          animation: "hue-rotate",
          "animation-duration": "60s",
          "animation-iteration-count": "infinite",
        },
        ".wavy-link": {
          "text-underline-offset": "0.25em",
          "text-decoration": "hsl(var(--theme-accent) / 1) wavy underline",
          "@apply inline-block text-accent font-semibold animate-hue-rotate":
            "",
        },
        ".underline": {
          "text-underline-offset": "0.25em",
          "@apply inline-block animate-hue-rotate": "",
          "text-decoration": "hsl(var(--theme-accent) / 1) underline",
        },
      });
    }),
  ],
} satisfies Config;
