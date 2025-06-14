// netlify/functions/sync-status.js - NUEVA FUNCIÓN PARA VERIFICAR ESTADO DE SINCRONIZACIÓN
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

export async function handler(event, context) {
  console.log('🔍 sync-status function started');

  // Headers CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

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
    const { action = 'status' } = event.httpMethod === 'POST' 
      ? JSON.parse(event.body || '{}') 
      : {};

    switch (action) {
      case 'status':
        return await getStatus(supabase, headers);
      
      case 'clean':
        return await cleanGenericTitles(supabase, headers);
      
      case 'fix-specific':
        return await fixSpecificArticles(supabase, headers);
      
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: 'Acción no válida',
            availableActions: ['status', 'clean', 'fix-specific']
          })
        };
    }

  } catch (error) {
    console.error('❌ Error en sync-status:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Error interno del servidor',
        error: error.message
      })
    };
  }
}

/**
 * 📊 OBTENER ESTADO ACTUAL DE SINCRONIZACIÓN
 */
async function getStatus(supabase, headers) {
  try {
    // Obtener todos los artículos
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      throw new Error(`Error obteniendo artículos: ${allError.message}`);
    }

    // Analizar los artículos
    const total = allArticles.length;
    const withGenericTitles = allArticles.filter(a => 
      a.title && (a.title.startsWith('Artículo: ') || a.title === a.slug)
    ).length;
    const withRealTitles = total - withGenericTitles;
    const withViews = allArticles.filter(a => a.views && a.views > 0).length;
    const totalViews = allArticles.reduce((sum, a) => sum + (a.views || 0), 0);

    // Muestras de artículos
    const samples = allArticles.slice(0, 5).map(a => ({
      slug: a.slug,
      title: a.title,
      views: a.views || 0,
      category: a.category,
      hasGenericTitle: a.title && (a.title.startsWith('Artículo: ') || a.title === a.slug)
    }));

    // Artículos problemáticos
    const problematic = allArticles.filter(a => 
      a.title && (a.title.startsWith('Artículo: ') || a.title === a.slug)
    ).map(a => ({
      slug: a.slug,
      title: a.title,
      views: a.views || 0
    }));

    const status = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        total,
        withRealTitles,
        withGenericTitles,
        withViews,
        totalViews,
        averageViews: total > 0 ? Math.round(totalViews / total) : 0
      },
      health: {
        syncStatus: withGenericTitles === 0 ? 'good' : 'needs_attention',
        message: withGenericTitles === 0 
          ? 'Todos los artículos tienen títulos reales' 
          : `${withGenericTitles} artículos tienen títulos genéricos`,
        recommendations: withGenericTitles > 0 ? [
          'Ejecutar /.netlify/functions/sync-articles para sincronizar artículos del CMS',
          'Usar POST /.netlify/functions/sync-status con {"action": "clean"} para limpiar títulos genéricos'
        ] : [
          'Sistema funcionando correctamente'
        ]
      },
      samples,
      problematic: problematic.slice(0, 10) // Solo mostrar primeros 10
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(status)
    };

  } catch (error) {
    console.error('❌ Error en getStatus:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Error obteniendo estado',
        error: error.message
      })
    };
  }
}

/**
 * 🧹 LIMPIAR TÍTULOS GENÉRICOS
 */
async function cleanGenericTitles(supabase, headers) {
  try {
    console.log('🧹 Iniciando limpieza de títulos genéricos...');

    // Obtener artículos con títulos genéricos
    const { data: problematicArticles, error: getError } = await supabase
      .from('articles')
      .select('*')
      .or('title.like.Artículo: %,title.eq.slug');

    if (getError) {
      throw new Error(`Error obteniendo artículos problemáticos: ${getError.message}`);
    }

    if (problematicArticles.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No hay artículos con títulos genéricos para limpiar',
          cleaned: 0,
          details: []
        })
      };
    }

    const fixes = [];
    let cleanedCount = 0;

    // Arreglos específicos conocidos
    const knownFixes = {
      'reactividada': {
        title: '¿Por qué mi perro ladra a otros perros?',
        category: 'comportamiento',
        author: 'Ana María Prieto'
      },
      'connection-test': {
        title: 'Prueba de Conexión al Sistema',
        category: 'general',
        author: 'Editor Balto'
      }
      // Agregar más según sea necesario
    };

    for (const article of problematicArticles) {
      try {
        let newTitle = article.title;
        let newCategory = article.category;
        let newAuthor = article.author;

        // Verificar si tenemos un fix específico
        if (knownFixes[article.slug]) {
          const fix = knownFixes[article.slug];
          newTitle = fix.title;
          newCategory = fix.category;
          newAuthor = fix.author;
        } else {
          // Generar título basado en slug
          newTitle = article.slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }

        // Actualizar artículo
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: newTitle,
            category: newCategory,
            author: newAuthor,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id);

        if (updateError) {
          fixes.push({
            slug: article.slug,
            status: 'error',
            error: updateError.message,
            oldTitle: article.title
          });
        } else {
          fixes.push({
            slug: article.slug,
            status: 'success',
            oldTitle: article.title,
            newTitle: newTitle
          });
          cleanedCount++;
        }

      } catch (error) {
        fixes.push({
          slug: article.slug,
          status: 'error',
          error: error.message,
          oldTitle: article.title
        });
      }
    }

    console.log(`✅ Limpieza completada: ${cleanedCount}/${problematicArticles.length} artículos`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Limpieza completada: ${cleanedCount} artículos arreglados`,
        cleaned: cleanedCount,
        total: problematicArticles.length,
        details: fixes
      })
    };

  } catch (error) {
    console.error('❌ Error en cleanGenericTitles:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Error en limpieza',
        error: error.message
      })
    };
  }
}

/**
 * 🔧 ARREGLAR ARTÍCULOS ESPECÍFICOS CONOCIDOS
 */
async function fixSpecificArticles(supabase, headers) {
  try {
    const specificFixes = [
      {
        slug: 'reactividada',
        title: '¿Por qué mi perro ladra a otros perros?',
        category: 'comportamiento',
        author: 'Ana María Prieto'
      }
      // Agregar más artículos específicos aquí
    ];

    const results = [];

    for (const fix of specificFixes) {
      try {
        const { error } = await supabase
          .from('articles')
          .update({
            title: fix.title,
            category: fix.category,
            author: fix.author,
            updated_at: new Date().toISOString()
          })
          .eq('slug', fix.slug);

        if (error) {
          results.push({
            slug: fix.slug,
            status: 'error',
            error: error.message
          });
        } else {
          results.push({
            slug: fix.slug,
            status: 'success',
            title: fix.title
          });
        }
      } catch (error) {
        results.push({
          slug: fix.slug,
          status: 'error',
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Artículos específicos arreglados: ${successCount}/${specificFixes.length}`,
        fixed: successCount,
        total: specificFixes.length,
        results
      })
    };

  } catch (error) {
    console.error('❌ Error en fixSpecificArticles:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Error arreglando artículos específicos',
        error: error.message
      })
    };
  }
}