// netlify/functions/init-articles.js - INICIALIZACIÓN COMPLETA DEL SISTEMA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export async function handler(event, context) {
  console.log('🚀 Función init-articles iniciada - Inicialización completa del sistema');

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
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables de entorno faltantes');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Configuración de Supabase faltante' 
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('🔄 PASO 1: Cargando artículos reales desde el CMS...');

    // 🎯 CARGAR ARTÍCULOS REALES DEL CMS DE ASTRO
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    const matter = await import('gray-matter');
    
    // Ruta a la colección de artículos
    const articlesDir = path.join(process.cwd(), 'src', 'content', 'articulos');
    
    let articlesFromCMS = [];
    
    try {
      // Leer todos los archivos .md de la colección
      const files = await fs.readdir(articlesDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      console.log(`📁 Encontrados ${markdownFiles.length} archivos markdown en CMS`);
      
      // Procesar cada archivo
      for (const file of markdownFiles) {
        try {
          const filePath = path.join(articlesDir, file);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const { data: frontmatter } = matter.default(fileContent);
          
          // Solo artículos publicados
          if (frontmatter.status === 'published') {
            const slug = file.replace('.md', '');
            
            articlesFromCMS.push({
              slug: slug,
              title: frontmatter.title,
              category: frontmatter.category || 'general',
              author: frontmatter.author || 'Editor Balto',
              readingTime: frontmatter.readingTime || 5,
              image: frontmatter.image || '/images/articles/default.jpg',
              description: frontmatter.description || '',
              date: frontmatter.date,
              status: 'published'
            });
            
            console.log(`📰 Procesado: ${slug} - "${frontmatter.title}"`);
          }
        } catch (fileError) {
          console.error(`❌ Error procesando ${file}:`, fileError.message);
        }
      }
      
    } catch (dirError) {
      console.error('❌ Error leyendo directorio de artículos:', dirError.message);
      
      // FALLBACK: Lista mínima conocida
      console.log('🔄 Usando lista de fallback conocida...');
      articlesFromCMS = [
        {
          slug: 'reactividada',
          title: '¿Por qué mi perro ladra a otros perros?',
          category: 'comportamiento',
          author: 'Ana María Prieto',
          readingTime: 6,
          image: '/images/articles/reactividada.jpg',
          description: 'Guía completa sobre reactividad canina',
          status: 'published'
        }
      ];
    }

    console.log(`📰 Total artículos del CMS a sincronizar: ${articlesFromCMS.length}`);

    if (articlesFromCMS.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No hay artículos en el CMS para sincronizar',
          step: 'cms_sync',
          syncedCount: 0,
          totalArticles: 0
        })
      };
    }

    console.log('🔄 PASO 2: Sincronizando artículos del CMS con Supabase...');

    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const syncResults = [];

    // Sincronizar cada artículo del CMS
    for (const article of articlesFromCMS) {
      try {
        console.log(`🔄 Sincronizando: ${article.slug} - "${article.title}"`);

        // Usar la función RPC de sincronización
        const { data, error } = await supabase.rpc('sync_article_from_cms', {
          slug_param: article.slug,
          title_param: article.title,
          category_param: article.category,
          author_param: article.author,
          reading_time_param: article.readingTime,
          image_param: article.image || null,
          description_param: article.description || null
        });

        if (error) {
          console.error(`❌ Error sincronizando ${article.slug}:`, error);
          errorCount++;
          syncResults.push({
            slug: article.slug,
            title: article.title,
            success: false,
            error: error.message
          });
        } else {
          console.log(`✅ Sincronizado: ${article.slug} - "${article.title}"`);
          syncedCount++;
          syncResults.push({
            slug: article.slug,
            title: article.title,
            success: true,
            action: data?.action || 'synced'
          });
          
          if (data?.action === 'updated') {
            updatedCount++;
          }
        }

      } catch (articleError) {
        console.error(`❌ Error procesando ${article.slug}:`, articleError.message);
        errorCount++;
        syncResults.push({
          slug: article.slug,
          title: article.title,
          success: false,
          error: articleError.message
        });
      }
    }

    console.log('🔄 PASO 3: Verificando estado final de la base de datos...');

    // Verificar artículos en base de datos
    const { data: dbArticles, error: listError } = await supabase
      .from('articles')
      .select('slug, title, views, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Error listando artículos:', listError);
    }

    const totalInDB = dbArticles?.length || 0;
    console.log(`📊 Artículos en base de datos: ${totalInDB}`);

    // Log de artículos disponibles para tracking
    if (dbArticles && dbArticles.length > 0) {
      console.log('📋 Artículos disponibles para tracking:');
      dbArticles.forEach(article => {
        console.log(`  • ${article.slug} - "${article.title}" (${article.views || 0} views)`);
      });
    }

    console.log('✅ PASO 4: Sistema inicializado - Tracking habilitado');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Sistema de artículos inicializado correctamente`,
        steps: {
          cms_sync: {
            completed: true,
            syncedCount,
            updatedCount,
            errorCount,
            totalFromCMS: articlesFromCMS.length
          },
          database_status: {
            totalArticlesInDB: totalInDB,
            trackingEnabled: totalInDB > 0
          }
        },
        summary: {
          articlesFromCMS: articlesFromCMS.length,
          syncedSuccessfully: syncedCount,
          articlesInDatabase: totalInDB,
          trackingReady: totalInDB > 0
        },
        availableArticles: dbArticles?.map(a => ({
          slug: a.slug,
          title: a.title,
          views: a.views || 0
        })) || [],
        nextSteps: totalInDB > 0 
          ? ['El sistema está listo', 'Los artículos pueden recibir tracking de views', 'Usa article-view.js para incrementar views']
          : ['Revisar errores de sincronización', 'Verificar función sync_article_from_cms en Supabase', 'Ejecutar de nuevo después de corregir errores']
      })
    };

  } catch (error) {
    console.error('❌ Error general en inicialización:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error en la inicialización del sistema',
        error: error.message,
        step: 'initialization_failed'
      })
    };
  }
}