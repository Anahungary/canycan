// src/content/razas/schema.ts
import { z } from 'astro:content';

export const breedsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  type: z.enum(['dog', 'cat']),
  size: z.enum(['small', 'medium', 'large']),
  weight: z.object({
    min: z.number(),
    max: z.number(),
  }),
  height: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  lifespan: z.object({
    min: z.number(),
    max: z.number(),
  }),
  traits: z.array(z.object({
    name: z.string(),
    value: z.number(),
    description: z.string(),
  })),
  goodWith: z.array(z.enum(['children', 'dogs', 'cats', 'seniors', 'apartments'])),
  energyLevel: z.number(),
  friendliness: z.number(),
  grooming: z.number(),
  training: z.number(),
  hypoallergenic: z.boolean().default(false),
  history: z.string(),
  origins: z.string(),
  temperament: z.array(z.string()),
  healthIssues: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  careGuide: z.string(),
  similarBreeds: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featured: z.boolean().default(false),
});