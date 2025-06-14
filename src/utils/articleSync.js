import { ArticlesDB } from '../lib/supabase.js';

export class ArticleSync {
  static async syncAllArticles() {
    try {
      const { getCollection } = await import('astro:content');
      const cmsArticles = await getCollection('articulos');
      const publishedArticles = cmsArticles.filter(article => article.data.status === 'published');

      console.log(`🔄 Sincronizando ${publishedArticles.length} artículos...`);

      let successCount = 0;
      let errorCount = 0;

      for (const article of publishedArticles) {
        try {
          const success = await ArticlesDB.syncArticleFromCMS({
            slug: article.slug,
            title: article.data?.title || article.title,
            category: article.data?.category || article.category,
            author: article.data?.author || article.author,
            readingTime: article.data?.readingTime || article.readingTime || 5
          });

          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error sincronizando ${article.slug}:`, error);
          errorCount++;
        }
      }

      console.log(`✅ Sincronización completa: ${successCount} exitosos, ${errorCount} errores`);
      return { successCount, errorCount, total: publishedArticles.length };
    } catch (error) {
      console.error('❌ Error en sincronización automática:', error);
      return { successCount: 0, errorCount: 0, total: 0 };
    }
  }

  static async getSidebarArticles(options = {}) {
    return await ArticlesDB.getSidebarArticles(options);
  }
}