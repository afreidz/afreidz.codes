import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function calculateReadingTime() {
  return function (tree: any, { data }: { data: any }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
