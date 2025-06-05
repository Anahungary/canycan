// src/content/config.ts - MANTIENE TODO, SOLO CORRIGE FECHAS
import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    // Información básica
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    
    // 🔧 ÚNICA CORRECCIÓN: Fechas que manejan string ISO
    date: z.union([z.date(), z.string()]).transform((val) => {
      return typeof val === 'string' ? new Date(val) : val;
    }),
    updatedAt: z.union([z.date(), z.string()]).transform((val) => {
      return typeof val === 'string' ? new Date(val) : val;
    }).optional(),
    publishedAt: z.union([z.date(), z.string()]).transform((val) => {
      return typeof val === 'string' ? new Date(val) : val;
    }).optional(),
    
    // TODO LO DEMÁS IGUAL
    author: z.string(),
    authorBio: z.string().optional(),
    contributors: z.array(z.string()).optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string(),
    imageAlt: z.string().optional(),
    gallery: z.array(z.object({
      url: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),
    readingTime: z.number().default(5),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    wordCount: z.number().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('published'),
    featured: z.boolean().default(false),
    trending: z.boolean().default(false),
    premium: z.boolean().default(false),
    views: z.number().default(0),
    likes: z.number().default(0),
    shares: z.number().default(0),
    relatedArticles: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    articleType: z.enum(['Article', 'NewsArticle', 'BlogPosting']).default('Article'),
    keywords: z.array(z.string()).optional(),
  })
});

const categorias = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    image: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    featured: z.boolean().optional(),
    order: z.number().optional(),
  })
});

const etiquetas = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    categories: z.array(z.string()).optional(),
  })
});

const razas = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    image: z.string(),
    images: z.array(z.string()).optional(),
    type: z.enum(['dog', 'cat']),
    size: z.enum(['small', 'medium', 'large']),
    energyLevel: z.number().min(1).max(5),
    friendliness: z.number().min(1).max(5),
    grooming: z.number().min(1).max(5),
    training: z.number().min(1).max(5),
    temperament: z.array(z.string()).optional(),
    goodWith: z.array(z.enum(['children', 'dogs', 'cats', 'seniors', 'apartments'])).optional(),
    hypoallergenic: z.boolean().default(false),
    featured: z.boolean().optional(),
  })
});

export const collections = {
  articulos,
  categorias,
  etiquetas,
  
};