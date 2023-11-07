import colors from "tailwindcss/colors";

export type SiteConfig = {
  title: string;
  email: string;
  author: string;
  locale: string;
  fulltime: string[];
  parttime: string[];
  description: string;
  highlights: string[];
  socialLinks: SocialLink[];
  date: {
    options: Intl.DateTimeFormatOptions;
  };
};

export type SocialLink = {
  name: string;
  link: string;
  display: string;
  webMention?: boolean;
};

export const highlights: SiteConfig["highlights"] = [
  colors.indigo[500],
  colors.rose[500],
  colors.amber[500],
  colors.violet[500],
  colors.fuchsia[500],
  colors.blue[500],
];

export const fulltime: SiteConfig["fulltime"] = [
  "developer",
  "father",
  "husband",
  "dreamer",
];
export const parttime: SiteConfig["parttime"] = [
  "smartass",
  "sports enthusiast",
  "golfer",
  "tinkerer",
  "functioning human",
  "hockey pylon",
  "sleeper",
];

const contact = "me@afreidz.codes";
export const siteConfig: SiteConfig = {
  email: contact,
  locale: "en-US",
  title: "afreidz.codes",
  author: "Andy Freidenfelds",
  description: "A personal site and blog for Andy Freidenfelds",
  date: {
    options: { day: "numeric", month: "short", year: "numeric" },
  },
  highlights,
  fulltime,
  parttime,
  socialLinks: [
    {
      webMention: true,
      display: "Github",
      name: "mdi:github",
      link: "https://github.com/afreidz",
    },
    {
      display: "LinkedIn",
      name: "mdi:linkedin",
      link: "https://www.linkedin.com/in/andyfreidenfelds/",
    },
    {
      display: "Email",
      name: "mdi:email",
      link: `mailto:${contact}`,
    },
  ],
};
