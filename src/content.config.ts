// src/content.config.ts - CONFIGURACIÓN COMPLETA
const collections = {
  // ✅ Artículos - Ya funciona
  'articulos': {
    type: 'content' as const,
  },
  
  // ✅ Categorías - Ya funciona  
  'categorias': {
    type: 'content' as const,
  },
  
  // 🆕 Autores
  'autores': {
    type: 'content' as const,
  },
  
  // 🆕 Razas
  'razas': {
    type: 'content' as const,
  },
  
  // 🆕 Etiquetas
  'etiquetas': {
    type: 'content' as const,
  },
  
  // 🆕 Páginas
  'paginas': {
    type: 'content' as const,
  }
};

export { collections };