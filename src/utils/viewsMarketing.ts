// utils/viewsMarketing.ts - Sistema de visualizaciones con estrategia de marketing

/**
 * Genera número de visualizaciones con estrategia de marketing
 * Empieza desde 50 y algunos artículos tienen números aleatorios más altos
 */
export function generateMarketingViews(articleSlug: string, isPopular: boolean = false): number {
  // Usar el slug para generar un número "aleatorio" pero consistente
  const hash = articleSlug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const seed = Math.abs(hash);
  
  if (isPopular) {
    // Artículos "populares" - entre 200 y 1500 visualizaciones
    return 200 + (seed % 1300);
  } else {
    // Artículos normales - entre 50 y 300 visualizaciones
    return 50 + (seed % 250);
  }
}

/**
 * Función para usar en ArticleLayout.astro
 * Reemplaza el views original con estrategia de marketing
 */
export function getDisplayViews(views: number | undefined, articleSlug: string, category?: string): number {
  // Si ya tiene views definidas y son mayores a 50, mantenerlas
  if (views && views >= 50) {
    return views;
  }
  
  // Categorías que consideramos "populares" para marketing
  const popularCategories = ['entrenamiento', 'alimentacion', 'salud', 'cachorros'];
  const isPopular = Boolean(category && popularCategories.includes(category.toLowerCase()));
  
  return generateMarketingViews(articleSlug, isPopular);
}

// Para usar en ArticleLayout.astro:
/*
// En lugar de:
{views && (
  <p class="text-sm text-gray-500">👁️ {views.toLocaleString()} visualizaciones</p>
)}

// Usar:
<p class="text-sm text-gray-500">👁️ {getDisplayViews(views, articulo.slug, articulo.data.category).toLocaleString()} visualizaciones</p>
*/