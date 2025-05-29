// src/content/autores/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const autoresSchema = z.object({
  // Información básica
  name: z.string(),
  slug: z.string(),
  avatar: z.string().optional(),
  email: z.string().email().optional(),
  
  // Biografías
  bio: z.string(),
  shortBio: z.string().optional(),
  
  // Información profesional
  role: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  experience: z.string().optional(),
  credentials: z.array(z.string()).optional(),
  
  // Enlaces
  website: z.string().url().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }).optional(),
  
  // Configuración
  status: z.enum(['active', 'inactive']).default('active'),
  featured: z.boolean().default(false),
  
  // Estadísticas
  articlesCount: z.number().default(0),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});