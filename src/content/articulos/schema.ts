import { z } from 'astro:content';

export const articlesSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});