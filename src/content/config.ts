// src/content/config.ts
import { defineCollection } from 'astro:content';
import { articlesSchema } from './articulos/schema';
import { breedsSchema } from './razas/schema';
import { categoriesSchema } from './categorias/schema';
import { tagsSchema } from './etiquetas/schema';
import { authorsSchema } from './autores/schema';
import { pagesSchema } from './paginas/schema';

export const collections = {
  'articulos': defineCollection({ schema: articlesSchema }),
  'razas': defineCollection({ schema: breedsSchema }),
  'categorias': defineCollection({ schema: categoriesSchema }),
  'etiquetas': defineCollection({ schema: tagsSchema }),
  'autores': defineCollection({ schema: authorsSchema }),
  'paginas': defineCollection({ schema: pagesSchema }),
};