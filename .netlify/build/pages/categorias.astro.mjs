/* empty css                                      */
import { c as createComponent, b as renderScript, d as renderHead, f as addAttribute, a as renderTemplate } from '../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import 'clsx';
import { getCollection } from '../chunks/_astro_content_Yp6Qe3RC.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const categorias = await getCollection("categorias").catch(() => []);
  if (categorias.length > 0) {
    categorias.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  }
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Categorías - Balto</title><meta name="description" content="Explora todas las categorías de contenido sobre cuidado de mascotas">${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/index.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body class="bg-gray-50"> <div class="container mx-auto px-4 py-8"> <header class="text-center mb-12"> <h1 class="text-4xl font-bold text-gray-900 mb-4">Categorías</h1> <p class="text-xl text-gray-600">Explora todo nuestro contenido organizado por temas</p> </header> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${categorias.map((categoria) => renderTemplate`<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"> <div class="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"> <span class="text-4xl">${categoria.data.icon || "\u{1F4C1}"}</span> </div> <div class="p-6"> <h2 class="text-xl font-bold mb-2 text-gray-900"> <a${addAttribute(`/categorias/${categoria.slug}/`, "href")} class="hover:text-blue-600"> ${categoria.data.name} </a> </h2> <p class="text-gray-600 mb-4">${categoria.data.description}</p> <div class="flex items-center justify-between"> <span${addAttribute(`px-3 py-1 rounded-full text-sm font-medium
                ${categoria.data.color === "green" ? "bg-green-100 text-green-800" : ""}
                ${categoria.data.color === "blue" ? "bg-blue-100 text-blue-800" : ""}
                ${categoria.data.color === "purple" ? "bg-purple-100 text-purple-800" : ""}
                ${!categoria.data.color ? "bg-gray-100 text-gray-800" : ""}
              `, "class")}> ${categoria.data.name} </span> ${categoria.data.featured && renderTemplate`<span class="text-yellow-500 text-sm">⭐ Destacada</span>`} </div> <div class="mt-4"> <a${addAttribute(`/categorias/${categoria.slug}/`, "href")} class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
Ver artículos →
</a> </div> </div> </div>`)} </div> ${categorias.length === 0 && renderTemplate`<div class="text-center py-12"> <p class="text-gray-500 text-lg">No hay categorías disponibles aún.</p> <p class="text-gray-400 mt-2">¡Pronto agregaremos más contenido!</p> </div>`} <div class="text-center mt-12"> <a href="/articulos/" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
Ver todos los artículos
</a> </div> </div> </body></html>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/index.astro";
const $$url = "/categorias";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
