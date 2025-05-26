// src/content.config.ts
import { defineCollection } from 'astro:content';
import { articlesSchema } from './content/articulos/schema';
import { breedsSchema } from './content/razas/schema';
import { categoriesSchema } from './content/categoria/schema';
import { tagsSchema } from './content/etiquetas/schema';
import { authorsSchema } from './content/autores/schema';
import { pagesSchema } from './content/paginas/schema';

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
  'categoria': defineCollection({ 
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