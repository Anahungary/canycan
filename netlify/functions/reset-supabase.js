// netlify/functions/reset-supabase.js - LIMPIAR SUPABASE Y CARGAR ARTÍCULOS NUEVOS
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export async function handler(event, context) {
  console.log('🧹 RESET SUPABASE - Limpieza completa y carga de artículos nuevos');

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Solo método POST permitido' })
    };
  }

  // Verificar variables de entorno
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Variables de entorno de Supabase no configuradas' 
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('🧹 PASO 1: Eliminando TODOS los artículos existentes...');
    
    // ELIMINAR TODOS LOS ARTÍCULOS EXISTENTES
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todo menos un ID que no existe

    if (deleteError) {
      console.error('❌ Error eliminando artículos:', deleteError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Error eliminando artículos existentes',
          error: deleteError.message
        })
      };
    }

    console.log('✅ Todos los artículos anteriores eliminados');

    console.log('📂 PASO 2: Cargando artículos REALES del CMS...');
    
    // CARGAR ARTÍCULOS REALES DEL CMS
    const realArticles = await loadRealArticlesFromCMS();
    
    if (realArticles.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Supabase limpiado, pero no se encontraron artículos en el CMS',
          stats: { deleted: 'all', loaded: 0, errors: 0 },
          articles: []
        })
      };
    }

    console.log(`📰 Encontrados ${realArticles.length} artículos reales en el CMS`);

    console.log('🔄 PASO 3: Insertando artículos REALES en Supabase...');
    
    let loadedCount = 0;
    let errorCount = 0;
    const results = [];

    // INSERTAR CADA ARTÍCULO REAL
    for (const article of realArticles) {
      try {
        console.log(`📝 Insertando: "${article.title}"`);

        const { error: insertError } = await supabase
          .from('articles')
          .insert({
            slug: article.slug,
            title: article.title,
            category: article.category,
            author: article.author,
            reading_time: article.readingTime,
            views: 0, // Empezar con 0 views
            likes: 0,
            shares: 0,
            trending: false,
            featured: false,
            status: 'published',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`❌ Error insertando ${article.slug}:`, insertError);
          errorCount++;
          results.push({
            slug: article.slug,
            title: article.title,
            status: 'error',
            error: insertError.message
          });
        } else {
          console.log(`✅ Insertado: "${article.title}"`);
          loadedCount++;
          results.push({
            slug: article.slug,
            title: article.title,
            status: 'success'
          });
        }

        // Pausa para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error crítico con ${article.slug}:`, error);
        errorCount++;
        results.push({
          slug: article.slug,
          title: article.title || 'Sin título',
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`🎉 RESET COMPLETO: ${loadedCount} cargados, ${errorCount} errores`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Reset completo: Supabase limpiado y ${loadedCount} artículos reales cargados`,
        stats: {
          deleted: 'all_previous',
          loaded: loadedCount,
          errors: errorCount,
          total: realArticles.length
        },
        articles: results.slice(0, 5), // Mostrar primeros 5 como muestra
        summary: {
          successfulArticles: results.filter(r => r.status === 'success').map(r => r.title),
          failedArticles: results.filter(r => r.status === 'error').map(r => ({ title: r.title, error: r.error }))
        }
      })
    };

  } catch (error) {
    console.error('❌ Error general en reset:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error durante el reset de Supabase',
        error: error.message
      })
    };
  }
}

/**
 * 📰 CARGAR ARTÍCULOS REALES DEL CMS
 */
async function loadRealArticlesFromCMS() {
  try {
    console.log('📂 Buscando archivos del CMS...');
    
    const articlesPath = path.join(process.cwd(), 'src', 'content', 'articulos');
    
    if (!fs.existsSync(articlesPath)) {
      console.log('❌ Directorio de artículos no encontrado:', articlesPath);
      return [];
    }

    const files = fs.readdirSync(articlesPath).filter(file => file.endsWith('.md'));
    console.log(`📂 Encontrados ${files.length} archivos .md`);

    const realArticles = [];

    for (const file of files) {
      try {
        const filePath = path.join(articlesPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extraer frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        
        if (!frontmatterMatch) {
          console.log(`⚠️ No frontmatter en ${file}`);
          continue;
        }

        const frontmatter = parseFrontmatter(frontmatterMatch[1]);
        const slug = path.basename(file, '.md');

        // SOLO ARTÍCULOS PUBLICADOS Y CON TÍTULO REAL
        if (frontmatter.status !== 'published') {
          console.log(`⏭️ Saltando ${slug} (no publicado)`);
          continue;
        }

        if (!frontmatter.title || frontmatter.title.startsWith('Artículo:')) {
          console.log(`⏭️ Saltando ${slug} (sin título real)`);
          continue;
        }

        const article = {
          slug: slug,
          title: frontmatter.title,
          category: frontmatter.category || 'general',
          author: frontmatter.author || 'Editor Balto',
          readingTime: frontmatter.readingTime || 5,
          description: frontmatter.description || '',
          date: frontmatter.date || new Date().toISOString(),
          tags: frontmatter.tags || []
        };

        realArticles.push(article);
        console.log(`✅ Artículo real encontrado: "${article.title}" (${slug})`);

      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error.message);
      }
    }

    console.log(`📰 Total artículos REALES: ${realArticles.length}`);
    return realArticles;

  } catch (error) {
    console.error('❌ Error cargando artículos del CMS:', error);
    return [];
  }
}

/**
 * 🔧 PARSER DE FRONTMATTER
 */
function parseFrontmatter(frontmatterText) {
  const result = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Limpiar comillas
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parsear arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        // Si falla, dejar como string
      }
    }

    // Convertir números
    if (!isNaN(value) && value !== '') {
      const num = Number(value);
      if (Number.isInteger(num)) {
        value = num;
      }
    }

    result[key] = value;
  }

  return result;
}