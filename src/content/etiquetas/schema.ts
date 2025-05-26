// src/content/etiquetas/schema.ts
import { z } from 'astro:content';

export const tagsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  categories: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});
