import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, s as spreadAttributes, f as renderSlot, a as renderTemplate, r as renderComponent } from './astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import '@astrojs/internal-helpers/path';
import '@astrojs/internal-helpers/remote';
import { $ as $$Image } from './_astro_assets_Cc6zF1xQ.mjs';
import 'clsx';
import { $ as $$Button } from './Button_DiQu0Jvt.mjs';
/* empty css                         */

const $$Astro$3 = createAstro("https://Balto.com");
const $$Badge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Badge;
  const {
    variant = "default",
    size = "sm",
    class: className = "",
    ...rest
  } = Astro2.props;
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-[#AFC2D5] bg-opacity-20 text-[#AFC2D5]",
    secondary: "bg-[#F6B89E] bg-opacity-20 text-[#F6B89E]",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-[#C8D6B9] bg-opacity-30 text-[#5A7251]"
  };
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-sm px-2.5 py-1 rounded-md"
  };
  const classes = [
    "inline-flex items-center font-medium",
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(" ");
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(classes, "class")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["default"])} </span>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/ui/Badge.astro", void 0);

const $$Astro$2 = createAstro("https://Balto.com");
const $$ArticleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ArticleCard;
  const {
    id,
    title,
    excerpt,
    image,
    author,
    date,
    readingTime,
    categories = [],
    category,
    featured = false,
    variant = "default"
  } = Astro2.props;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };
  const truncate = (text, length) => {
    if (!text || text.length <= length) return text || "";
    return text.slice(0, length) + "...";
  };
  const allCategories = category ? [category, ...categories] : categories;
  const safeTitle = title || "Art\xEDculo sobre cuidado de mascotas";
  const safeAltText = `${safeTitle} - Art\xEDculo de Balto`;
  let cardClasses = "group relative transition-all duration-300 ";
  let imageContainerClasses = "relative overflow-hidden ";
  let contentClasses = "";
  let titleClasses = "font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200 ";
  if (variant === "default") {
    cardClasses += featured ? "border-2 border-green-500 rounded-lg shadow-sm hover:shadow-md" : "border border-gray-200 rounded-lg shadow-sm hover:shadow-md";
    imageContainerClasses += "h-48 rounded-t-lg";
    contentClasses = "p-5";
    titleClasses += "text-xl mb-2";
  } else if (variant === "compact") {
    cardClasses += "border border-gray-200 rounded-lg shadow-sm hover:shadow-md";
    imageContainerClasses += "h-36 rounded-t-lg";
    contentClasses = "p-4";
    titleClasses += "text-base mb-1";
  } else if (variant === "overlay") {
    cardClasses += "rounded-lg overflow-hidden";
    imageContainerClasses += featured ? "h-96" : "h-64";
    contentClasses = "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-5 text-white";
    titleClasses = "font-bold text-white group-hover:text-green-300 transition-colors duration-200 " + (featured ? "text-2xl" : "text-xl") + " mb-2";
  } else if (variant === "horizontal") {
    cardClasses += "flex border border-gray-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden";
    imageContainerClasses += "h-full w-1/3 flex-shrink-0";
    contentClasses = "p-4 flex-1";
    titleClasses += "text-lg mb-2";
  }
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(cardClasses, "class")} data-astro-cid-3jwsqc2o> ${featured && variant !== "overlay" && renderTemplate`<div class="absolute top-3 right-3 z-10" data-astro-cid-3jwsqc2o> ${renderComponent($$result, "Badge", $$Badge, { "variant": "primary", "data-astro-cid-3jwsqc2o": true }, { "default": ($$result2) => renderTemplate`Destacado` })} </div>`} <div${addAttribute(imageContainerClasses, "class")} data-astro-cid-3jwsqc2o> ${renderComponent($$result, "Image", $$Image, { "src": image || "/images/articles/default.jpg", "alt": safeAltText, "width": 800, "height": 450, "class": "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", "data-astro-cid-3jwsqc2o": true })} ${variant === "overlay" && featured && renderTemplate`<div class="absolute top-3 right-3 z-10" data-astro-cid-3jwsqc2o> ${renderComponent($$result, "Badge", $$Badge, { "variant": "primary", "data-astro-cid-3jwsqc2o": true }, { "default": ($$result2) => renderTemplate`Destacado` })} </div>`} </div> <div${addAttribute(contentClasses, "class")} data-astro-cid-3jwsqc2o>  ${allCategories.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-3" data-astro-cid-3jwsqc2o> ${allCategories.slice(0, 4).map((cat, index) => renderTemplate`<span${addAttribute(`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 ${index === 0 ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" : "bg-green-100 text-green-800 border border-green-200"} ${variant === "overlay" ? "shadow-lg" : ""}`, "class")} data-astro-cid-3jwsqc2o> ${cat} </span>`)}  ${allCategories.length > 4 && renderTemplate`<span${addAttribute(`inline-block px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-black shadow-md transition-all duration-200 hover:scale-105 ${variant === "overlay" ? "shadow-lg" : ""}`, "class")} data-astro-cid-3jwsqc2o>
+${allCategories.length - 4} </span>`} </div>`} <h3${addAttribute(titleClasses, "class")} data-astro-cid-3jwsqc2o> <a${addAttribute(`/articulos/${id}`, "href")} class="hover:text-green-600" data-astro-cid-3jwsqc2o> ${truncate(safeTitle, variant === "compact" ? 60 : 100)} </a> </h3> ${variant !== "compact" && renderTemplate`<p${addAttribute(`${variant === "overlay" ? "text-gray-200" : "text-gray-600"} mb-4 text-sm`, "class")} data-astro-cid-3jwsqc2o> ${truncate(excerpt || "Descubre m\xE1s sobre este interesante tema de cuidado de mascotas.", variant === "horizontal" ? 100 : 120)} </p>`} ${(author || date || readingTime) && variant !== "compact" && renderTemplate`<div class="flex items-center justify-between mt-4" data-astro-cid-3jwsqc2o> ${author && renderTemplate`<div class="flex items-center space-x-2" data-astro-cid-3jwsqc2o> ${author.avatar ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": author.avatar, "alt": `Avatar de ${author.name || "Autor"}`, "width": 32, "height": 32, "class": "w-8 h-8 rounded-full", "data-astro-cid-3jwsqc2o": true })}` : renderTemplate`<div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold" data-astro-cid-3jwsqc2o> ${(author.name || "A").charAt(0)} </div>`} <div data-astro-cid-3jwsqc2o> <span${addAttribute(`text-xs ${variant === "overlay" ? "text-gray-300" : "text-gray-600"}`, "class")} data-astro-cid-3jwsqc2o>Por </span> <span${addAttribute(`text-xs font-medium ${variant === "overlay" ? "text-white" : "text-gray-900"}`, "class")} data-astro-cid-3jwsqc2o>${author.name || "Autor"}</span> </div> </div>`} ${(date || readingTime) && renderTemplate`<div${addAttribute(`text-xs ${variant === "overlay" ? "text-gray-300" : "text-gray-500"}`, "class")} data-astro-cid-3jwsqc2o> ${date && renderTemplate`<span data-astro-cid-3jwsqc2o>${formatDate(date)}</span>`} ${date && readingTime && renderTemplate`<span class="mx-1" data-astro-cid-3jwsqc2o>·</span>`} ${readingTime && renderTemplate`<span data-astro-cid-3jwsqc2o>${readingTime} min lectura</span>`} </div>`} </div>`} ${variant === "overlay" && renderTemplate`<div class="mt-3" data-astro-cid-3jwsqc2o> ${renderComponent($$result, "Button", $$Button, { "href": `/articulos/${id}`, "variant": "primary", "size": "sm", "class": "bg-white text-gray-900 hover:bg-gray-100", "data-astro-cid-3jwsqc2o": true }, { "default": ($$result2) => renderTemplate`
Leer artículo
` })} </div>`} </div> </article> `;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/blog/ArticleCard.astro", void 0);

const $$Astro$1 = createAstro("https://Balto.com");
const $$ArticleList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ArticleList;
  const {
    articles,
    title,
    description,
    showFeatured = true,
    layout = "grid",
    columns = 3
  } = Astro2.props;
  const featuredArticles = showFeatured ? articles.filter((article) => article.featured) : [];
  const regularArticles = showFeatured ? articles.filter((article) => !article.featured) : articles;
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };
  return renderTemplate`${maybeRenderHead()}<div> ${title && renderTemplate`<div class="mb-6"> <h2 class="text-2xl font-bold text-[#]">${title}</h2> ${description && renderTemplate`<p class="text-gray-600 mt-1">${description}</p>`} </div>`}  ${layout === "featured" && featuredArticles.length > 0 && renderTemplate`<div class="space-y-8"> <div class="mb-8"> ${featuredArticles.slice(0, 1).map((article) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { ...article })}`)} </div> ${regularArticles.length > 0 && renderTemplate`<div${addAttribute(`grid gap-6 ${gridClasses[columns]}`, "class")}> ${regularArticles.map((article) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { ...article })}`)} </div>`} </div>`}  ${layout === "grid" && renderTemplate`<div${addAttribute(`grid gap-6 ${gridClasses[columns]}`, "class")}> ${articles.map((article) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { ...article })}`)} </div>`}  ${layout === "list" && renderTemplate`<div class="space-y-6"> ${articles.map((article) => renderTemplate`${renderComponent($$result, "ArticleCard", $$ArticleCard, { ...article })}`)} </div>`} ${articles.length === 0 && renderTemplate`<div class="text-center py-12 bg-gray-50 rounded-lg"> <h3 class="text-lg font-medium text-gray-900 mb-2">
No hay artículos disponibles
</h3> <p class="text-gray-600">
Vuelve pronto para ver nuevo contenido.
</p> </div>`} </div>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/blog/ArticleList.astro", void 0);

const $$Astro = createAstro("https://Balto.com");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    variant = "default",
    padding = "md",
    class: className = "",
    href,
    ...rest
  } = Astro2.props;
  const variantClasses = {
    default: "bg-white border border-gray-200",
    article: "bg-white border border-gray-200 hover:shadow-md",
    breed: "bg-[#f3f3f3] border border-[#f3f3f3]",
    highlight: "bg-[#C8D6B9] border border-[#C8D6B9]"
  };
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-6"
  };
  const classes = [
    "rounded-lg transition-all duration-200",
    variantClasses[variant],
    paddingClasses[padding],
    href ? "cursor-pointer" : "",
    className
  ].join(" ");
  const Tag = href ? "a" : "div";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class": classes, ...rest }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/ui/Card.astro", void 0);

export { $$Badge as $, $$ArticleList as a, $$Card as b };
