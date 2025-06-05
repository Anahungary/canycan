// src/utils/tags.ts - UTILIDADES PARA MANEJO DE TAGS - CORREGIDO

export interface TagData {
  name: string;
  slug: string;
  description: string;
  color: string;
  category: string;
  articlesCount: number;
  featured: boolean;
  trending: boolean;
}

export interface ArticleTag {
  category: string;
  tags: string[];
  primaryTag?: string;
  petType: 'dog' | 'cat' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 🔧 GENERAR SLUG AUTOMÁTICO PARA TAGS
export function generateTagSlug(tagName: string): string {
  if (!tagName || typeof tagName !== 'string') {
    return 'unknown';
  }
  
  return tagName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno solo
}

// 🎨 MAPEO DE COLORES PARA TAGS
export const TAG_COLORS = {
  // Categorías principales
  'entrenamiento': 'blue',
  'alimentacion': 'green',
  'salud': 'red',
  'comportamiento': 'purple',
  'cuidado': 'teal',
  'adopcion': 'yellow',
  'razas': 'indigo',
  'nuevos-duenos': 'pink',
  
  // Tipos de mascota
  'perros': 'orange',
  'gatos': 'cyan',
  'cachorros': 'yellow',
  
  // Dificultad
  'principiante': 'green',
  'intermedio': 'yellow',
  'avanzado': 'red',
  
  // Fallback
  'default': 'gray'
} as const;

// 🔍 OBTENER COLOR AUTOMÁTICO PARA TAG
export function getTagColor(tagName: string, category?: string): string {
  if (!tagName) return TAG_COLORS.default;
  
  const slug = generateTagSlug(tagName);
  
  // Buscar color específico del tag
  if (TAG_COLORS[slug as keyof typeof TAG_COLORS]) {
    return TAG_COLORS[slug as keyof typeof TAG_COLORS];
  }
  
  // Buscar por categoría
  if (category && TAG_COLORS[generateTagSlug(category) as keyof typeof TAG_COLORS]) {
    return TAG_COLORS[generateTagSlug(category) as keyof typeof TAG_COLORS];
  }
  
  // Color por defecto
  return TAG_COLORS.default;
}

// 📊 ESTADÍSTICAS DE TAGS - CON VALIDACIÓN
export function calculateTagStats(articles: any[]): Map<string, number> {
  const tagCounts = new Map<string, number>();
  
  // 🔧 VALIDAR INPUT
  if (!Array.isArray(articles)) {
    console.warn('calculateTagStats: articles no es un array válido');
    return tagCounts;
  }
  
  articles.forEach(article => {
    // Validar estructura del artículo
    if (!article || !article.data) {
      return;
    }
    
    // Contar categoría principal
    if (article.data.category && typeof article.data.category === 'string') {
      const categorySlug = generateTagSlug(article.data.category);
      if (categorySlug && categorySlug !== 'unknown') {
        tagCounts.set(categorySlug, (tagCounts.get(categorySlug) || 0) + 1);
      }
    }
    
    // Contar tags secundarios
    if (article.data.tags && Array.isArray(article.data.tags)) {
      article.data.tags.forEach((tag: string) => {
        if (tag && typeof tag === 'string') {
          const tagSlug = generateTagSlug(tag);
          if (tagSlug && tagSlug !== 'unknown') {
            tagCounts.set(tagSlug, (tagCounts.get(tagSlug) || 0) + 1);
          }
        }
      });
    }
  });
  
  return tagCounts;
}

// 🔥 OBTENER TAGS TRENDING - CON VALIDACIÓN
export function getTrendingTags(tagStats: Map<string, number> | undefined, limit: number = 8): string[] {
  // 🔧 VALIDACIÓN DE INPUT
  if (!tagStats || !(tagStats instanceof Map)) {
    console.warn('getTrendingTags: tagStats no es un Map válido');
    return [];
  }
  
  if (tagStats.size === 0) {
    return [];
  }
  
  try {
    return Array.from(tagStats.entries())
      .sort(([,a], [,b]) => b - a) // Ordenar por popularidad
      .slice(0, limit)
      .map(([tag]) => tag)
      .filter(tag => tag && typeof tag === 'string');
  } catch (error) {
    console.error('Error en getTrendingTags:', error);
    return [];
  }
}

// 🔗 OBTENER TAGS RELACIONADOS - CON VALIDACIÓN
export function getRelatedTags(currentTag: string, allTags: TagData[], limit: number = 6): TagData[] {
  if (!currentTag || !Array.isArray(allTags)) {
    return [];
  }
  
  const currentTagData = allTags.find(tag => tag && tag.slug === currentTag);
  if (!currentTagData) return [];
  
  try {
    // Filtrar por misma categoría, excluyendo el tag actual
    return allTags
      .filter(tag => 
        tag && 
        tag.slug !== currentTag && 
        tag.category === currentTagData.category
      )
      .sort((a, b) => (b.articlesCount || 0) - (a.articlesCount || 0)) // Por popularidad
      .slice(0, limit);
  } catch (error) {
    console.error('Error en getRelatedTags:', error);
    return [];
  }
}

// 🏷️ NORMALIZAR TAGS DE ARTÍCULO - CON VALIDACIÓN
export function normalizeArticleTags(article: any): {
  allTags: string[];
  displayTags: string[];
  primaryTag: string;
} {
  // Valores por defecto
  const defaultResult = {
    allTags: [],
    displayTags: [],
    primaryTag: ''
  };
  
  if (!article || !article.data) {
    return defaultResult;
  }
  
  const category = article.data.category || '';
  const tags = Array.isArray(article.data.tags) ? article.data.tags : [];
  const primaryTag = article.data.primaryTag || category;
  
  // Todos los tags (categoría + tags)
  const allTags = [category, ...tags].filter(Boolean);
  
  // Tags para mostrar (máximo 4, priorizando el primario)
  const displayTags = [primaryTag, ...tags.filter((tag: string) => tag !== primaryTag)]
    .filter(Boolean)
    .slice(0, 4);
  
  return {
    allTags: allTags.map(generateTagSlug).filter(slug => slug !== 'unknown'),
    displayTags,
    primaryTag
  };
}

// 🎯 BÚSQUEDA INTELIGENTE POR TAGS - CON VALIDACIÓN
export function searchByTags(articles: any[], searchTags: string[]): any[] {
  if (!Array.isArray(articles) || !Array.isArray(searchTags) || !searchTags.length) {
    return articles || [];
  }
  
  const searchSlugs = searchTags.map(generateTagSlug).filter(slug => slug !== 'unknown');
  
  if (searchSlugs.length === 0) {
    return articles;
  }
  
  return articles.filter(article => {
    try {
      const { allTags } = normalizeArticleTags(article);
      
      // El artículo debe tener al menos uno de los tags buscados
      return searchSlugs.some(searchSlug => 
        allTags.includes(searchSlug)
      );
    } catch (error) {
      console.error('Error en searchByTags para artículo:', article?.slug || 'unknown', error);
      return false;
    }
  });
}

// 📝 VALIDAR ESTRUCTURA DE TAG
export function validateTag(tag: any): boolean {
  return !!(
    tag?.name &&
    typeof tag.name === 'string' &&
    tag.name.trim().length > 0
  );
}

// 🔧 GENERAR BREADCRUMBS PARA TAGS - CON VALIDACIÓN
export function generateTagBreadcrumbs(tagSlug: string, tagData?: TagData) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/', icon: '🏠' }
  ];
  
  if (tagData?.category && typeof tagData.category === 'string') {
    breadcrumbs.push({
      label: tagData.category,
      href: `/categorias/${generateTagSlug(tagData.category)}`,
      icon: '📂'
    });
  }
  
  return breadcrumbs;
}

// 💡 SUGERIR TAGS PARA ARTÍCULO - CON VALIDACIÓN
export function suggestTagsForArticle(article: any, allTags: TagData[]): string[] {
  if (!article || !article.data || !Array.isArray(allTags)) {
    return [];
  }
  
  const title = article.data.title?.toLowerCase() || '';
  const description = article.data.description?.toLowerCase() || '';
  const category = article.data.category || '';
  
  const suggestions = new Set<string>();
  
  try {
    // Buscar tags por palabras clave en título y descripción
    allTags.forEach(tag => {
      if (!validateTag(tag)) return;
      
      const tagWords = tag.name.toLowerCase().split(' ');
      
      // Si alguna palabra del tag aparece en título o descripción
      if (tagWords.some(word => 
        title.includes(word) || description.includes(word)
      )) {
        suggestions.add(tag.slug);
      }
      
      // Si el tag está en la misma categoría
      if (tag.category === category) {
        suggestions.add(tag.slug);
      }
    });
  } catch (error) {
    console.error('Error en suggestTagsForArticle:', error);
  }
  
  return Array.from(suggestions).slice(0, 5);
}

// 🔧 FUNCIÓN HELPER PARA CREAR TAGSTATS SEGURO
export function createSafeTagStats(articles: any[]): Map<string, number> {
  try {
    return calculateTagStats(articles);
  } catch (error) {
    console.error('Error creando tagStats:', error);
    return new Map<string, number>();
  }
}

// 🔧 FUNCIÓN HELPER PARA OBTENER TRENDING TAGS SEGURO
export function getSafeTrendingTags(tagStats: Map<string, number> | undefined, limit: number = 8): string[] {
  try {
    return getTrendingTags(tagStats, limit);
  } catch (error) {
    console.error('Error obteniendo trending tags:', error);
    return [];
  }
}

export default {
  generateTagSlug,
  getTagColor,
  calculateTagStats,
  getTrendingTags,
  getRelatedTags,
  normalizeArticleTags,
  searchByTags,
  validateTag,
  generateTagBreadcrumbs,
  suggestTagsForArticle,
  createSafeTagStats,
  getSafeTrendingTags
};