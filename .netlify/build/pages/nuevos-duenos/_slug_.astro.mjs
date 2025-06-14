/* empty css                                         */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_D02iGaEB.mjs';
import 'kleur/colors';
import { $ as $$CategoryLayout } from '../../chunks/CategoryLayout_BEiJO_3Y.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://Balto.com");
function getStaticPaths() {
  const subcategories = [
    {
      slug: "preparativos-iniciales",
      title: "Preparativos Iniciales",
      description: "Todo lo que necesitas preparar antes de traer tu mascota a casa.",
      articles: [
        {
          id: "checklist-nuevo-cachorro",
          title: "Checklist completo: todo lo que necesitas antes de traer tu cachorro",
          excerpt: "Lista exhaustiva de productos, preparativos y consideraciones esenciales para recibir a tu nuevo cachorro en casa.",
          image: "/images/articles/puppy-checklist.jpg",
          date: "2023-09-24",
          author: {
            name: "Laura Mart\xEDn",
            avatar: "/images/authors/laura-martin.jpg"
          },
          readingTime: 12,
          categories: ["Nuevos Due\xF1os", "Cachorros"]
        },
        {
          id: "preparar-casa-mascota",
          title: "C\xF3mo preparar tu casa para la llegada de tu nueva mascota",
          excerpt: "Gu\xEDa de seguridad y adaptaci\xF3n del hogar para crear un ambiente seguro y c\xF3modo para tu mascota.",
          image: "/images/articles/pet-proofing-home.jpg",
          date: "2023-09-14",
          author: {
            name: "Mar\xEDa G\xF3mez",
            avatar: "/images/authors/maria-gomez.jpg"
          },
          readingTime: 7,
          categories: ["Nuevos Due\xF1os", "Seguridad"]
        }
      ]
    },
    {
      slug: "primeros-dias",
      title: "Primeros D\xEDas",
      description: "Gu\xEDas para los primeros d\xEDas y semanas con tu nueva mascota.",
      articles: [
        {
          id: "primeros-dias-casa",
          title: "Los primeros 30 d\xEDas: gu\xEDa de adaptaci\xF3n para tu nueva mascota",
          excerpt: "Paso a paso para que la transici\xF3n de tu nueva mascota a su nuevo hogar sea exitosa y sin estr\xE9s.",
          image: "/images/articles/first-30-days.jpg",
          date: "2023-09-22",
          author: {
            name: "Mar\xEDa G\xF3mez",
            avatar: "/images/authors/maria-gomez.jpg"
          },
          readingTime: 10,
          categories: ["Nuevos Due\xF1os", "Adaptaci\xF3n"]
        },
        {
          id: "rutinas-basicas-mascota",
          title: "Establecer rutinas b\xE1sicas: alimentaci\xF3n, paseos y descanso",
          excerpt: "C\xF3mo crear horarios y rutinas que beneficien tanto a tu mascota como a tu vida familiar.",
          image: "/images/articles/basic-pet-routines.jpg",
          date: "2023-09-10",
          author: {
            name: "Carlos Ruiz",
            avatar: "/images/authors/carlos-ruiz.jpg"
          },
          readingTime: 6,
          categories: ["Nuevos Due\xF1os", "Rutinas"]
        }
      ]
    },
    {
      slug: "productos-esenciales",
      title: "Productos Esenciales",
      description: "Qu\xE9 comprar y qu\xE9 evitar para tu nueva mascota.",
      articles: [
        {
          id: "productos-imprescindibles-perro",
          title: "Los 15 productos imprescindibles para tu nuevo perro",
          excerpt: "Lista completa de todo lo que realmente necesitas comprar para tu perro, sin gastos innecesarios.",
          image: "/images/articles/dog-essentials.jpg",
          date: "2023-09-20",
          author: {
            name: "Laura Mart\xEDn",
            avatar: "/images/authors/laura-martin.jpg"
          },
          readingTime: 8,
          categories: ["Nuevos Due\xF1os", "Productos"]
        }
      ]
    },
    {
      slug: "presupuesto-costos",
      title: "Presupuesto y Costos",
      description: "Planifica tu presupuesto para el cuidado de tu mascota.",
      articles: [
        {
          id: "costos-mascota-primer-ano",
          title: "Presupuesto real: cu\xE1nto cuesta una mascota el primer a\xF1o",
          excerpt: "Desglose detallado de todos los gastos iniciales y recurrentes para que planifiques tu presupuesto correctamente.",
          image: "/images/articles/pet-costs-first-year.jpg",
          date: "2023-09-18",
          author: {
            name: "Laura Mart\xEDn",
            avatar: "/images/authors/laura-martin.jpg"
          },
          readingTime: 9,
          categories: ["Nuevos Due\xF1os", "Presupuesto"]
        }
      ]
    }
  ];
  return subcategories.map((subcategory) => ({
    params: { slug: subcategory.slug },
    props: { subcategory }
  }));
}
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { subcategory } = Astro2.props;
  const featuredArticle = subcategory.articles[0];
  const popularTags = [
    "Primera Mascota",
    "Checklist",
    "Cachorros",
    "Adopci\xF3n",
    "Presupuesto",
    "Preparativos",
    "Rutinas",
    "Productos Esenciales"
  ];
  return renderTemplate`${renderComponent($$result, "CategoryLayout", $$CategoryLayout, { "title": subcategory.title, "description": subcategory.description, "image": "/images/categories/new-owners-banner.jpg", "category": "nuevos-duenos", "subcategories": [], "articles": subcategory.articles, "popularTags": popularTags, "featuredArticle": featuredArticle })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/nuevos-duenos/[slug].astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/nuevos-duenos/[slug].astro";
const $$url = "/nuevos-duenos/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
