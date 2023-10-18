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
              "@apply link-dotted": "",
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
        ".link": {
          "@apply transition-colors text-accent ease-in inline-block px-1 font-semibold animate-hue-rotate decoration-accent hover:bg-accent hover:no-underline hover:text-bgColor":
            "",
        },
        ".link-wavy": {
          "@apply link": "",
          "text-decoration-style": "wavy",
          "text-underline-offset": "0.25em",
          "text-decoration-line": "underline",
        },
        ".link-dotted": {
          "@apply link": "",
          "text-underline-offset": "0.4em",
          "text-decoration-style": "dotted",
          "text-decoration-line": "underline",
        },
        ".link-underline": {
          "@apply link": "",
          "text-underline-offset": "0.4em",
          "text-decoration-style": "solid",
          "text-decoration-line": "underline",
        },
      });
    }),
  ],
} satisfies Config;
