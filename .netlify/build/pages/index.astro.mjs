/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, F as Fragment } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_BIbJk0Bg.mjs';
import { $ as $$Button } from '../chunks/Button_DiQu0Jvt.mjs';
import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { $ as $$Image } from '../chunks/_astro_assets_Cc6zF1xQ.mjs';
import { getCollection } from '../chunks/_astro_content_p4FGYWmy.mjs';
import { $ as $$Newsletter } from '../chunks/Newsletter_DZtf81gC.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let allArticles = [];
  try {
    allArticles = await getCollection("articulos");
    allArticles = allArticles.filter((article) => article.data.status === "published").sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  } catch (error) {
    console.log("No se pudieron cargar los art\xEDculos:", error);
    allArticles = [];
  }
  const heroArticle = allArticles[0] || null;
  const trendingArticles = allArticles.slice(1, 5);
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
    if (diffInHours < 1) return "Hace unos minutos";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return "Ayer";
    return formatDate(date);
  };
  const getCategoryColor = (category) => {
    const colors = {
      "razas": "bg-green-100 text-green-800 border-green-200",
      "comportamiento": "bg-gray-100 text-gray-800 border-gray-200",
      "alimentaci\xF3n": "bg-green-100 text-green-800 border-green-200",
      "entrenamiento": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "salud": "bg-gray-100 text-gray-800 border-gray-200",
      "cuidado": "bg-gray-100 text-gray-800 border-gray-200",
      "adopcion": "bg-green-100 text-green-800 border-green-200",
      "nuevos-duenos": "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Balto - La revista digital l\xEDder en mascotas", "description": "Noticias, an\xE1lisis y gu\xEDas sobre perros y gatos. Encuentra tu raza ideal, aprende t\xE9cnicas de entrenamiento y mantente al d\xEDa con las \xFAltimas tendencias.", "bodyClass": "homepage-modern", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`${heroArticle && renderTemplate`${maybeRenderHead()}<section class="bg-gradient-to-br from-green-700 to-green-500 py-12 md:px-24 px-0" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Container", $$Container, { "size": "xl", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-12 gap-8" data-astro-cid-j7pv25f6>  <div class="lg:col-span-8" data-astro-cid-j7pv25f6> <div class="mb-6" data-astro-cid-j7pv25f6> <a${addAttribute(`/articulos/${heroArticle.slug}`, "href")} class="block" data-astro-cid-j7pv25f6> <article class="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-green-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300" data-astro-cid-j7pv25f6>  <div class="relative h-64 sm:h-80 md:h-96 overflow-hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result3, "Image", $$Image, { "src": heroArticle.data?.image || "/images/articles/default.jpg", "alt": heroArticle.data?.title || "Art\xEDculo destacado sobre cuidado de mascotas", "width": 800, "height": 400, "class": "w-full h-full object-cover", "data-astro-cid-j7pv25f6": true })}  <div class="absolute top-4 left-4" data-astro-cid-j7pv25f6> <span class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg" data-astro-cid-j7pv25f6>
⭐ DESTACADO
</span> </div> </div>  <div class="p-6 sm:p-8" data-astro-cid-j7pv25f6>  <div class="mb-4" data-astro-cid-j7pv25f6> <span${addAttribute(`inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold ${getCategoryColor(heroArticle.data?.category || "general")}`, "class")} data-astro-cid-j7pv25f6> ${heroArticle.data?.category || "General"} </span> </div>  <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight hover:text-green-600 transition-colors" data-astro-cid-j7pv25f6> ${heroArticle.data?.title || "T\xEDtulo del art\xEDculo"} </h3>  <p class="text-gray-600 mb-6 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3" data-astro-cid-j7pv25f6> ${heroArticle.data?.description || "Descripci\xF3n del art\xEDculo"} </p>  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" data-astro-cid-j7pv25f6>  <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500" data-astro-cid-j7pv25f6> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>👤</span> <span data-astro-cid-j7pv25f6>${heroArticle.data?.author || "Editor Balto"}</span> </span> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>📅</span> <span data-astro-cid-j7pv25f6>${heroArticle.data?.date ? getTimeAgo(heroArticle.data.date) : "Reciente"}</span> </span> <span class="flex items-center gap-1" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>⏱️</span> <span data-astro-cid-j7pv25f6>${heroArticle.data?.readingTime || 5} min lectura</span> </span> </div>  <div class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-200 shadow-lg text-sm sm:text-base" data-astro-cid-j7pv25f6> <span data-astro-cid-j7pv25f6>Leer artículo</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-j7pv25f6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-j7pv25f6></path> </svg> </div> </div> </div> </article> </a> </div> </div>  ${trendingArticles.length > 0 && renderTemplate`<div class="lg:col-span-4" data-astro-cid-j7pv25f6> <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm" data-astro-cid-j7pv25f6> <div class="flex items-center justify-between mb-6" data-astro-cid-j7pv25f6> <img src="/images/perro3.svg" alt="Destacado" class="w-20" data-astro-cid-j7pv25f6> <h2 class="text-lg font-bold text-gray-900" data-astro-cid-j7pv25f6>Artículos destacados</h2> <a href="/articulos" class="text-sm text-green-600 font-medium" data-astro-cid-j7pv25f6>Ver todo</a> </div> <div class="space-y-4" data-astro-cid-j7pv25f6> ${trendingArticles.map((article, index) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate` <a${addAttribute(`/articulos/${article.slug}`, "href")} class="block" data-astro-cid-j7pv25f6> <article class="flex items-start space-x-3 py-2 rounded-lg" data-astro-cid-j7pv25f6> <div${addAttribute(`flex-shrink-0 w-8 h-8 ${index === 0 ? "bg-yellow-400" : "bg-green-500"} rounded-lg flex items-center justify-center text-white font-bold text-sm`, "class")} data-astro-cid-j7pv25f6> ${index + 1} </div> <div class="flex-1 min-w-0" data-astro-cid-j7pv25f6> <h3 class="text-sm font-semibold text-gray-900 line-clamp-2" data-astro-cid-j7pv25f6> ${article.data.title} </h3> <div class="flex items-center space-x-2 mt-1 text-xs text-gray-500" data-astro-cid-j7pv25f6> <span${addAttribute(`px-2 py-0.5 rounded-full ${getCategoryColor(article.data.category)}`, "class")} data-astro-cid-j7pv25f6> ${article.data.category} </span> <span data-astro-cid-j7pv25f6>•</span> <span data-astro-cid-j7pv25f6>${article.data.readingTime || 5}m</span> </div> </div> </article> </a> ${index < trendingArticles.length - 1 && renderTemplate`<div class="border-t border-gray-200 my-3" data-astro-cid-j7pv25f6></div>`}` })}`)} </div> </div> </div>`} </div> ` })} </section>`}${allArticles.length > 0 && renderTemplate`<section class="py-16 px-0 md:px-24 bg-white" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Container", $$Container, { "size": "xl", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center justify-between mb-8" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-gray-900" data-astro-cid-j7pv25f6>Últimas noticias</h2> ${renderComponent($$result3, "Button", $$Button, { "href": "/articulos", "variant": "outline", "size": "sm", "class": "border-green-500 text-green-600", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`
Ver todo
` })} </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-j7pv25f6> ${allArticles.slice(heroArticle ? 1 : 0, 10).map((article) => renderTemplate`<a${addAttribute(`/articulos/${article.slug}`, "href")} class="block" data-astro-cid-j7pv25f6> <article class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200" data-astro-cid-j7pv25f6> <div class="aspect-[16/10] relative overflow-hidden" data-astro-cid-j7pv25f6> ${renderComponent($$result3, "Image", $$Image, { "src": article.data.image || "/images/articles/default.jpg", "alt": article.data.title, "width": 400, "height": 250, "class": "w-full h-full object-cover", "data-astro-cid-j7pv25f6": true })} <div class="absolute top-3 left-3" data-astro-cid-j7pv25f6> <span${addAttribute(`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.data.category)}`, "class")} data-astro-cid-j7pv25f6> ${article.data.category} </span> </div> </div> <div class="p-5" data-astro-cid-j7pv25f6> <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2" data-astro-cid-j7pv25f6> ${article.data.title} </h3> <p class="text-gray-600 text-sm mb-3 line-clamp-2" data-astro-cid-j7pv25f6> ${article.data.description} </p> <div class="flex items-center justify-between text-xs text-gray-500" data-astro-cid-j7pv25f6> <div class="flex items-center space-x-2" data-astro-cid-j7pv25f6> <span class="font-medium" data-astro-cid-j7pv25f6>${article.data.author || "Editor"}</span> <span data-astro-cid-j7pv25f6>•</span> <span data-astro-cid-j7pv25f6>${getTimeAgo(article.data.date)}</span> </div> <span data-astro-cid-j7pv25f6>${article.data.readingTime || 5}m</span> </div> </div> </article> </a>`)} </div> ` })} </section>`}${allArticles.length === 0 && renderTemplate`<section class="py-16 bg-green-50" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Container", $$Container, { "size": "lg", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div class="text-center max-w-2xl mx-auto" data-astro-cid-j7pv25f6> <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6" data-astro-cid-j7pv25f6> <span class="text-4xl" data-astro-cid-j7pv25f6>📝</span> </div> <h2 class="text-2xl font-bold text-gray-900 mb-4" data-astro-cid-j7pv25f6>
¡Bienvenido a Balto!
</h2> <p class="text-gray-600 mb-8" data-astro-cid-j7pv25f6>
Aún no hay artículos publicados. Comienza creando contenido increíble para los amantes de las mascotas.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-j7pv25f6> ${renderComponent($$result3, "Button", $$Button, { "href": "/admin/", "variant": "primary", "size": "lg", "class": "bg-green-600 hover:bg-green-700 text-white", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`
📝 Crear primer artículo
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/comparador-razas", "variant": "outline", "size": "lg", "class": "border-yellow-500 text-yellow-600", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`
🔍 Explorar comparador
` })} </div> </div> ` })} </section>`}<section class="py-16 px-0 md:px-24 bg-gradient-to-br from-green-500 to-green-600 text-white" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Container", $$Container, { "size": "xl", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <h2 class="text-3xl lg:text-4xl font-bold mb-6" data-astro-cid-j7pv25f6>
Encuentra tu mascota ideal
</h2> <p class="text-lg text-green-100 mb-8" data-astro-cid-j7pv25f6>
Nuestro algoritmo inteligente analiza tu estilo de vida y te recomienda 
            las razas más compatibles. Muchas familias ya encontraron su compañero perfecto.
</p> <div class="flex flex-col sm:flex-row gap-4" data-astro-cid-j7pv25f6> ${renderComponent($$result3, "Button", $$Button, { "href": "/tu-raza-ideal", "variant": "secondary", "size": "lg", "class": "bg-yellow-400 text-yellow-900 hover:bg-yellow-500", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`
🎯 Test personalizado
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/comparador-razas", "variant": "outline", "size": "lg", "class": "border-white text-white hover:bg-white/10", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result4) => renderTemplate`
🔍 Comparar razas
` })} </div> </div> <div class="grid grid-cols-2 gap-4" data-astro-cid-j7pv25f6> <div class="bg-white/10 rounded-xl p-6 text-center" data-astro-cid-j7pv25f6> <div class="text-3xl font-bold mb-2" data-astro-cid-j7pv25f6>50+</div> <div class="text-sm text-green-100" data-astro-cid-j7pv25f6>Razas analizadas</div> </div> <div class="bg-yellow-400/20 rounded-xl p-6 text-center" data-astro-cid-j7pv25f6> <div class="text-3xl font-bold mb-2" data-astro-cid-j7pv25f6>95%</div> <div class="text-sm text-green-100" data-astro-cid-j7pv25f6>Satisfacción</div> </div> <div class="col-span-2 bg-white/10 rounded-xl p-6 text-center" data-astro-cid-j7pv25f6> <div class="text-sm text-green-100" data-astro-cid-j7pv25f6>Familias ayudadas</div> </div> </div> </div> ` })} </section> <section class="py-16 bg-yellow-50" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Container", $$Container, { "size": "lg", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div class="max-w-3xl mx-auto text-center" data-astro-cid-j7pv25f6> ${renderComponent($$result3, "Newsletter", $$Newsletter, { "variant": "homepage", "data-astro-cid-j7pv25f6": true })} </div> ` })} </section> ` })} `;
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
