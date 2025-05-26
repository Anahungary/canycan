// src/content/autores/schema.ts
import { z } from 'astro:content';

export const authorsSchema = z.object({
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