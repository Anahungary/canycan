/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { getCollection } from '../chunks/_astro_content_p4FGYWmy.mjs';
import { $ as $$CategoryLayout } from '../chunks/CategoryLayout_I3m1DxIi.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const todosLosArticulos = await getCollection("articulos").catch(() => []);
  const todasLasCategorias = await getCollection("categorias").catch(() => []);
  const todasLasEtiquetas = await getCollection("etiquetas").catch(() => []);
  const articles = todosLosArticulos.filter((articulo) => {
    const categoria = articulo.data.category;
    const etiquetas = articulo.data.tags || [];
    return categoria === "cachorros" || etiquetas.includes("cachorros") || etiquetas.includes("puppies") || etiquetas.includes("cachorro") || etiquetas.includes("socializacion") || etiquetas.includes("entrenamiento-cachorro") || etiquetas.includes("primeros-dias");
  }).map((articulo) => ({
    id: articulo.slug,
    title: articulo.data.title,
    excerpt: articulo.data.description || articulo.data.excerpt || "",
    image: articulo.data.image || "/images/articles/default.jpg",
    date: articulo.data.date.toISOString().split("T")[0],
    author: {
      name: articulo.data.author || "Editor Balto",
      avatar: "/images/authors/default.jpg"
    },
    readingTime: articulo.data.readingTime || 5,
    categories: [articulo.data.category, ...articulo.data.tags || []].filter(Boolean)
  }));
  const categoriaCachorros = todasLasCategorias.find((cat) => cat.slug === "cachorros");
  const featuredArticle = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const popularTags = todasLasEtiquetas.filter((tag) => {
    const relatedCategories = tag.data.categories || [];
    return relatedCategories.includes("cachorros");
  }).map((tag) => tag.data.name);
  const subcategories = todasLasEtiquetas.filter((tag) => {
    const relatedCategories = tag.data.categories || [];
    return relatedCategories.includes("cachorros");
  }).map((tag) => tag.data.name);
  const title = categoriaCachorros?.data.name || "Cachorros";
  const description = categoriaCachorros?.data.description || "Todo lo que necesitas saber sobre el cuidado, entrenamiento y desarrollo de tu cachorro.";
  const image = categoriaCachorros?.data.image || "/images/categories/puppies-banner.jpg";
  return renderTemplate`${renderComponent($$result, "CategoryLayout", $$CategoryLayout, { "title": title, "description": description, "image": image, "category": "cachorros", "subcategories": subcategories, "articles": articles, "popularTags": popularTags, "featuredArticle": featuredArticle })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/cachorros/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/cachorros/index.astro";
const $$url = "/cachorros";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
