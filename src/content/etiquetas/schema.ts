// src/content/etiquetas/schema.ts
import { z } from 'astro:content';

export const tagsSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().max(200).optional(),
  
  // Relaciones y agrupación
  categories: z.array(z.string()).optional(),
  
  // Visualización
  featured: z.boolean().default(false),
});