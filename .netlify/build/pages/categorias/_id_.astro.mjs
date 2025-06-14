/* empty css                                         */
import { e as createAstro, c as createComponent, f as addAttribute, b as renderScript, d as renderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { getCollection } from '../../chunks/_astro_content_Yp6Qe3RC.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://Balto.com");
async function getStaticPaths() {
  const categorias = await getCollection("categorias").catch(() => []);
  return categorias.map((categoria) => ({
    params: { slug: categoria.slug },
    props: { categoria }
  }));
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { categoria } = Astro2.props;
  if (!categoria) {
    return Astro2.redirect("/404");
  }
  const todosLosArticulos = await getCollection("articulos").catch(() => []);
  const articulosCategoria = todosLosArticulos.filter((articulo) => {
    const tags = articulo.data.tags || [];
    const category = articulo.data.category || "";
    return tags.includes(categoria.slug) || category.toLowerCase().includes(categoria.data.name.toLowerCase()) || tags.some((tag) => tag.toLowerCase().includes(categoria.data.name.toLowerCase()));
  });
  const { Content } = await categoria.render();
  return renderTemplate`<html lang="es" data-astro-cid-nzygga5x> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${categoria.data.name} - Balto</title><meta name="description"${addAttribute(categoria.data.description, "content")}>${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/[id].astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body class="bg-[#FAFAFA]" data-astro-cid-nzygga5x> <div class="container mx-auto px-4 py-8" data-astro-cid-nzygga5x> <!-- Header de la categoría con colores de la paleta --> <div class="bg-white rounded-lg shadow-sm p-8 mb-8 border border-[#C8D6B9] border-opacity-30" data-astro-cid-nzygga5x> <div class="flex items-center gap-4 mb-4" data-astro-cid-nzygga5x> <span class="text-5xl" data-astro-cid-nzygga5x>${categoria.data.icon || "\u{1F4C1}"}</span> <div data-astro-cid-nzygga5x> <h1 class="text-4xl font-bold text-[#2E2E2E]" data-astro-cid-nzygga5x>${categoria.data.name}</h1> <p class="text-xl text-[#2E2E2E] opacity-70 mt-2" data-astro-cid-nzygga5x>${categoria.data.description}</p> </div> </div> <div class="prose max-w-none mt-6 text-[#2E2E2E]" data-astro-cid-nzygga5x> ${renderComponent($$result, "Content", Content, { "data-astro-cid-nzygga5x": true })} </div> </div> <!-- Artículos de la categoría --> <div class="mb-8" data-astro-cid-nzygga5x> <h2 class="text-2xl font-bold text-[#2E2E2E] mb-6" data-astro-cid-nzygga5x>
Artículos de ${categoria.data.name} (${articulosCategoria.length})
</h2> ${articulosCategoria.length > 0 ? renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-nzygga5x> ${articulosCategoria.map((articulo) => renderTemplate`<article class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-[#C8D6B9] border-opacity-20" data-astro-cid-nzygga5x> <div class="aspect-video bg-gradient-to-br from-[#F4E2D8] to-[#C8D6B9] flex items-center justify-center" data-astro-cid-nzygga5x> ${articulo.data.image ? renderTemplate`<img${addAttribute(articulo.data.image, "src")}${addAttribute(articulo.data.title, "alt")} class="w-full h-full object-cover" data-astro-cid-nzygga5x>` : renderTemplate`<span class="text-[#AFC2D5] text-lg" data-astro-cid-nzygga5x>📄</span>`} </div> <div class="p-6" data-astro-cid-nzygga5x> <h3 class="text-lg font-bold mb-2" data-astro-cid-nzygga5x> <a${addAttribute(`/articulos/${articulo.slug}/`, "href")} class="hover:text-[#AFC2D5] text-[#2E2E2E]" data-astro-cid-nzygga5x> ${articulo.data.title} </a> </h3> <p class="text-[#2E2E2E] opacity-70 text-sm mb-4 line-clamp-3" data-astro-cid-nzygga5x> ${articulo.data.description} </p> <div class="flex items-center justify-between text-sm text-[#2E2E2E] opacity-60" data-astro-cid-nzygga5x> <span data-astro-cid-nzygga5x>${articulo.data.author || "Editor"}</span> <span data-astro-cid-nzygga5x>${articulo.data.readingTime || 5} min lectura</span> </div> <div class="mt-4" data-astro-cid-nzygga5x> <a${addAttribute(`/articulos/${articulo.slug}/`, "href")} class="inline-flex items-center text-[#AFC2D5] hover:text-[#F6B89E] font-medium text-sm transition-colors" data-astro-cid-nzygga5x>
Leer más →
</a> </div> </div> </article>`)} </div>` : renderTemplate`<div class="bg-[#F4E2D8] rounded-lg p-8 text-center border border-[#F6B89E] border-opacity-30" data-astro-cid-nzygga5x> <p class="text-[#2E2E2E] text-lg" data-astro-cid-nzygga5x>No hay artículos en esta categoría aún.</p> <p class="text-[#2E2E2E] opacity-70 mt-2" data-astro-cid-nzygga5x>¡Pronto agregaremos más contenido!</p> </div>`} </div> <!-- Navegación --> <div class="flex justify-center" data-astro-cid-nzygga5x> <a href="/categorias/" class="inline-flex items-center px-6 py-3 bg-[#AFC2D5] text-white font-medium rounded-lg hover:bg-[#9DB3C6] transition-colors" data-astro-cid-nzygga5x>
← Ver todas las categorías
</a> </div> </div> </body></html>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/[id].astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/categorias/[id].astro";
const $$url = "/categorias/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
