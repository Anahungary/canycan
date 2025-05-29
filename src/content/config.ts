// src/content/config.ts - CONFIGURACIÓN PRINCIPAL
import { defineCollection } from 'astro:content';

// Importar todos los schemas
import { articulosSchema } from './articulos/schema';
import { razasSchema } from './razas/schema';
import { autoresSchema } from './autores/schema';
import { categoriasSchema } from './categorias/schema';
import { etiquetasSchema } from './etiquetas/schema';
import { paginasSchema } from './paginas/schema';

// Definir las colecciones
const articulosCollection = defineCollection({
  type: 'content',
  schema: articulosSchema,
});

const razasCollection = defineCollection({
  type: 'content',
  schema: razasSchema,
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

// Exportar todas las colecciones
export const collections = {
  articulos: articulosCollection,
  razas: razasCollection,
  autores: autoresCollection,
  categorias: categoriasCollection,
  etiquetas: etiquetasCollection,
  paginas: paginasCollection,
};