/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { getCollection } from '../chunks/_astro_content_p4FGYWmy.mjs';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_BIbJk0Bg.mjs';
import { $ as $$Button } from '../chunks/Button_DiQu0Jvt.mjs';
import { b as $$Card, $ as $$Badge, a as $$ArticleList } from '../chunks/Card_DX0aPP0J.mjs';
import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { $ as $$Image } from '../chunks/_astro_assets_Cc6zF1xQ.mjs';
import { $ as $$Newsletter } from '../chunks/Newsletter_DZtf81gC.mjs';
export { renderers } from '../renderers.mjs';

function generateMarketingViews(articleSlug, isPopular = false) {
  const hash = articleSlug.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const seed = Math.abs(hash);
  if (isPopular) {
    return 200 + seed % 1300;
  } else {
    return 50 + seed % 250;
  }
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  function getAuthorAvatar(authorName) {
    const authorAvatars = {
      "Ana Mar\xEDa Prieto": "/images/ana-p2.webp",
      "Manuel Alejandro Bedoya": "/images/manuel-p1.webp",
      "Equipo Editorial Balto": "/images/baltologo.svg",
      "Editor Balto": "/images/baltologo.svg"
    };
    return authorAvatars[authorName] || "/images/baltologo.svg";
  }
  function getPopularTagsFromArticles(articles, limit = 8) {
    const allTags = [];
    articles.forEach((article) => {
      if (article.data?.category) {
        allTags.push(article.data.category);
      }
      if (article.data?.tags && Array.isArray(article.data.tags)) {
        allTags.push(...article.data.tags);
      }
    });
    const tagCounts = allTags.reduce((acc, tag) => {
      const normalizedTag = tag.toLowerCase().trim();
      acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, limit).map(([tag, count]) => ({
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      // Capitalizar
      slug: tag.toLowerCase().replace(/\s+/g, "-"),
      count
    }));
  }
  let allArticles = [];
  try {
    allArticles = await getCollection("articulos");
    allArticles = allArticles.filter((article) => article.data.status === "published").sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    console.log(`\u{1F4F0} Cargados ${allArticles.length} art\xEDculos publicados`);
  } catch (error) {
    console.log("\u26A0\uFE0F No se pudieron cargar los art\xEDculos:", error);
    allArticles = [];
  }
  const ARTICLES_PER_PAGE = 9;
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const firstPageArticles = allArticles.slice(0, ARTICLES_PER_PAGE);
  const featuredArticle = firstPageArticles.map((article) => ({
    ...article,
    marketingViews: generateMarketingViews(article.slug, ["entrenamiento", "alimentacion", "salud", "cachorros"].includes(article.data?.category?.toLowerCase()))
  })).sort((a, b) => b.marketingViews - a.marketingViews)[0] || null;
  const otherArticles = firstPageArticles.slice(1);
  console.log(`\u{1F4CA} Index - Total art\xEDculos: ${allArticles.length}, Por p\xE1gina: ${ARTICLES_PER_PAGE}, Total p\xE1ginas: ${totalPages}`);
  console.log(`\u{1F4CA} Index - Mostrando art\xEDculos 1-${firstPageArticles.length} (Destacado: 1, Grilla: ${otherArticles.length})`);
  const stats = {
    total: allArticles.length,
    categories: [...new Set(allArticles.map((a) => a.data?.category).filter(Boolean))].length,
    authors: [...new Set(allArticles.map((a) => a.data?.author).filter(Boolean))].length,
    readingTime: 6
  };
  const categories = [
    { name: "Entrenamiento", slug: "entrenamiento", count: 24, color: "primary", icon: "\u{1F3AF}" },
    { name: "Alimentaci\xF3n", slug: "alimentacion", count: 18, color: "secondary", icon: "\u{1F37D}\uFE0F" },
    { name: "Salud", slug: "salud", count: 31, color: "success", icon: "\u{1F3E5}" },
    { name: "Comportamiento", slug: "comportamiento", count: 27, color: "info", icon: "\u{1F9E0}" },
    { name: "Cachorros", slug: "cachorros", count: 15, color: "warning", icon: "\u{1F436}" },
    { name: "Cuidado", slug: "cuidado", count: 22, color: "primary", icon: "\u{1F49A}" }
  ];
  let allArticlesForTags = [];
  try {
    allArticlesForTags = await getCollection("articulos");
    allArticlesForTags = allArticlesForTags.filter((article) => article.data.status === "published");
  } catch (error) {
    allArticlesForTags = [];
  }
  const popularTagsData = getPopularTagsFromArticles(allArticlesForTags, 8);
  const popularTags = popularTagsData.map((tag) => tag.name);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const getTimeAgo = (date) => {
    const now = /* @__PURE__ */ new Date();
    const articleDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1e3 * 60 * 60));
    if (diffInHours < 24) {
      return `hace ${diffInHours}h`;
    } else if (diffInHours < 24 * 7) {
      return `hace ${Math.floor(diffInHours / 24)}d`;
    } else {
      return formatDate(date);
    }
  };
  const title = "Balto - La revista digital de mascotas";
  const description = "Descubre art\xEDculos especializados sobre entrenamiento, alimentaci\xF3n, salud y comportamiento de perros y gatos. Consejos de expertos para mejorar la vida de tu mascota.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="bg-gradient-to-r from-green-500 to-green-600"> ${renderComponent($$result2, "Container", $$Container, {}, { "default": async ($$result3) => renderTemplate` <div class="py-16 md:py-20 text-center"> <h1 class="text-3xl md:text-6xl font-bold text-white mb-4">La revista digital en mascotas</h1> <p class="text-lg text-white text-opacity-90 max-w-2xl mx-auto mb-8">
Artículos, consejos y guías escritos por expertos para mejorar la calidad de vida de tus mascotas
</p> <div class="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto"> ${categories.slice(0, 6).map((category) => renderTemplate`<a${addAttribute(`/${category.slug}`, "href")} class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-200"> <span class="mr-2">${category.icon}</span> ${category.name} </a>`)} </div> </div> ` })} </div> ${renderComponent($$result2, "Container", $$Container, { "class": "py-12" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">  <div class="lg:col-span-8">  ${featuredArticle && renderTemplate`<section class="mb-12"> <div class="flex items-center gap-3 mb-6"> <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center"> <span class="text-white text-sm">⭐</span> </div> <h2 class="text-2xl font-bold text-gray-900">Artículo Destacado</h2> <div class="flex-1 h-px bg-gradient-to-r from-yellow-200 to-transparent"></div> </div> ${renderComponent($$result3, "Card", $$Card, { "class": "overflow-hidden hover:shadow-xl transition-shadow duration-200" }, { "default": async ($$result4) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-5 gap-0"> <div class="md:col-span-2"> ${renderComponent($$result4, "Image", $$Image, { "src": featuredArticle.data?.image || "/images/articles/default.jpg", "alt": featuredArticle.data?.title || "Art\xEDculo destacado", "width": 400, "height": 250, "class": "w-full h-48 md:h-full object-cover" })} </div> <div class="md:col-span-3 p-6"> <div class="flex items-center gap-2 mb-3"> ${renderComponent($$result4, "Badge", $$Badge, { "variant": "secondary", "size": "sm" }, { "default": async ($$result5) => renderTemplate`${featuredArticle.data?.category || "General"}` })} <span class="text-sm text-gray-500"> ${getTimeAgo(featuredArticle.data?.date)} </span> </div> <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2"> <a${addAttribute(`/articulos/${featuredArticle.slug}`, "href")} class="hover:text-green-600 transition-colors"> ${featuredArticle.data?.title} </a> </h3> <p class="text-gray-600 mb-4 line-clamp-2"> ${featuredArticle.data?.description} </p> <div class="flex items-center justify-between"> <div class="flex items-center gap-2"> ${renderComponent($$result4, "Image", $$Image, { "src": getAuthorAvatar(featuredArticle.data?.author || "Editor Balto"), "alt": featuredArticle.data?.author || "Editor Balto", "width": 32, "height": 32, "class": "w-8 h-8 rounded-full object-cover" })} <span class="text-sm text-gray-600"> ${featuredArticle.data?.author || "Editor Balto"} </span> </div> ${renderComponent($$result4, "Button", $$Button, { "href": `/blog/${featuredArticle.slug}`, "variant": "primary", "size": "sm" }, { "default": async ($$result5) => renderTemplate`
Leer más
` })} </div> </div> </div> ` })} </section>`}  <section class="mb-12"> <div class="flex items-center gap-3 mb-8"> <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"> <span class="text-white text-sm">📚</span> </div> <h2 class="text-2xl font-bold text-gray-900">Artículos Recientes</h2> <div class="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div> </div> ${otherArticles.length > 0 ? renderTemplate`${renderComponent($$result3, "ArticleList", $$ArticleList, { "articles": otherArticles.map((article) => ({
    id: article.slug,
    title: article.data?.title || "T\xEDtulo del art\xEDculo",
    excerpt: article.data?.description || "Descripci\xF3n del art\xEDculo",
    image: article.data?.image || "/images/articles/default.jpg",
    author: {
      name: article.data?.author || "Editor Balto",
      avatar: getAuthorAvatar(article.data?.author || "Editor Balto")
    },
    date: article.data?.date ? article.data.date.toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    readingTime: article.data?.readingTime || 5,
    categories: article.data?.tags || [],
    featured: false
  })), "layout": "grid", "columns": 2 })}` : renderTemplate`<div class="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-8 text-center border-2 border-green-200"> <span class="text-4xl mb-4 block">📝</span> <h3 class="text-lg font-medium text-gray-900 mb-2">
No hay más artículos disponibles
</h3> <p class="text-gray-600 mb-4">
Vuelve pronto para ver nuevo contenido.
</p> </div>`} </section>  ${totalPages > 1 && renderTemplate`<div class="mt-12 text-center"> <div class="inline-flex items-center gap-4"> <span class="text-gray-600 font-medium">
Página 1 de ${totalPages} • ${allArticles.length} artículos totales
</span> <a href="/articulos/page/2" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"> <span>Ver más artículos</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </div>`} </div>  <div class="lg:col-span-4"> <div class="sticky top-[140px] space-y-8">  ${renderComponent($$result3, "Card", $$Card, { "class": "p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" }, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3 mb-6"> <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"> <span class="text-white text-sm">📊</span> </div> <h3 class="text-xl font-bold text-gray-900">Estadísticas</h3> </div> <div class="grid grid-cols-2 gap-4"> <div class="text-center"> <div class="text-2xl font-bold text-green-600">${stats.total}</div> <div class="text-sm text-gray-600">Artículos</div> </div> <div class="text-center"> <div class="text-2xl font-bold text-blue-600">${stats.categories}</div> <div class="text-sm text-gray-600">Categorías</div> </div> <div class="text-center"> <div class="text-2xl font-bold text-purple-600">${stats.authors}</div> <div class="text-sm text-gray-600">Autores</div> </div> <div class="text-center"> <div class="text-2xl font-bold text-orange-600">${stats.readingTime}</div> <div class="text-sm text-gray-600">Min. promedio</div> </div> </div> ` })}  ${renderComponent($$result3, "Card", $$Card, { "class": "p-8" }, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3 mb-6"> <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"> <span class="text-white text-sm">🏷️</span> </div> <h3 class="text-xl font-bold text-gray-900">Categorías</h3> </div> <div class="space-y-3"> ${categories.map((category) => renderTemplate`<a${addAttribute(`/${category.slug}`, "href")} class="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"> <div class="flex items-center gap-3"> <span class="text-lg">${category.icon}</span> <span class="font-medium text-gray-900 group-hover:text-green-600 transition-colors"> ${category.name} </span> </div> ${renderComponent($$result4, "Badge", $$Badge, { "variant": "secondary", "size": "sm" }, { "default": async ($$result5) => renderTemplate`${category.count}` })} </a>`)} </div> ` })}  ${popularTags.length > 0 && renderTemplate`${renderComponent($$result3, "Card", $$Card, { "class": "p-8" }, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3 mb-6"> <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center"> <span class="text-white text-sm">🔥</span> </div> <h3 class="text-xl font-bold text-gray-900">Temas Populares</h3> </div> <div class="flex flex-wrap gap-2"> ${popularTags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`, "href")} class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 transition-all duration-200"> ${tag} </a>`)} </div> ` })}`}  ${renderComponent($$result3, "Newsletter", $$Newsletter, {})} </div> </div> </div> ` })} ` })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/articulos/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/articulos/index.astro";
const $$url = "/articulos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
