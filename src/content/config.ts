// src/content/config.ts
import { defineCollection } from 'astro:content';
import { articlesSchema } from './articulos/schema';
import { breedsSchema } from './razas/schema';
import { categoriesSchema } from './categorias/schema';
import { tagsSchema } from './etiquetas/schema';
import { authorsSchema } from './autores/schema';
import { pagesSchema } from './paginas/schema';

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