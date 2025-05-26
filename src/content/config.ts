// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Schemas directos (sin importar desde archivos separados)
const articlesSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  image: z.string(),
  date: z.date(),
  author: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  readingTime: z.number().default(5),
  featured: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  views: z.number().default(0).optional(),
  likes: z.number().default(0).optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const breedsSchema = z.object({
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

const categoriesSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  color: z.enum(['primary', 'secondary', 'success', 'info']).default('primary'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  parentCategory: z.string().optional(),
  subcategories: z.array(z.string()).default([]),
  relatedCategories: z.array(z.string()).default([]),
  order: z.number().default(0),
  showInNavigation: z.boolean().default(true),
  showInSidebar: z.boolean().default(true),
});

const authorsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  avatar: z.string(),
  email: z.string().optional(),
  bio: z.string(),
  shortBio: z.string().optional(),
  role: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  website: z.string().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional()
  }).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  articlesCount: z.number().default(0).optional(),
  joinDate: z.date().optional(),
  lastActive: z.date().optional()
});

const tagsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  categories: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const pagesSchema = z.object({
  title: z.string(),
  slug: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  showInNavigation: z.boolean().default(false),
  showInFooter: z.boolean().default(true),
  navigationOrder: z.number().optional(),
  layout: z.enum(['default', 'full-width', 'sidebar']).default('default'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

// Definir las colecciones
export const collections = {
  'articulos': defineCollection({ 
    type: 'content',
    schema: articlesSchema 
  }),
  'razas': defineCollection({ 
    type: 'content',
    schema: breedsSchema 
  }),
  'categorias': defineCollection({ 
    type: 'content',
    schema: categoriesSchema 
  }),
  'etiquetas': defineCollection({ 
    type: 'content',
    schema: tagsSchema 
  }),
  'autores': defineCollection({ 
    type: 'content',
    schema: authorsSchema 
  }),
  'paginas': defineCollection({ 
    type: 'content',
    schema: pagesSchema 
  }),
};