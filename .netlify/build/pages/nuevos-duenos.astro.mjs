/* empty css                                      */
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { getCollection } from '../chunks/_astro_content_Yp6Qe3RC.mjs';
import { $ as $$CategoryLayout } from '../chunks/CategoryLayout_BEiJO_3Y.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const todosLosArticulos = await getCollection("articulos");
  const todasLasCategorias = await getCollection("categorias");
  const articles = todosLosArticulos.filter((articulo) => {
    const categoria = articulo.data.category;
    const etiquetas = articulo.data.tags || [];
    return categoria === "nuevos-duenos" || etiquetas.includes("nuevos-duenos") || etiquetas.includes("primer-mascota") || etiquetas.includes("adopcion") || etiquetas.includes("preparacion") || etiquetas.includes("primeros-dias");
  }).map((articulo) => ({
    id: articulo.slug,
    title: articulo.data.title,
    excerpt: articulo.data.description || articulo.data.excerpt,
    image: articulo.data.image || "/images/articles/default.jpg",
    date: articulo.data.date.toISOString().split("T")[0],
    author: {
      name: articulo.data.author || "Editor Balto",
      avatar: "/images/authors/default.jpg"
    },
    readingTime: articulo.data.readingTime || 5,
    categories: [articulo.data.category, ...articulo.data.tags || []].filter(Boolean)
  }));
  const categoriaNuevosDuenos = todasLasCategorias.find((cat) => cat.slug === "nuevos-duenos");
  const featuredArticle = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const title = categoriaNuevosDuenos?.data.name || "\u{1F3E0} Nuevos Due\xF1os";
  const description = categoriaNuevosDuenos?.data.description || "Gu\xEDa completa para quienes adoptan su primera mascota. Todo lo esencial paso a paso";
  return renderTemplate`${renderComponent($$result, "CategoryLayout", $$CategoryLayout, { "title": title, "description": description, "category": "nuevos-duenos", "articles": articles, "featuredArticle": featuredArticle })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/nuevos-duenos/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/nuevos-duenos/index.astro";
const $$url = "/nuevos-duenos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
