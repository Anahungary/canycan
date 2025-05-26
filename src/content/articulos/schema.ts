// src/content/articulos/schema.ts
import { z } from 'astro:content';

export const articlesSchema = z.object({
  // Información básica
  title: z.string().min(10).max(200),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(50).max(300),
  
  // Imagen principal - MENOS RESTRICTIVO
  image: z.string().min(1), // Cambio: solo requiere string no vacío
  
  // Fecha de publicación
  date: z.date(),
  
  // Autor (como string que referencia el slug del autor)
  author: z.string().min(1),
  
  // Categorías y etiquetas
  categories: z.array(z.string()).min(1, "Debe tener al menos una categoría"),
  tags: z.array(z.string()).default([]),
  
  // Metadatos del contenido
  readingTime: z.number().int().min(1),
  featured: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  
  // Estado de publicación
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Metadatos opcionales
  views: z.number().int().nonnegative().default(0).optional(),
  likes: z.number().int().nonnegative().default(0).optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional()
});