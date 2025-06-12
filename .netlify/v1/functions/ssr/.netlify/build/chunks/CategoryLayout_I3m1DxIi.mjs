import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from './astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from './Container_BIbJk0Bg.mjs';
import { $ as $$Button } from './Button_DiQu0Jvt.mjs';
import { b as $$Card, $ as $$Badge, a as $$ArticleList } from './Card_DX0aPP0J.mjs';
import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { $ as $$Image } from './_astro_assets_Cc6zF1xQ.mjs';
import { $ as $$Newsletter } from './Newsletter_DZtf81gC.mjs';
/* empty css                         */

const $$Astro = createAstro("https://Balto.com");
const $$CategoryLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryLayout;
  const {
    title,
    description,
    image = "/images/categories/default.jpg",
    category,
    articles = [],
    featuredArticle
  } = Astro2.props;
  function getAuthorAvatar(authorName) {
    const authorAvatars = {
      "Ana Mar\xEDa Prieto": "/images/ana-p2.webp",
      "Manuel Alejandro Bedoya": "/images/manuel-p1.webp",
      "Equipo Editorial Balto": "/images/baltologo.svg",
      "Editor Balto": "/images/baltologo.svg"
    };
    return authorAvatars[authorName] || "/images/baltologo.svg";
  }
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
  const displayFeaturedArticle = featuredArticle || articles[0];
  const otherArticles = displayFeaturedArticle ? articles.filter((a) => a.id !== displayFeaturedArticle.id).slice(0, 8) : articles.slice(1, 9);
  const getAllTagsFromArticles = (articles2) => {
    const allTags = [];
    articles2.forEach((article) => {
      if (article.categories && Array.isArray(article.categories)) {
        allTags.push(...article.categories);
      }
    });
    const tagCounts = allTags.reduce((acc, tag) => {
      const normalizedTag = tag.toLowerCase().trim();
      acc[normalizedTag] = (acc[normalizedTag] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 8).map(([tag, count]) => tag.charAt(0).toUpperCase() + tag.slice(1));
  };
  const popularTags = getAllTagsFromArticles(articles);
  const stats = {
    total: articles.length,
    categories: popularTags.length,
    authors: [...new Set(articles.map((a) => a.author?.name).filter(Boolean))].length || 1,
    readingTime: 6
  };
  const getCategoryIcon = (category2) => {
    const icons = {
      "entrenamiento": "\u{1F3AF}",
      "cuidado": "\u{1F49A}",
      "comportamiento": "\u{1F9E0}",
      "nuevos-duenos": "\u{1F3E0}",
      "alimentacion": "\u{1F37D}\uFE0F",
      "salud": "\u{1F3E5}"
    };
    return icons[category2?.toLowerCase()] || "\u{1F4DA}";
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description, "data-astro-cid-5stfgk4a": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="bg-gradient-to-r from-green-500 to-green-600" data-astro-cid-5stfgk4a> ${renderComponent($$result2, "Container", $$Container, { "data-astro-cid-5stfgk4a": true }, { "default": ($$result3) => renderTemplate` <div class="py-16 md:py-20 text-center" data-astro-cid-5stfgk4a> <h1 class="text-3xl md:text-6xl font-bold text-white mb-4" data-astro-cid-5stfgk4a>${title}</h1> <p class="text-lg text-white text-opacity-90 max-w-2xl mx-auto mb-8" data-astro-cid-5stfgk4a> ${description} </p>  ${popularTags.length > 0 && renderTemplate`<div class="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto" data-astro-cid-5stfgk4a> ${popularTags.slice(0, 6).map((tag) => renderTemplate`<span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 text-white transition-all duration-200" data-astro-cid-5stfgk4a> <span class="mr-2" data-astro-cid-5stfgk4a>${getCategoryIcon(category)}</span> ${tag} </span>`)} </div>`} </div> ` })} </div> ${renderComponent($$result2, "Container", $$Container, { "class": "py-12", "data-astro-cid-5stfgk4a": true }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-12 gap-8" data-astro-cid-5stfgk4a>  <div class="lg:col-span-8" data-astro-cid-5stfgk4a>  ${displayFeaturedArticle && renderTemplate`<section class="mb-12" data-astro-cid-5stfgk4a> <div class="flex items-center gap-3 mb-6" data-astro-cid-5stfgk4a> <div class="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center" data-astro-cid-5stfgk4a> <span class="text-white text-sm" data-astro-cid-5stfgk4a>⭐</span> </div> <h2 class="text-2xl font-bold text-gray-900" data-astro-cid-5stfgk4a>Artículo Destacado</h2> <div class="flex-1 h-px bg-gradient-to-r from-yellow-200 to-transparent" data-astro-cid-5stfgk4a></div> </div> ${renderComponent($$result3, "Card", $$Card, { "class": "overflow-hidden hover:shadow-xl transition-shadow duration-200", "data-astro-cid-5stfgk4a": true }, { "default": ($$result4) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-5 gap-0" data-astro-cid-5stfgk4a> <div class="md:col-span-2" data-astro-cid-5stfgk4a> ${renderComponent($$result4, "Image", $$Image, { "src": displayFeaturedArticle.image || "/images/articles/default.jpg", "alt": displayFeaturedArticle.title || "Art\xEDculo destacado", "width": 400, "height": 250, "class": "w-full h-48 md:h-full object-cover", "data-astro-cid-5stfgk4a": true })} </div> <div class="md:col-span-3 p-6" data-astro-cid-5stfgk4a> <div class="flex items-center gap-2 mb-3" data-astro-cid-5stfgk4a> ${renderComponent($$result4, "Badge", $$Badge, { "variant": "secondary", "size": "sm", "data-astro-cid-5stfgk4a": true }, { "default": ($$result5) => renderTemplate`${category}` })} <span class="text-sm text-gray-500" data-astro-cid-5stfgk4a> ${getTimeAgo(displayFeaturedArticle.date)} </span> </div> <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2" data-astro-cid-5stfgk4a> <a${addAttribute(`/articulos/${displayFeaturedArticle.id}`, "href")} class="hover:text-green-600 transition-colors" data-astro-cid-5stfgk4a> ${displayFeaturedArticle.title} </a> </h3> <p class="text-gray-600 mb-4 line-clamp-2" data-astro-cid-5stfgk4a> ${displayFeaturedArticle.excerpt} </p> <div class="flex items-center justify-between" data-astro-cid-5stfgk4a> <div class="flex items-center gap-2" data-astro-cid-5stfgk4a> ${renderComponent($$result4, "Image", $$Image, { "src": getAuthorAvatar(displayFeaturedArticle.author?.name || "Editor Balto"), "alt": displayFeaturedArticle.author?.name || "Editor Balto", "width": 32, "height": 32, "class": "w-8 h-8 rounded-full object-cover", "data-astro-cid-5stfgk4a": true })} <span class="text-sm text-gray-600" data-astro-cid-5stfgk4a> ${displayFeaturedArticle.author?.name || "Editor Balto"} </span> </div> ${renderComponent($$result4, "Button", $$Button, { "href": `/articulos/${displayFeaturedArticle.id}`, "variant": "primary", "size": "sm", "data-astro-cid-5stfgk4a": true }, { "default": ($$result5) => renderTemplate`
Leer más
` })} </div> </div> </div> ` })} </section>`}  <section class="mb-12" data-astro-cid-5stfgk4a> <div class="flex items-center gap-3 mb-8" data-astro-cid-5stfgk4a> <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center" data-astro-cid-5stfgk4a> <span class="text-white text-sm" data-astro-cid-5stfgk4a>📚</span> </div> <h2 class="text-2xl font-bold text-gray-900" data-astro-cid-5stfgk4a>Más artículos de ${category}</h2> <div class="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent" data-astro-cid-5stfgk4a></div> </div> ${otherArticles.length > 0 ? renderTemplate`${renderComponent($$result3, "ArticleList", $$ArticleList, { "articles": otherArticles.map((article) => ({
    id: article.id,
    title: article.title || "T\xEDtulo del art\xEDculo",
    excerpt: article.excerpt || "Descripci\xF3n del art\xEDculo",
    image: article.image || "/images/articles/default.jpg",
    author: {
      name: article.author?.name || "Editor Balto",
      avatar: getAuthorAvatar(article.author?.name || "Editor Balto")
    },
    date: article.date,
    readingTime: article.readingTime || 5,
    categories: article.categories || [],
    featured: false
  })), "layout": "grid", "columns": 2, "data-astro-cid-5stfgk4a": true })}` : renderTemplate`<div class="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-8 text-center border-2 border-green-200" data-astro-cid-5stfgk4a> <span class="text-4xl mb-4 block" data-astro-cid-5stfgk4a>📝</span> <h3 class="text-lg font-medium text-gray-900 mb-2" data-astro-cid-5stfgk4a>
No hay más artículos de ${category} </h3> <p class="text-gray-600 mb-4" data-astro-cid-5stfgk4a>
Vuelve pronto para ver nuevo contenido.
</p> </div>`} </section>  ${articles.length > 9 && renderTemplate`<div class="mt-12 text-center" data-astro-cid-5stfgk4a> <div class="inline-flex items-center gap-4" data-astro-cid-5stfgk4a> <span class="text-gray-600 font-medium" data-astro-cid-5stfgk4a>
Mostrando ${Math.min(9, articles.length)} de ${articles.length} artículos
</span> <a${addAttribute(`/${category}`, "href")} class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl" data-astro-cid-5stfgk4a> <span data-astro-cid-5stfgk4a>Ver todos los artículos</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5stfgk4a> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-5stfgk4a></path> </svg> </a> </div> </div>`} </div>  <div class="lg:col-span-4" data-astro-cid-5stfgk4a> <div class="sticky top-[140px] space-y-8" data-astro-cid-5stfgk4a>  ${renderComponent($$result3, "Card", $$Card, { "class": "p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", "data-astro-cid-5stfgk4a": true }, { "default": ($$result4) => renderTemplate` <div class="flex items-center gap-3 mb-6" data-astro-cid-5stfgk4a> <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center" data-astro-cid-5stfgk4a> <span class="text-white text-sm" data-astro-cid-5stfgk4a>📊</span> </div> <h3 class="text-xl font-bold text-gray-900" data-astro-cid-5stfgk4a>Estadísticas</h3> </div> <div class="grid grid-cols-2 gap-4" data-astro-cid-5stfgk4a> <div class="text-center" data-astro-cid-5stfgk4a> <div class="text-2xl font-bold text-green-600" data-astro-cid-5stfgk4a>${stats.total}</div> <div class="text-sm text-gray-600" data-astro-cid-5stfgk4a>Artículos</div> </div> <div class="text-center" data-astro-cid-5stfgk4a> <div class="text-2xl font-bold text-blue-600" data-astro-cid-5stfgk4a>${stats.categories}</div> <div class="text-sm text-gray-600" data-astro-cid-5stfgk4a>Temas</div> </div> <div class="text-center" data-astro-cid-5stfgk4a> <div class="text-2xl font-bold text-purple-600" data-astro-cid-5stfgk4a>${stats.authors}</div> <div class="text-sm text-gray-600" data-astro-cid-5stfgk4a>Autores</div> </div> <div class="text-center" data-astro-cid-5stfgk4a> <div class="text-2xl font-bold text-orange-600" data-astro-cid-5stfgk4a>${stats.readingTime}</div> <div class="text-sm text-gray-600" data-astro-cid-5stfgk4a>Min. promedio</div> </div> </div> ` })}  ${popularTags.length > 0 && renderTemplate`${renderComponent($$result3, "Card", $$Card, { "class": "p-8", "data-astro-cid-5stfgk4a": true }, { "default": ($$result4) => renderTemplate` <div class="flex items-center gap-3 mb-6" data-astro-cid-5stfgk4a> <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center" data-astro-cid-5stfgk4a> <span class="text-white text-sm" data-astro-cid-5stfgk4a>🔥</span> </div> <h3 class="text-xl font-bold text-gray-900" data-astro-cid-5stfgk4a>Temas Populares</h3> </div> <div class="flex flex-wrap gap-2" data-astro-cid-5stfgk4a> ${popularTags.map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`, "href")} class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200 transition-all duration-200" data-astro-cid-5stfgk4a> ${tag} </a>`)} </div> ` })}`}  ${renderComponent($$result3, "Newsletter", $$Newsletter, { "data-astro-cid-5stfgk4a": true })} </div> </div> </div> ` })} ` })} `;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/layouts/CategoryLayout.astro", void 0);

export { $$CategoryLayout as $ };
