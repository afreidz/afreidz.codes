import { FEELINGS } from "@/config";
import { z, defineCollection } from "astro:content";

function dedupeAndLower(array: string[]) {
  if (!array.length) return array;
  const lower = array.map((s) => s.toLowerCase());
  return Array.from(new Set(lower));
}

const schema = z.object({
  title: z.string().max(60),
  description: z.string().min(50).max(160),
  feeling: z.enum(FEELINGS),
  publishedDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  updatedDate: z
    .string()
    .or(z.date())
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]).transform(dedupeAndLower),
});

const post = defineCollection({
  type: "content",
  schema: () => schema,
});

export const collections = { post };
export type PostSchema = z.infer<typeof schema>;
