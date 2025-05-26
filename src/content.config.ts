// ACTUALIZAR src/content.config.ts - AGREGAR CATEGORÍAS
import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().optional(),
    category: z.string().optional(), // ← AGREGAR REFERENCIA A CATEGORÍA
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional()
  })
});

// ← NUEVA COLECCIÓN SIMPLE
const categoriesCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    color: z.string().optional()
  })
});

export const collections = {
  'articulos': articlesCollection,
  'categorias': categoriesCollection  // ← AGREGAR GRADUALMENTE
};