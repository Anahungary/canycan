// netlify/functions/article-view.js - VERSIÓN CORREGIDA CON SERVICE_ROLE_KEY
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Para bypasear RLS

export async function handler(event, context) {
  console.log('📊 article-view function started');

  // Headers CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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
        message: 'Variables de entorno de Supabase no configuradas' 
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Parsear body
    const { slug } = JSON.parse(event.body || '{}');
    
    if (!slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Slug es requerido' })
      };
    }

    console.log(`📊 Procesando vista para: ${slug}`);

    // 🔍 BUSCAR ARTÍCULO EXISTENTE
    const { data: articles, error: selectError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug);

    if (selectError) {
      console.error('❌ Error buscando artículo:', selectError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Error buscando artículo',
          error: selectError.message
        })
      };
    }

    if (!articles || articles.length === 0) {
      // ❌ ARTÍCULO NO EXISTE
      console.log(`⚠️ Artículo "${slug}" no encontrado`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Artículo no encontrado',
          slug: slug,
          recommendation: 'Ejecutar sincronización de artículos primero'
        })
      };
    }

    // ✅ ARTÍCULO ENCONTRADO - INCREMENTAR VIEWS
    const article = articles[0];
    const newViews = (article.views || 0) + 1;

    console.log(`📈 Incrementando views: ${article.views || 0} → ${newViews}`);

    const { data: updateData, error: updateError } = await supabase
      .from('articles')
      .update({ 
        views: newViews,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('views, title')
      .single();

    if (updateError) {
      console.error('❌ Error incrementando views:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Error incrementando vistas',
          error: updateError.message
        })
      };
    }

    console.log(`✅ Vista incrementada: "${article.title}" ahora tiene ${newViews} views`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Vista registrada correctamente',
        slug: slug,
        title: article.title,
        views: newViews,
        previousViews: article.views || 0
      })
    };

  } catch (error) {
    console.error('❌ Error general:', error);
    
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