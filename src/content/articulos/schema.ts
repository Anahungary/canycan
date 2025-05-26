// src/content/articulos/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const articlesSchema = z.object({
  // Información básica
  title: z.string(),
  description: z.string(),
  date: z.date(),
  
  // Autor y biografía
  author: z.string().optional(),
  authorBio: z.string().optional(),
  
  // Clasificación
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  
  // Metadatos de artículo
  image: z.string().optional(),
  readingTime: z.number().optional(),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});