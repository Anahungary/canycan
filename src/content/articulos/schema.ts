// src/content/articulos/schema.ts
import { z } from 'astro:content';

export const articlesSchema = z.object({
  // Campos básicos requeridos
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  image: z.string(),
  date: z.date(),
  author: z.string(),
  categories: z.array(z.string()),
  
  // Campos opcionales con defaults
  tags: z.array(z.string()).default([]),
  readingTime: z.number().default(5),
  featured: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  views: z.number().default(0).optional(),
  likes: z.number().default(0).optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional()
});