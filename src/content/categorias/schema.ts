// src/content/categorias/schema.ts
import { z } from 'astro:content';

export const categoriesSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(200),
  image: z.string().min(1),
  color: z.enum(['primary', 'secondary', 'success', 'info']).default('primary'),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Relaciones
  parentCategory: z.string().optional(),
  subcategories: z.array(z.string()).optional(),
  relatedCategories: z.array(z.string()).optional(),
  
  // Orden y visualización
  order: z.number().int().nonnegative().default(0),
  showInNavigation: z.boolean().default(true),
  showInSidebar: z.boolean().default(true),
});