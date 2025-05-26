// src/content.config.ts
import { defineCollection } from 'astro:content';
import { articlesSchema } from './articulos/schema';
import { authorsSchema } from './autores/schema';

export const collections = {
  'articulos': defineCollection({ 
    type: 'content',
    schema: articlesSchema 
  }),
  
  'autores': defineCollection({ 
    type: 'content',
    schema: authorsSchema 
  }),
};