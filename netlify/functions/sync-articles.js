// netlify/functions/sync-articles.js - VERSIÓN CON SERVICE_ROLE_KEY (BYPASSA RLS)
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Para admin operations

export async function handler(event, context) {
  console.log('🔄 Función sync-articles iniciada (CON SERVICE_ROLE_KEY)');

  // Headers CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Método no permitido' })
    };
  }

  // Verificar variables de entorno
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables de entorno faltantes');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Configuración de Supabase faltante - necesita SERVICE_ROLE_KEY' 
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('🔄 Cargando artículos REALES del CMS...');

    // 📰 CARGAR ARTÍCULOS REALES DEL CMS
    const articlesFromCMS = await loadArticlesFromCMS();
    
    if (articlesFromCMS.length === 0) {
      console.log('⚠️ No se encontraron artículos en el CMS');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No hay artículos para sincronizar',
          stats: { total: 0, synced: 0, errors: 0 },
          results: []
        })
      };
    }

    console.log(`📰 Encontrados ${articlesFromCMS.length} artículos en el CMS`);

    let syncedCount = 0;
    let errorCount = 0;
    const results = [];

    // Sincronizar cada artículo CON MÉTODO DIRECTO (SIN RPC)
    for (const article of articlesFromCMS) {
      try {
        console.log(`🔄 Sincronizando: "${article.title}" (${article.slug})`);

        // 🚫 NO MÁS RPC - USAR UPSERT DIRECTO
        const { data, error } = await supabase
          .from('articles')
          .upsert({
            slug: article.slug,
            title: article.title,
            category: article.category || 'general',
            author: article.author || 'Editor',
            reading_time: article.readingTime || 5,
            views: 0,
            likes: 0,
            shares: 0,
            trending: false,
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'slug'  // Si ya existe, actualizar
          });

        if (error) {
          console.error(`❌ Error sincronizando ${article.slug}:`, error);
          errorCount++;
          results.push({
            slug: article.slug,
            title: article.title,
            status: 'error',
            error: error.message
          });
        } else {
          console.log(`✅ Sincronizado: "${article.title}"`);
          syncedCount++;
          results.push({
            slug: article.slug,
            title: article.title,
            status: 'success'
          });
        }

        // Pausa pequeña para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error crítico sincronizando ${article.slug}:`, error);
        errorCount++;
        results.push({
          slug: article.slug,
          title: article.title || 'Sin título',
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`✅ Sincronización completada: ${syncedCount} exitosos, ${errorCount} errores`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Sincronización completada con Service Role Key (bypassa RLS)`,
        stats: {
          total: articlesFromCMS.length,
          synced: syncedCount,
          errors: errorCount
        },
        results: results,
        samples: results.slice(0, 3).map(r => ({
          slug: r.slug,
          title: r.title,
          status: r.status
        }))
      })
    };

  } catch (error) {
    console.error('❌ Error en sincronización:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error durante la sincronización',
        error: error.message
      })
    };
  }
}

/**
 * 📰 FUNCIÓN PARA CARGAR ARTÍCULOS REALES DEL CMS
 */
async function loadArticlesFromCMS() {
  try {
    console.log('📂 Buscando archivos del CMS...');
    
    // Buscar archivos .md en el directorio de content/articulos
    const articlesPath = path.join(process.cwd(), 'src', 'content', 'articulos');
    
    if (!fs.existsSync(articlesPath)) {
      console.log('❌ Directorio de artículos no encontrado:', articlesPath);
      return [];
    }

    const files = fs.readdirSync(articlesPath).filter(file => file.endsWith('.md'));
    console.log(`📂 Encontrados ${files.length} archivos .md`);

    const articles = [];

    for (const file of files) {
      try {
        const filePath = path.join(articlesPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extraer frontmatter (datos entre ---)
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const slug = file.replace('.md', '');
          
          // Extraer título del frontmatter
          const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?$/m);
          const categoryMatch = frontmatter.match(/category:\s*["']?(.*?)["']?$/m);
          const authorMatch = frontmatter.match(/author:\s*["']?(.*?)["']?$/m);
          const readingTimeMatch = frontmatter.match(/readingTime:\s*(\d+)/m);
          
          if (titleMatch) {
            articles.push({
              slug: slug,
              title: titleMatch[1].trim(),
              category: categoryMatch ? categoryMatch[1].trim() : 'general',
              author: authorMatch ? authorMatch[1].trim() : 'Editor',
              readingTime: readingTimeMatch ? parseInt(readingTimeMatch[1]) : 5
            });
            
            console.log(`📝 Cargado: "${titleMatch[1].trim()}" (${slug})`);
          }
        }
      } catch (fileError) {
        console.error(`❌ Error procesando ${file}:`, fileError);
      }
    }

    console.log(`✅ ${articles.length} artículos cargados del CMS`);
    return articles;
  } catch (error) {
    console.error('❌ Error cargando artículos del CMS:', error);
    return [];
  }
}