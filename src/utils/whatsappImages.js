// src/utils/whatsappImages.js - CONFIGURACIÓN DE IMÁGENES PARA WHATSAPP

/**
 * 🔧 GENERADOR DE IMÁGENES OPTIMIZADAS PARA WHATSAPP
 * 
 * WhatsApp requiere:
 * - Ratio 1.91:1 (recomendado: 1200x630px)
 * - Formato JPG o PNG
 * - URL absoluta y accesible
 * - Menos de 8MB
 */

export const WHATSAPP_IMAGE_CONFIG = {
  // Dimensiones recomendadas para WhatsApp
  OPTIMAL_WIDTH: 1200,
  OPTIMAL_HEIGHT: 630,
  MIN_WIDTH: 300,
  MIN_HEIGHT: 200,
  
  // Formatos soportados
  SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  
  // Tamaño máximo
  MAX_SIZE_MB: 8
};

/**
 * 🔧 GENERAR URL DE IMAGEN PARA RAZA ESPECÍFICA
 */
export function generateBreedImageUrl(breed, siteUrl) {
  if (!breed || !breed.name) {
    return generateFallbackImage('general', siteUrl);
  }
  
  // 1. Verificar si tiene imagen específica
  if (breed.image && !breed.image.includes('placeholder')) {
    return makeAbsoluteUrl(breed.image, siteUrl);
  }
  
  // 2. Verificar array de imágenes
  if (breed.images && breed.images.length > 0) {
    const validImage = breed.images.find(img => 
      img && !img.includes('placeholder') && !img.includes('default')
    );
    if (validImage) {
      return makeAbsoluteUrl(validImage, siteUrl);
    }
  }
  
  // 3. Generar imagen basada en características
  return generateBreedSpecificImage(breed, siteUrl);
}

/**
 * 🔧 GENERAR IMAGEN ESPECÍFICA BASADA EN CARACTERÍSTICAS
 */
function generateBreedSpecificImage(breed, siteUrl) {
  const type = breed.type || 'pet';
  const size = breed.size ? breed.size.toLowerCase() : 'medium';
  const origin = breed.origin ? cleanString(breed.origin) : 'general';
  
  // Mapeo de características a imágenes
  const imageMap = {
    // Por tipo y tamaño
    'dog-small': '/images/og/dog-small.jpg',
    'dog-medium': '/images/og/dog-medium.jpg', 
    'dog-large': '/images/og/dog-large.jpg',
    'cat-small': '/images/og/cat-small.jpg',
    'cat-medium': '/images/og/cat-medium.jpg',
    'cat-large': '/images/og/cat-large.jpg',
    
    // Por características especiales
    'hypoallergenic': '/images/og/hypoallergenic-pets.jpg',
    'apartment-friendly': '/images/og/apartment-pets.jpg',
    'family-friendly': '/images/og/family-pets.jpg',
    
    // Por origen geográfico
    'european': '/images/og/european-breeds.jpg',
    'asian': '/images/og/asian-breeds.jpg',
    'american': '/images/og/american-breeds.jpg',
    
    // Fallbacks por tipo
    'dog': '/images/og/dogs-general.jpg',
    'cat': '/images/og/cats-general.jpg',
    'general': '/images/og/pets-general.jpg'
  };
  
  // Priorizar características especiales
  if (breed.hypoallergenic) {
    return `${siteUrl}${imageMap['hypoallergenic']}`;
  }
  
  if (breed.suitableForApartments) {
    return `${siteUrl}${imageMap['apartment-friendly']}`;
  }
  
  if (breed.goodWithKids) {
    return `${siteUrl}${imageMap['family-friendly']}`;
  }
  
  // Por tipo y tamaño
  const key = `${type}-${size}`;
  if (imageMap[key]) {
    return `${siteUrl}${imageMap[key]}`;
  }
  
  // Fallback por tipo
  return `${siteUrl}${imageMap[type] || imageMap['general']}`;
}

/**
 * 🔧 GENERAR IMAGEN PARA ARTÍCULOS
 */
export function generateArticleImageUrl(article, siteUrl) {
  if (!article) {
    return generateFallbackImage('article', siteUrl);
  }
  
  // 1. Usar imagen del artículo si existe
  if (article.image && !article.image.includes('placeholder')) {
    return makeAbsoluteUrl(article.image, siteUrl);
  }
  
  // 2. Generar basado en categoría
  const category = article.category ? article.category.toLowerCase() : 'general';
  
  const categoryImages = {
    'comportamiento': '/images/og/behavior-articles.jpg',
    'salud': '/images/og/health-articles.jpg',
    'alimentacion': '/images/og/nutrition-articles.jpg',
    'entrenamiento': '/images/og/training-articles.jpg',
    'cuidado': '/images/og/care-articles.jpg',
    'cachorros': '/images/og/puppies-articles.jpg',
    'nuevos-duenos': '/images/og/new-owners-articles.jpg',
    'general': '/images/og/articles-general.jpg'
  };
  
  return `${siteUrl}${categoryImages[category] || categoryImages['general']}`;
}

/**
 * 🔧 GENERAR IMAGEN PARA CATEGORÍAS
 */
export function generateCategoryImageUrl(category, siteUrl) {
  if (!category) {
    return generateFallbackImage('category', siteUrl);
  }
  
  const categorySlug = category.slug || category.name.toLowerCase();
  
  const categoryImages = {
    'comportamiento': '/images/og/category-behavior.jpg',
    'salud': '/images/og/category-health.jpg', 
    'alimentacion': '/images/og/category-nutrition.jpg',
    'entrenamiento': '/images/og/category-training.jpg',
    'cuidado': '/images/og/category-care.jpg',
    'cachorros': '/images/og/category-puppies.jpg',
    'razas': '/images/og/category-breeds.jpg'
  };
  
  return `${siteUrl}${categoryImages[categorySlug] || '/images/og/category-general.jpg'}`;
}

/**
 * 🔧 IMAGEN FALLBACK UNIVERSAL
 */
export function generateFallbackImage(type = 'general', siteUrl) {
  const fallbackImages = {
    'breed': '/images/og/breed-default.jpg',
    'article': '/images/og/article-default.jpg',
    'category': '/images/og/category-default.jpg',
    'general': '/images/og/site-default.jpg'
  };
  
  return `${siteUrl}${fallbackImages[type] || fallbackImages['general']}`;
}

/**
 * 🔧 UTILIDADES AUXILIARES
 */
function makeAbsoluteUrl(url, siteUrl) {
  if (url.startsWith('http')) {
    return url;
  }
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

function cleanString(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 🔧 VALIDAR IMAGEN PARA WHATSAPP
 */
export function validateImageForWhatsApp(imageUrl) {
  if (!imageUrl) return false;
  
  try {
    const url = new URL(imageUrl);
    
    // Verificar protocolo HTTPS
    if (url.protocol !== 'https:') {
      return false;
    }
    
    // Verificar extensión
    const extension = url.pathname.split('.').pop().toLowerCase();
    if (!WHATSAPP_IMAGE_CONFIG.SUPPORTED_FORMATS.includes(extension)) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 🔧 GENERAR META TAGS COMPLETOS PARA WHATSAPP
 */
export function generateWhatsAppMetaTags(data, siteUrl) {
  const {
    title,
    description,
    image,
    url,
    type = 'website'
  } = data;
  
  const optimizedImage = image || generateFallbackImage('general', siteUrl);
  const absoluteUrl = makeAbsoluteUrl(url, siteUrl);
  
  return {
    // OpenGraph básico
    'og:type': type,
    'og:site_name': 'Kajú',
    'og:url': absoluteUrl,
    'og:title': title,
    'og:description': description,
    'og:image': optimizedImage,
    
    // Específicos para WhatsApp
    'og:image:width': WHATSAPP_IMAGE_CONFIG.OPTIMAL_WIDTH.toString(),
    'og:image:height': WHATSAPP_IMAGE_CONFIG.OPTIMAL_HEIGHT.toString(),
    'og:image:type': 'image/jpeg',
    'og:image:alt': `${title} - Kajú`,
    'og:locale': 'es_ES',
    
    // Twitter Cards
    'twitter:card': 'summary_large_image',
    'twitter:site': '@Kajú',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': optimizedImage,
    'twitter:image:alt': `${title} - Kajú`,
    
    // Adicionales para mejor compatibilidad
    'article:publisher': siteUrl,
    'fb:app_id': '123456789' // Reemplazar con tu App ID de Facebook si tienes
  };
}

/**
 * 🔧 DEBUGGING: VERIFICAR CONFIGURACIÓN DE WHATSAPP
 */
export function debugWhatsAppConfig() {
  console.group('🔍 WhatsApp Sharing Debug');
  console.log('📋 Configuración:');
  console.table(WHATSAPP_IMAGE_CONFIG);
  
  // Verificar meta tags actuales
  const metaTags = {};
  document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => {
    const key = meta.getAttribute('property') || meta.getAttribute('name');
    const value = meta.getAttribute('content');
    metaTags[key] = value;
  });
  
  console.log('📄 Meta tags actuales:');
  console.table(metaTags);
  
  // Verificar imagen
  const ogImage = metaTags['og:image'];
  if (ogImage) {
    console.log('🖼️ Verificando imagen:', ogImage);
    console.log('✅ Es válida:', validateImageForWhatsApp(ogImage));
    
    // Verificar si la imagen se puede cargar
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Imagen cargada: ${img.width}x${img.height}px`);
      const ratio = (img.width / img.height).toFixed(2);
      console.log(`📐 Ratio: ${ratio} (óptimo: 1.91)`);
    };
    img.onerror = () => {
      console.error('❌ Error cargando imagen');
    };
    img.src = ogImage;
  }
  
  console.groupEnd();
}

/**
 * 🔧 LISTA DE IMÁGENES REQUERIDAS PARA EL SITIO
 */
export const REQUIRED_IMAGES = {
  // Imágenes por defecto del sitio
  '/images/og/site-default.jpg': {
    description: 'Imagen por defecto del sitio',
    dimensions: '1200x630',
    priority: 'alta'
  },
  
  // Imágenes por tipo de mascota
  '/images/og/dogs-general.jpg': {
    description: 'Imagen general de perros',
    dimensions: '1200x630',
    priority: 'alta'
  },
  '/images/og/cats-general.jpg': {
    description: 'Imagen general de gatos', 
    dimensions: '1200x630',
    priority: 'alta'
  },
  '/images/og/pets-general.jpg': {
    description: 'Imagen general de mascotas',
    dimensions: '1200x630',
    priority: 'alta'
  },
  
  // Imágenes por tamaño
  '/images/og/dog-small.jpg': {
    description: 'Perros pequeños',
    dimensions: '1200x630',
    priority: 'media'
  },
  '/images/og/dog-medium.jpg': {
    description: 'Perros medianos',
    dimensions: '1200x630', 
    priority: 'media'
  },
  '/images/og/dog-large.jpg': {
    description: 'Perros grandes',
    dimensions: '1200x630',
    priority: 'media'
  },
  
  // Imágenes por categoría de artículo
  '/images/og/behavior-articles.jpg': {
    description: 'Artículos de comportamiento',
    dimensions: '1200x630',
    priority: 'media'
  },
  '/images/og/health-articles.jpg': {
    description: 'Artículos de salud',
    dimensions: '1200x630',
    priority: 'media'
  },
  '/images/og/nutrition-articles.jpg': {
    description: 'Artículos de alimentación',
    dimensions: '1200x630',
    priority: 'media'
  },
  
  // Imágenes por características especiales
  '/images/og/hypoallergenic-pets.jpg': {
    description: 'Mascotas hipoalergénicas',
    dimensions: '1200x630',
    priority: 'baja'
  },
  '/images/og/apartment-pets.jpg': {
    description: 'Mascotas para apartamentos',
    dimensions: '1200x630', 
    priority: 'baja'
  },
  '/images/og/family-pets.jpg': {
    description: 'Mascotas familiares',
    dimensions: '1200x630',
    priority: 'baja'
  }
};

/**
 * 🔧 GENERAR ARCHIVO DE CONFIGURACIÓN PARA OPTIMIZACIÓN DE IMÁGENES
 */
export function generateImageOptimizationConfig() {
  return {
    // Configuración para herramientas como Sharp, ImageMagick, etc.
    format: 'jpeg',
    quality: 85,
    width: WHATSAPP_IMAGE_CONFIG.OPTIMAL_WIDTH,
    height: WHATSAPP_IMAGE_CONFIG.OPTIMAL_HEIGHT,
    fit: 'cover',
    background: { r: 255, g: 255, b: 255 },
    
    // Configuración de responsive images
    sizes: [
      { width: 1200, height: 630, suffix: '-og' },
      { width: 600, height: 315, suffix: '-og-small' },
      { width: 400, height: 210, suffix: '-og-mobile' }
    ],
    
    // Formatos alternativos
    formats: ['webp', 'jpeg', 'png'],
    
    // Configuración de compresión
    compression: {
      jpeg: { quality: 85, progressive: true },
      webp: { quality: 80, effort: 6 },
      png: { compressionLevel: 9 }
    }
  };
}

// 🔧 EXPORTAR CONFIGURACIÓN POR DEFECTO
export default {
  generateBreedImageUrl,
  generateArticleImageUrl,
  generateCategoryImageUrl,
  generateFallbackImage,
  generateWhatsAppMetaTags,
  validateImageForWhatsApp,
  debugWhatsAppConfig,
  WHATSAPP_IMAGE_CONFIG,
  REQUIRED_IMAGES
};