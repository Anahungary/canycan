/* empty css                                      */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, f as addAttribute } from '../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_DjUMO5lw.mjs';
import { $ as $$Button } from '../chunks/Button_CImbW17Y.mjs';
import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { $ as $$Image } from '../chunks/_astro_assets_Dwwpu0V7.mjs';
import { getCollection } from '../chunks/_astro_content_Yp6Qe3RC.mjs';
import { $ as $$Newsletter } from '../chunks/Newsletter_BbkxrVfi.mjs';
import { A as ArticlesDB } from '../chunks/supabase_C0cFZhtF.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const ARTICLES_PER_PAGE = 9;
  console.log("\u{1F680} HOMEPAGE - Cargando art\xEDculos ordenados por VIEWS desde Supabase...");
  let cmsArticles = [];
  try {
    cmsArticles = await getCollection("articulos");
    cmsArticles = cmsArticles.filter((article) => article.data.status === "published");
    console.log(`\u{1F4F0} CMS: ${cmsArticles.length} art\xEDculos cargados`);
  } catch (error) {
    console.log("\u26A0\uFE0F No se pudieron cargar art\xEDculos del CMS:", error);
    cmsArticles = [];
  }
  let articlesWithViews = [];
  let sidebarData = { trending: [], popular: [] };
  try {
    console.log("\u{1F4CA} Obteniendo art\xEDculos desde Supabase ordenados por views...");
    const supabaseArticles = await ArticlesDB.getAllArticlesWithStats();
    console.log(`\u{1F4CA} Supabase: ${supabaseArticles.length} art\xEDculos obtenidos`);
    articlesWithViews = supabaseArticles.map((supabaseArticle) => {
      const cmsArticle = cmsArticles.find((cms) => cms.slug === supabaseArticle.slug);
      if (cmsArticle) {
        return {
          ...cmsArticle,
          supabaseData: {
            views: supabaseArticle.views || 0,
            likes: supabaseArticle.likes || 0,
            shares: supabaseArticle.shares || 0,
            trending: supabaseArticle.trending || false,
            featured: supabaseArticle.featured || false,
            category: supabaseArticle.category,
            author: supabaseArticle.author,
            title: supabaseArticle.title
          },
          // Usar views de Supabase como principal
          dynamicViews: supabaseArticle.views || 0,
          displayTitle: cmsArticle.data?.title || supabaseArticle.title,
          displayCategory: cmsArticle.data?.category || supabaseArticle.category,
          displayAuthor: cmsArticle.data?.author || supabaseArticle.author,
          displayImage: cmsArticle.data?.image || "/images/articles/default.jpg",
          displayDescription: cmsArticle.data?.description || `Art\xEDculo sobre ${supabaseArticle.category || "mascotas"}`,
          displayDate: cmsArticle.data?.date || new Date(supabaseArticle.created_at || Date.now()),
          displayReadingTime: cmsArticle.data?.readingTime || supabaseArticle.reading_time || 5
        };
      } else {
        return {
          slug: supabaseArticle.slug,
          data: {
            title: supabaseArticle.title,
            category: supabaseArticle.category,
            author: supabaseArticle.author,
            date: new Date(supabaseArticle.created_at || Date.now()),
            readingTime: supabaseArticle.reading_time || 5,
            image: "/images/articles/default.jpg",
            description: `Art\xEDculo sobre ${supabaseArticle.category || "mascotas"}`,
            status: "published"
          },
          supabaseData: {
            views: supabaseArticle.views || 0,
            likes: supabaseArticle.likes || 0,
            shares: supabaseArticle.shares || 0,
            trending: supabaseArticle.trending || false,
            featured: supabaseArticle.featured || false
          },
          dynamicViews: supabaseArticle.views || 0,
          displayTitle: supabaseArticle.title,
          displayCategory: supabaseArticle.category,
          displayAuthor: supabaseArticle.author,
          displayImage: "/images/articles/default.jpg",
          displayDescription: `Art\xEDculo sobre ${supabaseArticle.category || "mascotas"}`,
          displayDate: new Date(supabaseArticle.created_at || Date.now()),
          displayReadingTime: supabaseArticle.reading_time || 5
        };
      }
    });
    console.log(`\u2705 ${articlesWithViews.length} art\xEDculos combinados y ordenados por views`);
    articlesWithViews.slice(0, 3).forEach((article, index) => {
      console.log(`\u{1F4CA} #${index + 1}: "${article.displayTitle}" - ${article.dynamicViews} views`);
    });
    try {
      const [trending, popular] = await Promise.all([
        ArticlesDB.getTrendingArticles(5),
        ArticlesDB.getPopularArticles(5)
      ]);
      sidebarData = { trending, popular };
      console.log(`\u{1F525} Sidebar: ${trending.length} trending, ${popular.length} popular`);
    } catch (sidebarError) {
      console.log("\u26A0\uFE0F Error cargando sidebar:", sidebarError);
    }
  } catch (error) {
    console.error("\u274C Error cargando desde Supabase:", error);
    articlesWithViews = cmsArticles.slice(0, ARTICLES_PER_PAGE).map((article, index) => ({
      ...article,
      supabaseData: { views: 0, likes: 0, shares: 0 },
      dynamicViews: Math.max(0, 100 - index * 10),
      // Fallback views decrecientes
      displayTitle: article.data?.title || "Art\xEDculo sin t\xEDtulo",
      displayCategory: article.data?.category || "general",
      displayAuthor: article.data?.author || "Editor Balto",
      displayImage: article.data?.image || "/images/articles/default.jpg",
      displayDescription: article.data?.description || "",
      displayDate: article.data?.date || /* @__PURE__ */ new Date(),
      displayReadingTime: article.data?.readingTime || 5
    }));
    console.log(`\u26A0\uFE0F Usando fallback: ${articlesWithViews.length} art\xEDculos del CMS`);
  }
  const heroArticle = articlesWithViews.length > 0 ? articlesWithViews[0] : null;
  const remainingArticles = articlesWithViews.slice(1, ARTICLES_PER_PAGE);
  console.log(`\u{1F31F} Art\xEDculo destacado: "${heroArticle?.displayTitle}" (${heroArticle?.dynamicViews || 0} views)`);
  console.log(`\u{1F4F1} Art\xEDculos restantes: ${remainingArticles.length}`);
  function getCategoryColor(category) {
    const colors = {
      "razas": "bg-green-100 text-green-800 border-green-200",
      "comportamiento": "bg-blue-100 text-blue-800 border-blue-200",
      "alimentaci\xF3n": "bg-orange-100 text-orange-800 border-orange-200",
      "alimentacion": "bg-orange-100 text-orange-800 border-orange-200",
      "entrenamiento": "bg-purple-100 text-purple-800 border-purple-200",
      "salud": "bg-red-100 text-red-800 border-red-200",
      "cuidado": "bg-pink-100 text-pink-800 border-pink-200",
      "adopcion": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "nuevos-duenos": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "general": "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[category?.toLowerCase()] || colors["general"];
  }
  function formatViews(count) {
    if (!count || count < 1) return "0";
    if (count < 1e3) return count.toString();
    if (count < 1e6) return (count / 1e3).toFixed(1) + "K";
    return (count / 1e6).toFixed(1) + "M";
  }
  function formatDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  function getTimeAgo(date) {
    const now = /* @__PURE__ */ new Date();
    const articleDate = typeof date === "string" ? new Date(date) : date;
    const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1e3 * 60 * 60));
    if (diffInHours < 1) return "Hace unos minutos";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return "Ayer";
    return formatDate(date);
  }
  const stats = {
    total: articlesWithViews.length,
    totalViews: articlesWithViews.reduce((sum, a) => sum + (a.dynamicViews || 0), 0),
    avgViews: articlesWithViews.length > 0 ? Math.round(articlesWithViews.reduce((sum, a) => sum + (a.dynamicViews || 0), 0) / articlesWithViews.length) : 0,
    categories: [...new Set(articlesWithViews.map((a) => a.displayCategory).filter(Boolean))].length
  };
  console.log(`\u{1F4CA} ESTAD\xCDSTICAS FINALES:`, stats);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Balto - Art\xEDculos m\xE1s populares sobre mascotas", "description": "Descubre los art\xEDculos m\xE1s le\xEDdos sobre cuidado de mascotas. Contenido ordenado por popularidad real de nuestros lectores.", "bodyClass": "homepage-modern" }, { "default": async ($$result2) => renderTemplate`${heroArticle && renderTemplate`${maybeRenderHead()}<section class="bg-gradient-to-br from-green-700 to-green-500 py-12 md:px-24 px-0"> ${renderComponent($$result2, "Container", $$Container, { "size": "xl" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">  <div class="lg:col-span-8"> <div class="mb-6">  <div class="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4"> <span>🔥</span> <span>ARTÍCULO MÁS LEÍDO</span> <span class="bg-white text-red-500 px-2 py-0.5 rounded-full text-xs font-bold">
👀 ${formatViews(heroArticle.dynamicViews)} </span> </div> <a${addAttribute(`/articulos/${heroArticle.slug}`, "href")} class="block"> <article class="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-green-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300">  <div class="relative h-64 sm:h-80 md:h-96 overflow-hidden"> ${renderComponent($$result3, "Image", $$Image, { "src": heroArticle.displayImage, "alt": heroArticle.displayTitle, "width": 800, "height": 400, "class": "w-full h-full object-cover hover:scale-105 transition-transform duration-300" })}  <div class="absolute top-4 left-4"> <span${addAttribute(`px-3 py-1 rounded-full text-sm font-bold border-2 ${getCategoryColor(heroArticle.displayCategory)}`, "class")}> ${heroArticle.displayCategory || "General"} </span> </div>  ${heroArticle.supabaseData?.trending && renderTemplate`<div class="absolute top-4 right-4"> <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
🔥 Trending
</span> </div>`} </div>  <div class="p-8"> <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-3"> ${heroArticle.displayTitle} </h1> ${heroArticle.displayDescription && renderTemplate`<p class="text-gray-600 text-lg mb-6 line-clamp-3"> ${heroArticle.displayDescription} </p>`}  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6"> <span class="flex items-center gap-2"> <span>👤</span> <span class="font-medium">${heroArticle.displayAuthor}</span> </span> <span class="flex items-center gap-2"> <span>📅</span> <span>${getTimeAgo(heroArticle.displayDate)}</span> </span> <span class="flex items-center gap-2"> <span>⏱️</span> <span>${heroArticle.displayReadingTime} min lectura</span> </span> <span class="flex items-center gap-2 text-green-600 font-semibold"> <span>👀</span> <span>${formatViews(heroArticle.dynamicViews)} lecturas</span> </span> </div>  <div class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 shadow-lg hover:from-green-600 hover:to-green-700"> <span>Leer artículo completo</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </div> </div> </article> </a> </div> </div>  <div class="lg:col-span-4"> ${sidebarData.trending.length > 0 && renderTemplate`<div class="bg-white rounded-xl border border-greem-500 p-6 shadow-sm"> <div class="flex items-center justify-between mb-6"> <div class="flex items-center gap-3"> <span class="text-2xl">🔥</span> <h2 class="text-lg font-bold text-gray-900">Trending</h2> <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium"> ${sidebarData.trending.length} </span> </div> <a href="/articulos" class="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
Ver todo
</a> </div> <div class="space-y-4"> ${sidebarData.trending.slice(0, 5).map((article, index) => renderTemplate`<div class="group"> <a${addAttribute(`/articulos/${article.slug}`, "href")} class="block"> <article class="flex items-start space-x-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"> <div${addAttribute(`
                            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm
                            ${index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" : index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-gradient-to-br from-green-400 to-green-600"}
                          `, "class")}> ${index + 1} </div> <div class="flex-1 min-w-0"> <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors duration-200 mb-2"> ${article.title} </h3> <div class="flex items-center flex-wrap gap-2 text-xs text-gray-500"> <span${addAttribute(`px-2 py-0.5 rounded-full font-medium ${getCategoryColor(article.category || "")}`, "class")}> ${article.category || "General"} </span> <span class="text-green-500">•</span> <span class="flex items-center gap-1"> <span>⏱️</span> <span>${article.reading_time || 5}m</span> </span> <span class="text-gray-300">•</span> <span class="flex items-center gap-1 text-green-600 font-semibold"> <span>👀</span> <span>${formatViews(article.views || 0)}</span> </span> </div> </div> </article> </a> ${index < sidebarData.trending.length - 1 && renderTemplate`<div class="border-t-2 border-gray-100 mt-3"></div>`} </div>`)} </div> </div>`} </div> </div> ` })} </section>`}${remainingArticles.length > 0 && renderTemplate`<section class="py-16 px-0 md:px-24 bg-white"> ${renderComponent($$result2, "Container", $$Container, { "size": "xl" }, { "default": async ($$result3) => renderTemplate`<div class="flex items-center justify-between mb-8"> <div class="flex items-center gap-4"> <h2 class="text-3xl font-bold text-gray-900">Más populares</h2> <div class="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"> <span>👀</span> <span>Ordenado por lecturas</span> </div> <div class="text-sm text-gray-500"> ${stats.totalViews.toLocaleString()} views totales
</div> </div> ${renderComponent($$result3, "Button", $$Button, { "href": "/articulos", "variant": "outline", "size": "sm", "class": "border-green-500 text-green-600 hover:bg-green-50" }, { "default": async ($$result4) => renderTemplate`
Ver todos
` })} </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${remainingArticles.map((article, index) => renderTemplate`<a${addAttribute(`/articulos/${article.slug}`, "href")} class="group"${addAttribute(index, "data-article-index")}> <article class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 overflow-hidden">  <div class="relative h-48 overflow-hidden"> ${renderComponent($$result3, "Image", $$Image, { "src": article.displayImage, "alt": article.displayTitle, "width": 400, "height": 240, "class": "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" })}  <div class="absolute top-3 left-3 right-3 flex justify-between items-start">  <span${addAttribute(`
                      w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${index + 1 === 1 ? "bg-yellow-500" : index + 1 === 2 ? "bg-gray-400" : index + 1 === 3 ? "bg-orange-400" : "bg-green-500"}
                    `, "class")}>
#${index + 2} </span>  <span class="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
👀 ${formatViews(article.dynamicViews)} </span> </div>  <div class="absolute bottom-3 left-3"> <span${addAttribute(`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.displayCategory)}`, "class")}> ${article.displayCategory || "General"} </span> </div> </div>  <div class="p-5"> <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors"> ${article.displayTitle} </h3> ${article.displayDescription && renderTemplate`<p class="text-gray-600 text-sm mb-4 line-clamp-3"> ${article.displayDescription} </p>`}  <div class="flex items-center justify-between text-xs text-gray-500"> <div class="flex items-center gap-3"> <span class="flex items-center gap-1"> <span>👤</span> <span class="truncate max-w-20">${article.displayAuthor}</span> </span> <span class="flex items-center gap-1"> <span>⏱️</span> <span>${article.displayReadingTime}m</span> </span> </div> <span class="flex items-center gap-1 text-green-600 font-semibold"> <span>👀</span> <span>${formatViews(article.dynamicViews)}</span> </span> </div> </div> </article> </a>`)} </div> <div class="text-center mt-12"> ${renderComponent($$result3, "Button", $$Button, { "href": "/articulos", "variant": "primary", "size": "lg", "class": "bg-gradient-to-r text-white from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" }, { "default": async ($$result4) => renderTemplate` <span>Ver todos los artículos</span> ` })} </div> ` })} </section>`}<section class="py-16 px-0 md:px-24 bg-gradient-to-br from-green-50 to-emerald-50"> ${renderComponent($$result2, "Container", $$Container, { "size": "xl" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Newsletter", $$Newsletter, { "variant": "homepage", "title": "No te pierdas los art\xEDculos m\xE1s populares", "description": "Recibe cada semana un resumen de los art\xEDculos m\xE1s le\xEDdos y las \xFAltimas novedades sobre cuidado de mascotas." })} ` })} </section> ` })} ${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
