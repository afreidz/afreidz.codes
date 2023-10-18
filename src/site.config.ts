export type SiteConfig = {
  title: string;
  email: string;
  author: string;
  locale: string;
  description: string;
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
