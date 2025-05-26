import { z } from 'astro:content';

export const categoriesSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  color: z.enum(['primary', 'secondary', 'success', 'info']).default('primary'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  parentCategory: z.string().optional(),
  subcategories: z.array(z.string()).default([]),
  relatedCategories: z.array(z.string()).default([]),
  order: z.number().default(0),
  showInNavigation: z.boolean().default(true),
  showInSidebar: z.boolean().default(true),
});