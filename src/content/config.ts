// src/content/config.ts - SIN RAZAS
import { defineCollection } from 'astro:content';

// Importar schemas (SIN razas)
import { articulosSchema } from './articulos/schema';
import { autoresSchema } from './autores/schema';
import { categoriasSchema } from './categorias/schema';
import { etiquetasSchema } from './etiquetas/schema';
import { paginasSchema } from './paginas/schema';

// Definir las colecciones
const articulosCollection = defineCollection({
  type: 'content',
  schema: articulosSchema,
});

const autoresCollection = defineCollection({
  type: 'content',
  schema: autoresSchema,
});

const categoriasCollection = defineCollection({
  type: 'content',
  schema: categoriasSchema,
});

const etiquetasCollection = defineCollection({
  type: 'content',
  schema: etiquetasSchema,
});

const paginasCollection = defineCollection({
  type: 'content',
  schema: paginasSchema,
});

// Exportar colecciones SIN razas
export const collections = {
  articulos: articulosCollection,
  autores: autoresCollection,
  categorias: categoriasCollection,
  etiquetas: etiquetasCollection,
  paginas: paginasCollection,
};