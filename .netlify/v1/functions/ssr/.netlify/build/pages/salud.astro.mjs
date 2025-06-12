/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { getCollection } from '../chunks/_astro_content_p4FGYWmy.mjs';
import { $ as $$CategoryLayout } from '../chunks/CategoryLayout_I3m1DxIi.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const todosLosArticulos = await getCollection("articulos");
  const todasLasCategorias = await getCollection("categorias");
  const articles = todosLosArticulos.filter((articulo) => {
    const categoria = articulo.data.category;
    const etiquetas = articulo.data.tags || [];
    return categoria === "salud" || etiquetas.includes("salud") || etiquetas.includes("health") || etiquetas.includes("veterinario") || etiquetas.includes("medicina") || etiquetas.includes("enfermedad");
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
  const categoriaSalud = todasLasCategorias.find((cat) => cat.slug === "salud");
  const featuredArticle = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const title = categoriaSalud?.data.name || "\u{1F3E5} Salud";
  const description = categoriaSalud?.data.description || "Mant\xE9n a tu mascota saludable con informaci\xF3n veterinaria confiable y actualizada";
  return renderTemplate`${renderComponent($$result, "CategoryLayout", $$CategoryLayout, { "title": title, "description": description, "category": "salud", "articles": articles, "featuredArticle": featuredArticle })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/salud/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/salud/index.astro";
const $$url = "/salud";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
