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
      colors: ({ colors }) => ({
        "accent-100": colors.indigo[500],
        "accent-200": colors.rose[500],
        "accent-300": colors.amber[500],
        "default-100": "hsl(var(--theme-default-100) / <alpha-value>)",
        "default-200": "hsl(var(--theme-default-200) / <alpha-value>)",
        "neutral-100": "hsl(var(--theme-neutral-100) / <alpha-value>)",
        "neutral-200": "hsl(var(--theme-neutral-200) / <alpha-value>)",
      }),
      keyframes: {
        "hue-rotate": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(-30deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.3", tranform: "rotate(360deg)" },
          "50%": { opacity: "0.6", transform: "rotate(180deg)" },
        },
      },
      animation: {
        "hue-rotate": `hue-rotate 10s infinite`,
        pulse: "pulse 5s linear infinite",
      },
      typography: (theme: (i: string) => void) => ({
        custom: {
          css: {
            "--tw-prose-body": theme("colors.default-100 / 1"),
            "--tw-prose-headings": theme("colors.accent-100 / 1"),
            "--tw-prose-links": theme("colors.accent-100 / 1"),
            "--tw-prose-bold": theme("colors.default-100 / 1"),
            "--tw-prose-bullets": theme("colors.default-100 / 1"),
            "--tw-prose-quotes": theme("colors.default-100 / 1"),
            "--tw-prose-code": theme("colors.default-100 / 1"),
            "--tw-prose-quote-borders": theme("colors.accent-100 / 1"),
            "--tw-prose-hr": `0.5px dashed ${theme(
              "colors.default-100 / 0.5",
            )}`,
            "--tw-prose-th-borders": theme("colors.default-100 / 0.5"),
          },
        },
        DEFAULT: {
          css: {
            a: {
              "@apply link-dotted": "",
            },
            blockquote: {
              "@apply not-italic font-semibold mx-6 bg-default-100/5 py-1": "",
            },
            pre: {
              "@apply dark:!bg-default-100/5 tracking-normal flex flex-row-reverse":
                "",
            },
            code: {
              "@apply px-2 flex-1 inline-block dark:bg-default-100/5 text-default-100 rounded-md !font-mono !font-semibold text-sm lg:!text-base":
                "",
            },
            hr: {
              "@apply border-0 border-b-2 border-dotted border-default-100/10":
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
        ".link": {
          "@apply transition-colors rounded-sm text-accent-100 ease-in inline-block px-1 font-semibold decoration-accent-100 hover:bg-accent-100 hover:no-underline hover:text-neutral-100":
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
        ".text-gradient-100": {
          "@apply bg-cover bg-gradient-to-b from-default-100 to-default-200 text-transparent bg-clip-text":
            "",
        },
        ".text-gradient-200": {
          "@apply bg-cover bg-gradient-to-r from-accent-100 to-accent-200 text-transparent bg-clip-text":
            "",
        },
        ".text-gradient-300": {
          "@apply bg-cover bg-gradient-to-r from-accent-100 via-accent-200 to-accent-300 text-transparent bg-clip-text":
            "",
        },
        ".bg-grid": {
          "background-position": "-9px",
          "background-size": "100px 100px",
          "background-image": "url('/grid.png')",
          "-webkit-mask-image":
            "linear-gradient(0deg, transparent 70%, rgba(255,255,255,0.8))",
          "mask-image": "linear-gradient(to bottom, white, 5%, transparent)",
        },
      });
    }),
  ],
} satisfies Config;
