import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 📊 UTILIDADES PARA ARTÍCULOS
export class ArticlesDB {
  
  // 📈 Incrementar vistas de un artículo
  static async incrementViews(slug) {
    try {
      const { error } = await supabase.rpc('increment_article_views', {
        article_slug_param: slug
      })
      
      if (error) {
        console.error('❌ Error incrementando vistas:', error)
        return false
      }
      
      console.log(`✅ Vista incrementada para: ${slug}`)
      return true
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return false
    }
  }

  // 🔥 Obtener artículos populares
  static async getPopularArticles(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error obteniendo populares:', error);
      return [];
    }
    
    console.log(`🔥 Popular articles: ${(data || []).length} encontrados`);
    return data || [];
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return [];
  }
}


  // 📈 Obtener artículos trending
  static async getTrendingArticles(limit = 5) {
  try {
    // Artículos con más views en los últimos días (simulado con views altas)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .gte('views', 1) // Solo artículos con al menos 1 view
      .order('views', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Error obteniendo trending:', error);
      return [];
    }
    
    console.log(`📈 Trending articles: ${(data || []).length} encontrados`);
    return data || [];
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return [];
  }
}


  // 📊 Obtener estadísticas de un artículo
  static async getArticleStats(slug) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('views, likes, shares, trending, featured')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('❌ Error obteniendo stats:', error)
        return { views: 0, likes: 0, shares: 0 }
      }
      
      return data
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return { views: 0, likes: 0, shares: 0 }
    }
  }

  // 🔄 Sincronizar artículo desde CMS
  static async syncArticleFromCMS(articleData) {
    try {
      const { error } = await supabase.rpc('sync_article_from_cms', {
        slug_param: articleData.slug,
        title_param: articleData.title,
        category_param: articleData.category || null,
        author_param: articleData.author || null,
        reading_time_param: articleData.readingTime || 5
      })
      
      if (error) {
        console.error('❌ Error sincronizando artículo:', error)
        return false
      }
      
      console.log(`✅ Artículo sincronizado: ${articleData.slug}`)
      return true
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return false
    }
  }

  // 📋 Obtener todos los artículos con stats
  static async getAllArticlesWithStats(limit = null) {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
      
      if (limit) {
        query = query.limit(limit)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('❌ Error obteniendo todos los artículos:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return []
    }
  }

  // 🎯 Obtener artículos por categoría
  static async getArticlesByCategory(category, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('❌ Error obteniendo por categoría:', error)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return []
    }
  }

  // 🌟 Obtener artículos para sidebar
  static async getSidebarArticles(options = {}) {
    const {
      trendingLimit = 5,
      popularLimit = 5,
      excludeSlug = null
    } = options

    try {
      console.log('🔄 Cargando artículos para sidebar...')
      
      // Cargar trending y popular en paralelo
      const [trendingData, popularData] = await Promise.all([
        this.getTrendingArticles(trendingLimit + (excludeSlug ? 1 : 0)),
        this.getPopularArticles(popularLimit + (excludeSlug ? 1 : 0))
      ])

      // Filtrar artículo actual si se especifica
      const trending = excludeSlug 
        ? trendingData.filter(article => article.slug !== excludeSlug).slice(0, trendingLimit)
        : trendingData.slice(0, trendingLimit)

      const popular = excludeSlug 
        ? popularData.filter(article => article.slug !== excludeSlug).slice(0, popularLimit)
        : popularData.slice(0, popularLimit)

      console.log(`✅ Sidebar: ${trending.length} trending, ${popular.length} popular`)

      return {
        trending,
        popular
      }
    } catch (error) {
      console.error('❌ Error cargando sidebar:', error)
      return {
        trending: [],
        popular: []
      }
    }
  }

  // 📰 Obtener artículos para últimas noticias
  static async getLatestNewsArticles(limit = 9, excludeSlug = null) {
    try {
      console.log('📰 Cargando últimas noticias ordenadas por popularidad...')
      
      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit + (excludeSlug ? 1 : 0))

      const { data, error } = await query

      if (error) {
        console.error('❌ Error obteniendo últimas noticias:', error)
        return []
      }

      // Filtrar artículo actual si se especifica
      const articles = excludeSlug 
        ? data.filter(article => article.slug !== excludeSlug).slice(0, limit)
        : data.slice(0, limit)

      console.log(`📰 Últimas noticias: ${articles.length} artículos cargados`)
      
      return articles
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return []
    }
  }
}