/* empty css                                 */
import { c as createComponent, e as renderScript, g as renderHead, d as addAttribute, a as renderTemplate } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import 'clsx';
import { getCollection } from '../chunks/_astro_content_p4FGYWmy.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  function getIconForTag(tagName) {
    const iconMap = {
      "Adopci\xF3n": "\u{1F3E0}",
      "Alimentaci\xF3n": "\u{1F37D}\uFE0F",
      "Alimentaci\xF3n Casera": "\u{1F468}\u200D\u{1F373}",
      "Nutrici\xF3n Econ\xF3mica": "\u{1F4B0}",
      "Entrenamiento": "\u{1F3AF}",
      "Adiestramiento": "\u{1F393}",
      "Salud": "\u{1F3E5}",
      "Salud Veterinaria": "\u2695\uFE0F",
      "Comportamiento": "\u{1F9E0}",
      "Cachorros": "\u{1F436}",
      "Gatos": "\u{1F431}",
      "Perros": "\u{1F415}",
      "Socializaci\xF3n": "\u{1F465}",
      "Primeros Auxilios": "\u{1F198}",
      "Cuidado B\xE1sico": "\u{1F49A}",
      "Nuevos Due\xF1os": "\u{1F43E}",
      "Veterinaria": "\u2695\uFE0F",
      "Razas": "\u{1F4CB}"
    };
    return iconMap[tagName] || "\u{1F3F7}\uFE0F";
  }
  async function getArticleCountForTag(tagSlug) {
    try {
      const todosLosArticulos = await getCollection("articulos");
      const articulosPublicados = todosLosArticulos.filter(
        (articulo) => articulo.data.status === "published"
      );
      const count = articulosPublicados.filter((articulo) => {
        const tags = articulo.data.tags || [];
        const category = articulo.data.category || "";
        return tags.includes(tagSlug) || tags.some((tag) => tag.toLowerCase() === tagSlug.toLowerCase()) || category.toLowerCase() === tagSlug.toLowerCase();
      }).length;
      return count;
    } catch (error) {
      console.log(`\u26A0\uFE0F Error contando art\xEDculos para ${tagSlug}:`, error);
      return 0;
    }
  }
  let etiquetasFromCMS = [];
  try {
    etiquetasFromCMS = await getCollection("etiquetas");
    console.log(`\u{1F4CA} Cargadas ${etiquetasFromCMS.length} etiquetas del CMS`);
  } catch (error) {
    console.log("\u26A0\uFE0F No se pudieron cargar etiquetas del CMS:", error);
    etiquetasFromCMS = [];
  }
  const etiquetas = await Promise.all(
    etiquetasFromCMS.map(async (etiqueta) => {
      const articleCount = await getArticleCountForTag(etiqueta.data.slug);
      return {
        name: etiqueta.data.name,
        slug: etiqueta.data.slug,
        description: etiqueta.data.description || `Art\xEDculos sobre ${etiqueta.data.name.toLowerCase()}`,
        color: etiqueta.data.color || "gray",
        icon: getIconForTag(etiqueta.data.name),
        articlesCount: articleCount,
        featured: etiqueta.data.featured || false
      };
    })
  );
  etiquetas.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.articlesCount - a.articlesCount;
  });
  console.log(`\u2705 Procesadas ${etiquetas.length} etiquetas din\xE1micamente`);
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Etiquetas - Balto</title><meta name="description" content="Explora todos los temas sobre cuidado de mascotas organizados por etiquetas">${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/etiquetas/index.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body class="bg-gray-50"> <div class="container mx-auto px-4 py-8"> <header class="text-center mb-12"> <h1 class="text-4xl font-bold text-gray-900 mb-4">Explora por Temas</h1> <p class="text-xl text-gray-600">Encuentra contenido específico usando nuestras etiquetas temáticas</p> </header> <!-- Etiquetas destacadas --> <section class="mb-12"> <h2 class="text-2xl font-bold text-gray-900 mb-6">🔥 Temas Más Populares</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${etiquetas.filter((etiqueta) => etiqueta.featured).map((etiqueta) => renderTemplate`<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"> <div${addAttribute(`h-20 flex items-center justify-center text-4xl
              ${etiqueta.color === "green" ? "bg-green-100" : ""}
              ${etiqueta.color === "orange" ? "bg-orange-100" : ""}
              ${etiqueta.color === "blue" ? "bg-blue-100" : ""}
              ${etiqueta.color === "red" ? "bg-red-100" : ""}
              ${etiqueta.color === "pink" ? "bg-pink-100" : ""}
              ${etiqueta.color === "brown" ? "bg-yellow-100" : ""}
              ${etiqueta.color === "purple" ? "bg-purple-100" : ""}
              ${etiqueta.color === "teal" ? "bg-teal-100" : ""}
              ${etiqueta.color === "indigo" ? "bg-indigo-100" : ""}
              ${etiqueta.color === "cyan" ? "bg-cyan-100" : ""}
              ${etiqueta.color === "yellow" ? "bg-yellow-100" : ""}
              ${etiqueta.color === "gray" ? "bg-gray-100" : ""}
            `, "class")}> ${etiqueta.icon} </div> <div class="p-6"> <h3 class="text-xl font-bold text-gray-900 mb-2">${etiqueta.name}</h3> <p class="text-gray-600 text-sm mb-4">${etiqueta.description}</p> <div class="flex items-center justify-between mb-4"> <span class="text-sm text-gray-500">${etiqueta.articlesCount} artículos</span> <span${addAttribute(`px-3 py-1 rounded-full text-xs font-medium
                  ${etiqueta.color === "green" ? "bg-green-100 text-green-800" : ""}
                  ${etiqueta.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                  ${etiqueta.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                  ${etiqueta.color === "red" ? "bg-red-100 text-red-800" : ""}
                  ${etiqueta.color === "pink" ? "bg-pink-100 text-pink-800" : ""}
                  ${etiqueta.color === "brown" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${etiqueta.color === "purple" ? "bg-purple-100 text-purple-800" : ""}
                  ${etiqueta.color === "teal" ? "bg-teal-100 text-teal-800" : ""}
                  ${etiqueta.color === "indigo" ? "bg-indigo-100 text-indigo-800" : ""}
                  ${etiqueta.color === "cyan" ? "bg-cyan-100 text-cyan-800" : ""}
                  ${etiqueta.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${etiqueta.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
                `, "class")}>
Popular
</span> </div> <a${addAttribute(`/etiquetas/${etiqueta.slug}/`, "href")} class="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm w-full justify-center">
Ver artículos →
</a> </div> </div>`)} </div> </section> <!-- Todas las etiquetas --> <section> <h2 class="text-2xl font-bold text-gray-900 mb-6">📚 Todos los Temas</h2> <!-- Vista de nube de etiquetas --> <div class="bg-white rounded-lg p-8 shadow-sm mb-8"> <div class="flex flex-wrap gap-3 justify-center"> ${etiquetas.map((etiqueta) => renderTemplate`<a${addAttribute(`/etiquetas/${etiqueta.slug}/`, "href")}${addAttribute(`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:scale-105
                ${etiqueta.articlesCount > 20 ? "text-lg" : etiqueta.articlesCount > 10 ? "text-base" : "text-sm"}
                ${etiqueta.color === "green" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                ${etiqueta.color === "orange" ? "bg-orange-100 text-orange-800 hover:bg-orange-200" : ""}
                ${etiqueta.color === "blue" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""}
                ${etiqueta.color === "red" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}
                ${etiqueta.color === "pink" ? "bg-pink-100 text-pink-800 hover:bg-pink-200" : ""}
                ${etiqueta.color === "brown" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                ${etiqueta.color === "purple" ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
                ${etiqueta.color === "teal" ? "bg-teal-100 text-teal-800 hover:bg-teal-200" : ""}
                ${etiqueta.color === "indigo" ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" : ""}
                ${etiqueta.color === "cyan" ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200" : ""}
                ${etiqueta.color === "yellow" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                ${etiqueta.color === "gray" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : ""}
              `, "class")}> <span>${etiqueta.icon}</span> <span>${etiqueta.name}</span> <span class="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full"> ${etiqueta.articlesCount} </span> </a>`)} </div> </div> <!-- Lista detallada --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${etiquetas.map((etiqueta) => renderTemplate`<div class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"> <div class="flex items-center gap-3"> <span class="text-2xl">${etiqueta.icon}</span> <div class="flex-1"> <h3 class="font-semibold text-gray-900">${etiqueta.name}</h3> <p class="text-sm text-gray-600">${etiqueta.description}</p> </div> <div class="text-right"> <div class="text-sm font-medium text-gray-900">${etiqueta.articlesCount}</div> <div class="text-xs text-gray-500">artículos</div> </div> </div> <div class="mt-3 flex justify-between items-center"> <span${addAttribute(`px-2 py-1 rounded-full text-xs font-medium
                ${etiqueta.color === "green" ? "bg-green-100 text-green-800" : ""}
                ${etiqueta.color === "orange" ? "bg-orange-100 text-orange-800" : ""}
                ${etiqueta.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                ${etiqueta.color === "red" ? "bg-red-100 text-red-800" : ""}
                ${etiqueta.color === "pink" ? "bg-pink-100 text-pink-800" : ""}
                ${etiqueta.color === "brown" ? "bg-yellow-100 text-yellow-800" : ""}
                ${etiqueta.color === "purple" ? "bg-purple-100 text-purple-800" : ""}
                ${etiqueta.color === "teal" ? "bg-teal-100 text-teal-800" : ""}
                ${etiqueta.color === "indigo" ? "bg-indigo-100 text-indigo-800" : ""}
                ${etiqueta.color === "cyan" ? "bg-cyan-100 text-cyan-800" : ""}
                ${etiqueta.color === "yellow" ? "bg-yellow-100 text-yellow-800" : ""}
                ${etiqueta.color === "gray" ? "bg-gray-100 text-gray-800" : ""}
              `, "class")}> ${etiqueta.featured ? "Popular" : "Tema"} </span> <a${addAttribute(`/etiquetas/${etiqueta.slug}/`, "href")} class="text-blue-600 hover:text-blue-800 font-medium text-sm">
Ver →
</a> </div> </div>`)} </div> </section> <!-- Estadísticas --> <div class="mt-12 bg-white rounded-lg p-8 shadow-sm text-center"> <h2 class="text-2xl font-bold text-gray-900 mb-4">📊 Estadísticas del Contenido</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div> <div class="text-3xl font-bold text-blue-600">${etiquetas.length}</div> <div class="text-gray-600">Temas disponibles</div> </div> <div> <div class="text-3xl font-bold text-green-600"> ${etiquetas.reduce((total, etiqueta) => total + etiqueta.articlesCount, 0)} </div> <div class="text-gray-600">Artículos totales</div> </div> <div> <div class="text-3xl font-bold text-purple-600"> ${etiquetas.filter((e) => e.featured).length} </div> <div class="text-gray-600">Temas populares</div> </div> </div> </div> <!-- CTA --> <div class="text-center mt-12"> <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white"> <h2 class="text-2xl font-bold mb-4">¿Buscas algo específico?</h2> <p class="mb-6 opacity-90">Si no encuentras el tema que buscas, contáctanos y te ayudaremos a encontrar la información que necesitas.</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="/articulos/" class="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
Ver todos los artículos
</a> <a href="/contacto/" class="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
Contactar expertos
</a> </div> </div> </div> </div> </body></html>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/etiquetas/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/etiquetas/index.astro";
const $$url = "/etiquetas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
