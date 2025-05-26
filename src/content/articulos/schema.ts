// src/content/articulos/schema.ts - EXPANDIDO
import { z } from 'astro:content';

export const articlesSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  // CAMPOS ADICIONALES PARA TU LAYOUT:
  image: z.string().optional(),
  readingTime: z.number().optional(),
  category: z.string().optional(),
});