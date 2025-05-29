// src/content/razas/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const razasSchema = z.object({
  // Información básica
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  
  // Clasificación
  type: z.enum(['dog', 'cat']),
  group: z.string().optional(), // Para razas caninas: Working, Herding, etc.
  size: z.enum(['tiny', 'small', 'medium', 'large', 'giant']),
  
  // Media
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })),
  
  // Características físicas
  weight: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.enum(['kg', 'lbs']).default('kg'),
  }),
  height: z.object({
    min: z.number(),
    max: z.number(),
    unit: z.enum(['cm', 'inches']).default('cm'),
  }).optional(),
  lifespan: z.object({
    min: z.number(),
    max: z.number(),
  }),
  
  // Características de comportamiento (1-5)
  traits: z.object({
    energyLevel: z.number().min(1).max(5),
    friendliness: z.number().min(1).max(5),
    trainability: z.number().min(1).max(5),
    groomingNeeds: z.number().min(1).max(5),
    barkingLevel: z.number().min(1).max(5).optional(),
    sheddingLevel: z.number().min(1).max(5),
    exerciseNeeds: z.number().min(1).max(5),
    socialNeeds: z.number().min(1).max(5),
    protectiveness: z.number().min(1).max(5).optional(),
    adaptability: z.number().min(1).max(5),
    playfulness: z.number().min(1).max(5),
  }),
  
  // Compatibilidad
  goodWith: z.object({
    children: z.boolean().default(false),
    dogs: z.boolean().default(false),
    cats: z.boolean().default(false),
    seniors: z.boolean().default(false),
    apartments: z.boolean().default(false),
    strangers: z.boolean().default(false),
  }),
  
  // Información detallada
  temperament: z.array(z.string()),
  origins: z.string(),
  history: z.string(),
  
  // Cuidados
  careGuide: z.object({
    feeding: z.string(),
    grooming: z.string(),
    exercise: z.string(),
    training: z.string(),
    health: z.string(),
  }),
  
  // Problemas de salud
  healthIssues: z.array(z.object({
    name: z.string(),
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    prevention: z.string().optional(),
  })),
  
  // Características especiales
  hypoallergenic: z.boolean().default(false),
  rare: z.boolean().default(false),
  
  // Costos aproximados
  costs: z.object({
    initial: z.object({
      min: z.number(),
      max: z.number(),
      currency: z.string().default('USD'),
    }).optional(),
    monthly: z.object({
      min: z.number(),
      max: z.number(),
      currency: z.string().default('USD'),
    }).optional(),
  }).optional(),
  
  // Razas relacionadas
  similarBreeds: z.array(z.string()).optional(),
  
  // Estado
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});