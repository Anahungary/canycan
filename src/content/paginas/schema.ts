// src/content/paginas/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const paginasSchema = z.object({
  // Información básica
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  
  // Fechas
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Configuración de página
  layout: z.enum(['default', 'full-width', 'sidebar', 'landing']).default('default'),
  template: z.string().optional(),
  
  // Navegación
  showInNavigation: z.boolean().default(false),
  showInFooter: z.boolean().default(true),
  navigationOrder: z.number().optional(),
  
  // Estado
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().default(false),
});