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
    return categoria === "alimentacion" || etiquetas.includes("alimentacion") || etiquetas.includes("nutrition") || etiquetas.includes("comida") || etiquetas.includes("dieta") || etiquetas.includes("nutricion");
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
  const categoriaAlimentacion = todasLasCategorias.find((cat) => cat.slug === "alimentacion");
  const featuredArticle = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const title = categoriaAlimentacion?.data.name || "\u{1F37D}\uFE0F Alimentaci\xF3n";
  const description = categoriaAlimentacion?.data.description || "Nutrici\xF3n equilibrada y saludable para cada etapa de vida de tu mascota";
  return renderTemplate`${renderComponent($$result, "CategoryLayout", $$CategoryLayout, { "title": title, "description": description, "category": "alimentacion", "articles": articles, "featuredArticle": featuredArticle })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/alimentacion/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/alimentacion/index.astro";
const $$url = "/alimentacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
