import { defineCollection, z } from 'astro:content';

// Schema completo para artículos
const articlesCollection = defineCollection({
  schema: z.object({
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
  })
});

export const collections = {
  'articulos': articlesCollection
};