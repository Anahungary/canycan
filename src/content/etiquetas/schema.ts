// src/content/etiquetas/schema.ts - SCHEMA COMPLETO
import { z } from 'astro:content';

export const etiquetasSchema = z.object({
  // Información básica
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  
  // Visual
  color: z.string().optional(),
  
  // Relaciones
  categories: z.array(z.string()).optional(),
  
  // Configuración
  featured: z.boolean().default(false),
  
  // Estadísticas
  count: z.number().default(0),
});