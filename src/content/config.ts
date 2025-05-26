// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const collections = {
  // Solo definir lo que realmente existe y funciona
  'articulos': defineCollection({ 
    type: 'content',
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      image: z.string(),
      date: z.date(),
      author: z.string(),
      categories: z.array(z.string()),
      tags: z.array(z.string()).optional().default([]),
      readingTime: z.number().optional().default(5),
      featured: z.boolean().optional().default(false),
      showTableOfContents: z.boolean().optional().default(true),
      status: z.enum(['draft', 'published', 'archived']).optional().default('published'),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
  }),

  // Solo incluir autores ya que tienes manuel-bedoya.md
  'autores': defineCollection({ 
    type: 'content',
    schema: z.object({
      name: z.string(),
      slug: z.string(),
      avatar: z.string(),
      email: z.string().optional(),
      bio: z.string(),
      shortBio: z.string().optional(),
      role: z.string().optional(),
      specialties: z.array(z.string()).optional().default([]),
      website: z.string().optional(),
      socialMedia: z.object({
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional()
      }).optional(),
      status: z.enum(['active', 'inactive']).optional().default('active'),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
  }),
};