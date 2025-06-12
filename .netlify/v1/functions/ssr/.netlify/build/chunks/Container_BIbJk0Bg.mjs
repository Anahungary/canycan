import { b as createAstro, c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, r as renderComponent, e as renderScript, f as renderSlot, g as renderHead, s as spreadAttributes } from './astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro$2 = createAstro("https://Balto.com");
const $$Navigation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Navigation;
  const { isMobile = false } = Astro2.props;
  const navItems = [
    { name: "Encuentra la raza", href: "/razas" },
    { name: "Entrenamiento", href: "/entrenamiento" },
    { name: "Cuidado", href: "/cuidado" },
    { name: "Comportamiento", href: "/comportamiento" },
    { name: "Nuevos Due\xF1os", href: "/nuevos-duenos" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<nav> <ul${addAttribute(isMobile ? "space-y-2" : "flex space-x-4", "class")}> ${navItems.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")}${addAttribute(`px-3 py-2 rounded-md text-sm font-medium ${currentPath === item.href || currentPath.startsWith(item.href + "/") ? "bg-green-500 text-white" : "text-[#2E2E2E] hover:bg-[#facc14] hover:text-[#2E2E2E]"}`, "class")}${addAttribute(currentPath === item.href ? "page" : void 0, "aria-current")}> ${item.name} </a> </li>`)} </ul> </nav>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/Navigation.astro", void 0);

const $$SearchBar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative pb-5"> <form action="/buscar" method="get" class="flex items-center"> <div class="flex items-center rounded-md border border-gray-300 bg-white px-2  py-1"> <input type="text" name="q" placeholder="Buscar artículos, razas..." class="w-full border-0 focus:ring-0 text-sm text-[#2E2E2E] placeholder:text-gray-400 outline-none" required> <button type="submit" class="p-1 hover:text-gray-600"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400"> <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path> </svg> </button> </div> </form> </div>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/SearchBar.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="bg-white shadow-sm sticky top-0 z-50"> <div class="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2"> <div class="flex justify-between items-center py-2"> <div class="flex-shrink-0 flex items-center"> <a href="/" class="flex items-center"> <img src="/images/balto.svg" alt="Logo Un Amor Consciente" width="160" height="60" class="h-20 w-auto"> </a> </div> <!-- Nav para escritorio --> <div class="hidden md:block"> ${renderComponent($$result, "Navigation", $$Navigation, {})} </div> <!-- Búsqueda para escritorio --> <div class="hidden md:block"> ${renderComponent($$result, "SearchBar", $$SearchBar, {})} </div> <!-- Botón móvil --> <div class="flex items-center md:hidden"> <button id="mobile-menu-button" type="button" class="text-green-500 hover:text-green-600 focus:outline-none"> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> </div> <!-- Menú móvil --> <div id="mobile-menu" class="md:hidden hidden"> <div class="pt-2 pb-4 space-y-1"> ${renderComponent($$result, "SearchBar", $$SearchBar, {})} <div class="mt-3"> ${renderComponent($$result, "Navigation", $$Navigation, { "isMobile": true })} </div> </div> </div> </div> </header> ${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const categories = [
    { name: "Comparador de Razas", href: "/comparador-razas" },
    { name: "Entrenamiento", href: "/entrenamiento" },
    { name: "Cuidado y Bienestar", href: "/cuidado" },
    { name: "Comportamiento", href: "/comportamiento" },
    { name: "Nuevos Due\xF1os", href: "/nuevos-duenos" }
  ];
  const about = [
    { name: "Sobre Nosotros", href: "/sobre-nosotros" },
    { name: "Pol\xEDtica de Privacidad", href: "/privacidad" },
    { name: "T\xE9rminos y Condiciones", href: "/terminos" },
    { name: "Contacto", href: "/contacto" }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gradient-to-br from-green-700 to-green-500 border-t border-green-700"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"> <!-- Columna 1: Logo y descripción (más ancha) --> <div class="md:col-span-1"> <div class="flex items-center mb-4"> <a href="/" class="flex items-center"> <img src="/images/baltoblanco2.svg" alt="Logo Un Amor Consciente" width="160" height="60" class="h-24 w-auto"> </a> </div> <p class="text-sm text-white leading-relaxed mb-6">
La revista digital que te ayuda a elegir, educar y cuidar a tus mascotas con información de calidad y confiable.
</p> <div class="flex space-x-4"> <a href="#" class="text-white hover:text-yellow-300 transition-colors duration-200"> <span class="sr-only">Facebook</span> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path> </svg> </a> <a href="#" class="text-white hover:text-yellow-300 transition-colors duration-200"> <span class="sr-only">Instagram</span> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path> </svg> </a> <a href="#" class="text-white hover:text-yellow-300 transition-colors duration-200"> <span class="sr-only">Twitter</span> <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path> </svg> </a> </div> </div> <!-- Columna 2: Categorías --> <div> <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Categorías</h3> <ul class="space-y-3"> ${categories.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-sm text-white/80 hover:text-yellow-300 transition-colors duration-200"> ${item.name} </a> </li>`)} </ul> </div> <!-- Columna 3: Acerca de --> <div> <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Acerca de</h3> <ul class="space-y-3"> ${about.map((item) => renderTemplate`<li> <a${addAttribute(item.href, "href")} class="text-sm text-white/80 hover:text-yellow-300 transition-colors duration-200"> ${item.name} </a> </li>`)} </ul> </div> </div> <!-- Copyright --> <div class="mt-12 border-t border-green-400/30 pt-8"> <p class="text-sm text-white/70 text-center">
&copy; ${currentYear} Balto. Todos los derechos reservados.
</p> </div> </div> </footer>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://Balto.com");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "La revista digital para amantes de mascotas: consejos, guías, comparativa de razas y más.",
    ogImage = "/og-image.jpg",
    canonicalUrl,
    bodyClass = "",
    // 🔧 VALORES OPTIMIZADOS PARA WHATSAPP
    ogImageWidth = 1200,
    ogImageHeight = 630,
    ogImageType = "image/jpeg"
  } = Astro2.props;
  const siteUrl = "https://Balto.com";
  const getValidImageUrl = (imageUrl) => {
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    const absoluteUrl = `${siteUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    if (imageUrl.includes("/images/breeds/") || imageUrl.includes("/images/articles/")) {
      return imageUrl === "/og-image.jpg" ? `${siteUrl}/og-default.jpg` : absoluteUrl;
    }
    return absoluteUrl;
  };
  const finalOgImage = getValidImageUrl(ogImage);
  const canonical = canonicalUrl ? canonicalUrl.startsWith("http") ? canonicalUrl : `${siteUrl}${canonicalUrl}` : `${siteUrl}${Astro2.url.pathname}`;
  const optimizedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const optimizedDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', ' | Balto</title><meta name="description"', '><link rel="canonical"', '><!-- ✅ Netlify Identity Widget --><script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script><!-- Favicons --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><!-- 🔧 OPEN GRAPH OPTIMIZADO PARA WHATSAPP --><meta property="og:type" content="website"><meta property="og:site_name" content="Balto"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- 🚀 META TAGS ESPECÍFICOS PARA WHATSAPP --><meta property="og:image:width"', '><meta property="og:image:height"', '><meta property="og:image:type"', '><meta property="og:image:alt"', '><!-- 🔧 TWITTER CARDS OPTIMIZADAS --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:site" content="@Balto"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><meta property="twitter:image:alt"', '><!-- 🔧 META TAGS ADICIONALES PARA WHATSAPP --><meta property="article:publisher"', '><meta property="og:locale" content="es_ES"><!-- 🔧 PRECARGAR IMAGEN PRINCIPAL PARA MEJOR PERFORMANCE --><link rel="preload" as="image"', '><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><!-- 🔧 JSON-LD PARA MEJOR SEO --><script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "WebSite",\n      "name": "Balto",\n      "description": "La revista digital para amantes de mascotas",\n      "url": "{siteUrl}",\n      "publisher": {\n        "@type": "Organization",\n        "name": "Balto",\n        "url": "{siteUrl}"\n      }\n    }\n    </script>', "", "</head> <body", "> ", ' <main class="flex-grow"> ', " </main> ", ` <!-- ✅ Netlify Identity Script --> <script>
      (function() {
        'use strict';

        function waitForNetlifyIdentity() {
          return new Promise((resolve) => {
            if (window.netlifyIdentity) {
              resolve(window.netlifyIdentity);
            } else {
              const checkIdentity = setInterval(() => {
                if (window.netlifyIdentity) {
                  clearInterval(checkIdentity);
                  resolve(window.netlifyIdentity);
                }
              }, 100);
            }
          });
        }

        document.addEventListener('DOMContentLoaded', async function() {
          const identity = await waitForNetlifyIdentity();
          
          identity.on('init', user => {
            console.log('✅ Netlify Identity inicializado', user ? 'con usuario' : 'sin usuario');
          });
          
          identity.on('login', user => {
            console.log('✅ Usuario logueado:', user?.email);
            document.location.href = '/admin/';
          });
        });
      })();
    </script> <!-- 🔧 DEBUG PARA VERIFICAR META TAGS --> <script>
      if (typeof window !== 'undefined' && window.location.search.includes('debug=meta')) {
        console.log('🔍 META TAGS DEBUG:');
        console.log('og:image:', document.querySelector('meta[property="og:image"]')?.getAttribute('content'));
        console.log('og:title:', document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
        console.log('og:description:', document.querySelector('meta[property="og:description"]')?.getAttribute('content'));
        console.log('Site URL:', '{siteUrl}');
      }
    </script> </body> </html>`])), optimizedTitle, addAttribute(optimizedDescription, "content"), addAttribute(canonical, "href"), addAttribute(canonical, "content"), addAttribute(optimizedTitle, "content"), addAttribute(optimizedDescription, "content"), addAttribute(finalOgImage, "content"), addAttribute(ogImageWidth.toString(), "content"), addAttribute(ogImageHeight.toString(), "content"), addAttribute(ogImageType, "content"), addAttribute(`${optimizedTitle} - Balto`, "content"), addAttribute(canonical, "content"), addAttribute(optimizedTitle, "content"), addAttribute(optimizedDescription, "content"), addAttribute(finalOgImage, "content"), addAttribute(`${optimizedTitle} - Balto`, "content"), addAttribute(siteUrl, "content"), addAttribute(finalOgImage, "href"), renderSlot($$result, $$slots["head"]), renderHead(), addAttribute(`min-h-screen flex flex-col bg-[#FAFAFA] font-inter text-[#2E2E2E] ${bodyClass}`, "class"), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/layouts/BaseLayout.astro", void 0);

const $$Astro = createAstro("https://Balto.com");
const $$Container = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Container;
  const {
    size = "lg",
    padded = true,
    centered = true,
    fluid = false,
    class: className = "",
    ...rest
  } = Astro2.props;
  const sizeClasses = {
    sm: "max-w-3xl",
    // ~768px
    md: "max-w-5xl",
    // ~1024px
    lg: "max-w-7xl",
    // ~1280px
    xl: "max-w-screen-2xl",
    // ~1536px
    full: "max-w-full"
  };
  const fluidSizeClasses = {
    sm: "max-w-4xl",
    // ~896px (más amplio que el estándar)
    md: "max-w-6xl",
    // ~1152px (más amplio que el estándar)
    lg: "max-w-[1440px]",
    // 1440px (más amplio que el máximo de Tailwind)
    xl: "max-w-[1920px]",
    // 1920px (mucho más amplio)
    full: "max-w-full"
  };
  const finalSizeClasses = fluid ? fluidSizeClasses : sizeClasses;
  const classes = [
    finalSizeClasses[size],
    padded ? "px-4 sm:px-6 md:px-8 lg:px-10" : "",
    // Padding progresivo según tamaño de pantalla
    centered ? "mx-auto" : "",
    className
  ].join(" ");
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(classes, "class")}${spreadAttributes(rest)} data-astro-cid-5hfkzgy4> ${renderSlot($$result, $$slots["default"])} </div> `;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/ui/Container.astro", void 0);

export { $$BaseLayout as $, $$Container as a };
