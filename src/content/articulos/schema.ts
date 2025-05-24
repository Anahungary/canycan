// src/content/articulos/schema.ts
import { z } from 'astro:content';

export const articlesSchema = z.object({
  // Metadatos básicos
  title: z.string().min(5).max(100),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(100),
  image: z.string().url(),
  date: z.date(),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Categorización
  categories: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  
  // Autor
  author: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
    bio: z.string().optional(),
  }),
  
  // Métricas y configuración
  readingTime: z.number().int().positive(),
  featured: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  
  // Relaciones
  relatedArticles: z.array(z.string()).optional(),
  
  // Estado de publicación
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});