// src/content/razas/schema.ts
import { z } from 'astro:content';

export const breedsSchema = z.object({
  // Metadatos básicos
  name: z.string().min(2).max(50),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(50).max(500),
  
  // Imágenes
  images: z.array(z.string().url()).min(1),
  
  // Características básicas
  type: z.enum(['dog', 'cat']),
  size: z.enum(['small', 'medium', 'large']),
  weight: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  height: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }).optional(),
  lifespan: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  
  // Características detalladas
  traits: z.array(z.object({
    name: z.string(),
    value: z.number().int().min(1).max(5),
    description: z.string(),
  })),
  
  // Convivencia
  goodWith: z.array(z.enum(['children', 'dogs', 'cats', 'seniors', 'apartments'])),
  
  // Puntuaciones (1-5)
  energyLevel: z.number().int().min(1).max(5),
  friendliness: z.number().int().min(1).max(5),
  grooming: z.number().int().min(1).max(5),
  training: z.number().int().min(1).max(5),
  
  // Características especiales
  hypoallergenic: z.boolean().default(false),
  
  // Información detallada
  history: z.string().min(50),
  origins: z.string().min(50),
  temperament: z.array(z.string()),
  
  // Salud
  healthIssues: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  
  // Guía de cuidados
  careGuide: z.string().min(100),
  
  // Relaciones
  similarBreeds: z.array(z.string()),
  
  // SEO y configuración
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  featured: z.boolean().default(false),
});