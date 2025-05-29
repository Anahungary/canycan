// src/content/categorias/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const categoriasSchema = z.object({
  // Información básica
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  
  // Visual
  image: z.string().optional(),
  icon: z.string().optional(),
  color: z.enum(['primary', 'secondary', 'success', 'info', 'warning', 'danger']).default('primary'),
  
  // Jerarquía
  parentCategory: z.string().optional(),
  subcategories: z.array(z.string()).optional(),
  
  // Configuración
  order: z.number().default(0),
  showInNavigation: z.boolean().default(true),
  showInSidebar: z.boolean().default(true),
  featured: z.boolean().default(false),
  
  // Estadísticas
  articleCount: z.number().default(0),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});