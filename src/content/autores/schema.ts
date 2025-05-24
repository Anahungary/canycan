// src/content/autores/schema.ts
import { z } from 'astro:content';

export const authorsSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  avatar: z.string().url(),
  email: z.string().email().optional(),
  
  // Información biográfica
  bio: z.string().min(10).max(500),
  shortBio: z.string().max(160).optional(),
  
  // Roles y especialidades
  role: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  
  // Enlaces externos
  website: z.string().url().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Estado
  status: z.enum(['active', 'inactive']).default('active'),
});