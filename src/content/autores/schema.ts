// src/content/autores/schema.ts
import { z } from 'astro:content';

export const authorsSchema = z.object({
  // Información básica
  name: z.string().min(2).max(100),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  
  // Imagen de perfil - MENOS RESTRICTIVO
  avatar: z.string().min(1), // Cambio: solo requiere que sea un string no vacío
  
  // Información de contacto
  email: z.string().email().optional(),
  
  // Biografías
  bio: z.string().min(50).max(500),
  shortBio: z.string().max(150).optional(),
  
  // Información profesional
  role: z.string().max(100).optional(),
  specialties: z.array(z.string()).default([]),
  
  // Sitio web - MENOS RESTRICTIVO
  website: z.string().optional(), // Cambio: no valida URL
  
  // Redes sociales - MENOS RESTRICTIVO
  socialMedia: z.object({
    twitter: z.string().optional(), // Cambio: sin regex
    instagram: z.string().optional(), // Cambio: sin regex
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