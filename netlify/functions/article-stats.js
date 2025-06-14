// netlify/functions/sync-articles.js - SINCRONIZACIÓN MANUAL COMPLETA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export async function handler(event, context) {
  console.log('🔄 Función sync-articles iniciada');

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
    console.log('🔄 Iniciando sincronización manual...');

    // ⚠️ IMPORTANTE: Aquí debes agregar TUS artículos reales del CMS
    // Esta es una lista de ejemplo - reemplázala con tus artículos
    const articlesFromCMS = [
      {
        slug: 'reactividada', // ← Este aparece en tu screenshot
        title: '¿Por qué mi perro ladra a otros perros? Soluciones fáciles para perros reactivos',
        category: 'comportamiento',
        author: 'Ana María Prieto',
        readingTime: 6
      },
      {
        slug: 'entrenamiento-cachorros-guia-completa',
        title: 'Guía completa de entrenamiento para cachorros',
        category: 'entrenamiento',
        author: 'Ana María Prieto',
        readingTime: 8
      },
      {
        slug: 'alimentacion-natural-perros',
        title: 'Alimentación natural para perros: Todo lo que debes saber',
        category: 'alimentacion',
        author: 'Manuel Alejandro Bedoya',
        readingTime: 6
      },
      {
        slug: 'como-socializar-cachorro',
        title: 'Cómo socializar a tu cachorro correctamente',
        category: 'comportamiento',
        author: 'Ana María Prieto',
        readingTime: 5
      },
      {
        slug: 'primeros-auxilios-mascotas',
        title: 'Primeros auxilios para mascotas',
        category: 'salud',
        author: 'Equipo Editorial Balto',
        readingTime: 7
      },
      {
        slug: 'cuidados-invierno-mascotas',
        title: 'Cuidados esenciales en invierno',
        category: 'cuidado',
        author: 'Ana María Prieto',
        readingTime: 4
      }
      // TODO: AGREGAR TODOS TUS ARTÍCULOS REALES AQUÍ
      // Puedes obtener la lista completa desde tu CMS o Netlify CMS
    ];

    let syncedCount = 0;
    let errorCount = 0;
    const results = [];

    console.log(`📰 Sincronizando ${articlesFromCMS.length} artículos...`);

    // Sincronizar cada artículo
    for (const article of articlesFromCMS) {
      try {
        console.log(`🔄 Procesando: ${article.slug}`);

        // Verificar si ya existe
        const { data: existing, error: checkError } = await supabase
          .from('articles')
          .select('slug, views')
          .eq('slug', article.slug)
          .maybeSingle();

        if (checkError) {
          console.error(`❌ Error verificando ${article.slug}:`, checkError);
          errorCount++;
          results.push({
            slug: article.slug,
            status: 'error',
            error: `Error verificando: ${checkError.message}`
          });
          continue;
        }

        if (existing) {
          // Actualizar artículo existente (mantener views)
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              title: article.title,
              category: article.category,
              author: article.author,
              reading_time: article.readingTime,
              status: 'published',
              updated_at: new Date().toISOString()
            })
            .eq('slug', article.slug);

          if (updateError) {
            console.error(`❌ Error actualizando ${article.slug}:`, updateError);
            errorCount++;
            results.push({
              slug: article.slug,
              status: 'error',
              error: `Error actualizando: ${updateError.message}`
            });
          } else {
            console.log(`✅ Actualizado: ${article.slug} (views: ${existing.views})`);
            syncedCount++;
            results.push({
              slug: article.slug,
              status: 'updated',
              views: existing.views
            });
          }
        } else {
          // Crear nuevo artículo
          const { error: insertError } = await supabase
            .from('articles')
            .insert({
              slug: article.slug,
              title: article.title,
              category: article.category,
              author: article.author,
              reading_time: article.readingTime,
              views: 0,
              status: 'published',
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error(`❌ Error creando ${article.slug}:`, insertError);
            errorCount++;
            results.push({
              slug: article.slug,
              status: 'error',
              error: `Error creando: ${insertError.message}`
            });
          } else {
            console.log(`✅ Creado: ${article.slug}`);
            syncedCount++;
            results.push({
              slug: article.slug,
              status: 'created',
              views: 0
            });
          }
        }

        // Pausa para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`❌ Error crítico con ${article.slug}:`, error);
        errorCount++;
        results.push({
          slug: article.slug,
          status: 'error',
          error: `Error crítico: ${error.message}`
        });
      }
    }

    console.log(`✅ Sincronización completada: ${syncedCount} exitosos, ${errorCount} errores`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Sincronización completada`,
        stats: {
          total: articlesFromCMS.length,
          synced: syncedCount,
          errors: errorCount
        },
        results: results
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