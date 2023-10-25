import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import defaultTheme from "tailwindcss/defaultTheme";
import containerQuery from "@tailwindcss/container-queries";

export default {
  content: ["./src/**/*.{astro,html,js,md,svelte,ts}"],
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
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI,Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        default: "hsl(var(--theme-100) / <alpha-value>)",
        accent: "hsl(var(--theme-500) / <alpha-value>)",
        neutral: "hsl(var(--theme-900) / <alpha-value>)",
        "accent-rotated": "hsl(var(--theme-600) / <alpha-value>)",
      },
      keyframes: {
        "hue-rotate": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(-30deg)" },
        },
      },
      animation: {
        "hue-rotate": `hue-rotate 10s infinite`,
      },
      typography: (theme: (i: string) => void) => ({
        custom: {
          css: {
            "--tw-prose-body": theme("colors.default / 1"),
            "--tw-prose-headings": theme("colors.accent / 1"),
            "--tw-prose-links": theme("colors.accent / 1"),
            "--tw-prose-bold": theme("colors.default / 1"),
            "--tw-prose-bullets": theme("colors.default / 1"),
            "--tw-prose-quotes": theme("colors.default / 1"),
            "--tw-prose-code": theme("colors.default / 1"),
            "--tw-prose-quote-borders": theme("colors.accent / 1"),
            "--tw-prose-hr": `0.5px dashed ${theme("colors.default / 0.5")}`,
            "--tw-prose-th-borders": theme("colors.default / 0.5"),
          },
        },
        DEFAULT: {
          css: {
            a: {
              "@apply link-dotted": "",
            },
            blockquote: {
              "@apply not-italic font-semibold mx-6 bg-default/5 py-1": "",
            },
            pre: {
              "@apply dark:!bg-default/5 tracking-normal flex flex-row-reverse":
                "",
            },
            code: {
              "@apply px-2 flex-1 inline-block dark:bg-default/5 text-white rounded-md !font-mono !font-semibold text-sm lg:!text-base":
                "",
            },
            hr: {
              "@apply border-0 border-b-2 border-dotted border-default/10": "",
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
        ".link": {
          "@apply transition-colors text-accent-rotated ease-in inline-block px-1 font-semibold decoration-accent-rotated hover:bg-accent-rotated hover:no-underline hover:text-neutral":
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
        ".gradient-text": {
          "@apply bg-gradient-to-b from-accent to-accent-rotated text-transparent bg-clip-text":
            "",
        },
      });
    }),
  ],
} satisfies Config;
