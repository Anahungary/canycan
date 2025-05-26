// src/content/autores/schema.ts
import { z } from 'astro:content';

export const authorsSchema = z.object({
  // Información básica
  name: z.string().min(2).max(100),
  
  // Imagen de perfil
  avatar: z.string().min(1),
  
  // Información de contacto
  email: z.string().email().optional(),
  
  // Biografías
  bio: z.string().min(50).max(500),
  shortBio: z.string().max(150).optional(),
  
  // Información profesional
  role: z.string().max(100).optional(),
  specialties: z.array(z.string()).default([]),
  
  // Sitio web
  website: z.string().optional(),
  
  // Redes sociales
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional()
  }).optional(),
  
  // Estado del autor
  status: z.enum(['active', 'inactive']).default('active'),
  
  // SEO
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  
  // Metadatos adicionales (opcionales)
  articlesCount: z.number().int().nonnegative().default(0).optional(),
  joinDate: z.date().optional(),
  lastActive: z.date().optional()
});