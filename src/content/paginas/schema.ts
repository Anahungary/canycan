// src/content/paginas/schema.ts
import { z } from 'astro:content';

export const pagesSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string(),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  image: z.string().url().optional(),
  
  // Metadatos
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Navegación
  showInNavigation: z.boolean().default(false),
  showInFooter: z.boolean().default(true),
  navigationOrder: z.number().int().nonnegative().optional(),
  
  // Diseño
  layout: z.enum(['default', 'full-width', 'sidebar']).default('default'),
  
  // Estado
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});