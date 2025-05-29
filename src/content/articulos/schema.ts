// src/content/articulos/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const articulosSchema = z.object({
  // Información básica
  title: z.string(),
  description: z.string(),
  excerpt: z.string().optional(),
  
  // Fechas
  date: z.date(),
  updatedAt: z.date().optional(),
  publishedAt: z.date().optional(),
  
  // Autor y créditos
  author: z.string(),
  authorBio: z.string().optional(),
  contributors: z.array(z.string()).optional(),
  
  // Clasificación
  category: z.string(),
  tags: z.array(z.string()).default([]),
  
  // Media
  image: z.string(),
  imageAlt: z.string().optional(),
  gallery: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })).optional(),
  
  // Metadatos del artículo
  readingTime: z.number().default(5),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  wordCount: z.number().optional(),
  
  // Estado y visibilidad
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  premium: z.boolean().default(false),
  
  // Engagement
  views: z.number().default(0),
  likes: z.number().default(0),
  shares: z.number().default(0),
  
  // Artículos relacionados
  relatedArticles: z.array(z.string()).optional(),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  noindex: z.boolean().default(false),
  
  // Schema.org
  articleType: z.enum(['Article', 'NewsArticle', 'BlogPosting']).default('Article'),
  keywords: z.array(z.string()).optional(),
});