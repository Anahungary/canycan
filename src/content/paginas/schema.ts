// src/content/paginas/schema.ts
import { z } from 'astro:content';

export const pagesSchema = z.object({
  title: z.string(),
  slug: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  showInNavigation: z.boolean().default(false),
  showInFooter: z.boolean().default(true),
  navigationOrder: z.number().optional(),
  layout: z.enum(['default', 'full-width', 'sidebar']).default('default'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});