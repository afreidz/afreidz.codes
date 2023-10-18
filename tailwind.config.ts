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
      typography: (theme: (i: string) => void) => ({
        custom: {
          css: {
            "--tw-prose-body": theme("colors.textColor / 1"),
            "--tw-prose-headings": theme("colors.accent / 1"),
            "--tw-prose-links": theme("colors.textColor / 1"),
            "--tw-prose-bold": theme("colors.textColor / 1"),
            "--tw-prose-bullets": theme("colors.textColor / 1"),
            "--tw-prose-quotes": theme("colors.textColor / 1"),
            "--tw-prose-code": theme("colors.textColor / 1"),
            "--tw-prose-quote-borders": theme("colors.accent / 1"),
            "--tw-prose-hr": `0.5px dashed ${theme("colors.textColor / 0.5")}`,
            "--tw-prose-th-borders": theme("colors.textColor / 0.5"),
          },
        },
        DEFAULT: {
          css: {
            a: {
              "@apply underline": "",
            },
            blockquote: {
              "@apply animate-hue-rotate font-grotesk not-italic font-semibold mx-6":
                "",
            },
            code: {
              "@apply bg-black/30 px-2 before:hidden after:hidden rounded-sm":
                "",
            },
          },
        },
      }),
    },
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
          "text-underline-offset": "0.4em",
          "@apply transition-colors ease-in inline-block font-semibold animate-hue-rotate decoration-accent decoration-[3px] hover:bg-accent px-1 hover:no-underline hover:text-bgColor":
            "",
        },
      });
    }),
  ],
} satisfies Config;
