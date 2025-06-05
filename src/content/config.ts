// src/content/config.ts - SISTEMA DE TAGS MEJORADO
import { defineCollection, z } from 'astro:content';

// 📰 ARTÍCULOS - Schema optimizado para tags
const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    // ✅ CAMPOS BÁSICOS
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string(),
    authorBio: z.string().optional(),
    
    // ✅ CATEGORIZACIÓN MEJORADA
    category: z.string(), // Categoría principal
    tags: z.array(z.string()).default([]), // Tags secundarios
    primaryTag: z.string().optional(), // Tag principal para destacar
    
    // ✅ METADATA DE CONTENIDO
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readingTime: z.number().default(5),
    status: z.enum(['draft', 'published']).default('published'),
    featured: z.boolean().default(false),
    
    // ✅ CLASIFICACIÓN AVANZADA
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    petType: z.enum(['dog', 'cat', 'both']).default('both'),
    ageGroup: z.enum(['puppy', 'adult', 'senior', 'all']).default('all'),
    
    // ✅ SEO
    excerpt: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    
    // ✅ MÉTRICAS
    views: z.number().default(0),
    priority: z.number().min(1).max(10).default(5), // Para ordenamiento
  })
});

// 🏷️ ETIQUETAS - Schema completo
const etiquetas = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(), // Para URLs amigables
    description: z.string(),
    icon: z.string().optional(), // Emoji o ícono
    
    // ✅ VISUALIZACIÓN
    color: z.enum([
      'green', 'blue', 'purple', 'orange', 'red', 'yellow', 
      'pink', 'indigo', 'teal', 'cyan', 'gray'
    ]).default('blue'),
    
    // ✅ ORGANIZACIÓN
    category: z.string(), // Categoría padre
    subcategories: z.array(z.string()).default([]),
    relatedTags: z.array(z.string()).default([]), // Tags relacionados
    
    // ✅ METADATA
    featured: z.boolean().default(false),
    trending: z.boolean().default(false),
    order: z.number().default(0), // Para ordenamiento manual
    
    // ✅ ESTADÍSTICAS (se actualizan automáticamente)
    articlesCount: z.number().default(0),
    popularityScore: z.number().default(0),
    
    // ✅ SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    image: z.string().optional(),
  })
});

// 📂 CATEGORÍAS - Schema mejorado
const categorias = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    icon: z.string().default('📁'),
    
    // ✅ VISUALIZACIÓN
    color: z.enum(['green', 'blue', 'purple', 'orange', 'red', 'yellow']).default('blue'),
    image: z.string().optional(),
    headerImage: z.string().optional(), // Para hero de categoría
    
    // ✅ ORGANIZACIÓN
    parentCategory: z.string().optional(), // Para subcategorías
    subcategories: z.array(z.string()).default([]),
    defaultTags: z.array(z.string()).default([]), // Tags predeterminados
    
    // ✅ CONFIGURACIÓN
    featured: z.boolean().default(false),
    order: z.number().default(0),
    showInMenu: z.boolean().default(true),
    
    // ✅ SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  })
});

// 🐕 RAZAS - Schema actualizado
const razas = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    type: z.enum(['dog', 'cat']),
    
    // ✅ CARACTERÍSTICAS FÍSICAS
    size: z.enum(['small', 'medium', 'large']),
    weight: z.string().optional(),
    height: z.string().optional(),
    lifeSpan: z.string().optional(),
    origin: z.string().optional(),
    
    // ✅ PUNTUACIONES (1-5)
    energyLevel: z.number().min(1).max(5),
    friendliness: z.number().min(1).max(5),
    grooming: z.number().min(1).max(5),
    training: z.number().min(1).max(5),
    
    // ✅ COMPATIBILIDAD
    goodWith: z.array(z.enum([
      'children', 'dogs', 'cats', 'seniors', 'apartments',
      'first-time-owners', 'active-families', 'singles'
    ])).default([]),
    
    // ✅ CARACTERÍSTICAS ESPECIALES
    hypoallergenic: z.boolean().default(false),
    temperament: z.array(z.string()).default([]),
    commonHealthIssues: z.array(z.string()).default([]),
    
    // ✅ CONTENIDO
    description: z.string(),
    image: z.string(),
    images: z.array(z.string()).optional(),
    
    // ✅ METADATA
    featured: z.boolean().default(false),
    popularity: z.number().min(1).max(10).default(5),
    
    // ✅ TAGS RELACIONADOS
    relatedTags: z.array(z.string()).default([]),
    breedGroup: z.string().optional(), // Ej: "Sporting", "Herding"
  })
});

// 🚀 EXPORTAR COLECCIONES
export const collections = {
  articulos,
  categorias,
  etiquetas,
  razas,
};