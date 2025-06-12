/* empty css                                 */
import { c as createComponent, e as renderScript, g as renderHead, d as addAttribute, a as renderTemplate } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const autores = [
    {
      name: "Ana Mar\xEDa Prieto",
      slug: "ana-maria-prieto",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shortBio: "Mam\xE1 de R\xEDo, amante incondicional de los perros y administradora",
      role: "Administradora",
      personalStory: "Como mam\xE1 de R\xEDo, he vivido cada etapa del amor incondicional que solo un perro puede dar. Mi experiencia cuidando peluditos me inspir\xF3 a escribir un libro y compartir todo lo que he aprendido en este hermoso camino.",
      specialties: ["Cuidado Canino", "Experiencias Reales", "Amor por las Mascotas", "Administraci\xF3n"],
      articlesCount: 15,
      featured: true,
      funFact: "R\xEDo me ense\xF1\xF3 m\xE1s sobre paciencia y amor que cualquier libro \u{1F415}\u{1F499}",
      favoriteTopic: "Las historias reales de conexi\xF3n entre humanos y perros"
    },
    {
      name: "Manuel Alejandro Bedoya",
      slug: "manuel-alejandro-bedoya",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shortBio: "Pap\xE1 de R\xEDo, t\xEDo y amigo de muchos peluditos, se esmera en amaestrar a su perro",
      role: "Administrador",
      personalStory: "He sido pap\xE1, t\xEDo y amigo de muchos peluditos a lo largo de mi vida. Cada uno me ha ense\xF1ado algo diferente, pero todos me han llenado de alegr\xEDa. Me gusta entrenar y me esmero en amaestrar a R\xEDo, aprendiendo junto a \xE9l cada d\xEDa.",
      specialties: ["Entrenamiento Amateur", "Experiencias con Mascotas", "Aprendizaje Constante", "Administraci\xF3n"],
      articlesCount: 12,
      featured: true,
      funFact: "Creo que los perros entrenan m\xE1s a los humanos que nosotros a ellos \u{1F604}",
      favoriteTopic: "Experiencias reales de un pap\xE1 perruno aprendiendo a entrenar"
    },
    {
      name: "Equipo Editorial Balto",
      slug: "equipo-editorial-balto",
      avatar: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      shortBio: "El coraz\xF3n de Balto: investigamos, verificamos y compartimos amor por las mascotas",
      role: "Equipo Editorial",
      personalStory: "Somos un grupo de amantes de las mascotas que trabajamos d\xEDa a d\xEDa para crear contenido \xFAtil, verificado y lleno de amor. Cada art\xEDculo que publicamos viene del coraz\xF3n y de nuestra experiencia real con nuestros peluditos.",
      specialties: ["Investigaci\xF3n", "Verificaci\xF3n de Contenido", "Tendencias en Mascotas", "Comunicaci\xF3n"],
      articlesCount: 25,
      featured: false,
      funFact: "En nuestras reuniones virtuales siempre aparece alg\xFAn peludito en c\xE1mara \u{1F436}\u{1F431}",
      favoriteTopic: "Conectar a las familias con informaci\xF3n confiable sobre sus mascotas"
    }
  ];
  return renderTemplate`<html lang="es" data-astro-cid-azfyafmr> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nuestro Equipo - Balto</title><meta name="description" content="Conoce al equipo humano detrás de Balto: Ana María, Manuel y nuestro equipo editorial">${renderScript($$result, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/autores/index.astro?astro&type=script&index=0&lang.ts")}${renderHead()}</head> <body class="bg-[#FAFAFA]" data-astro-cid-azfyafmr> <div class="container mx-auto px-4 py-8" data-astro-cid-azfyafmr> <header class="text-center mb-12" data-astro-cid-azfyafmr> <h1 class="text-4xl font-bold text-[#2E2E2E] mb-4" data-astro-cid-azfyafmr>Nuestro Equipo</h1> <p class="text-xl text-gray-600 max-w-2xl mx-auto" data-astro-cid-azfyafmr>
Las personas reales detrás de Balto: amantes de las mascotas que comparten sus experiencias desde el corazón
</p> </header> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" data-astro-cid-azfyafmr> ${autores.map((autor) => renderTemplate`<div class="author-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300" data-astro-cid-azfyafmr> <div class="p-8 text-center" data-astro-cid-azfyafmr> <img${addAttribute(autor.avatar, "src")}${addAttribute(autor.name, "alt")} class="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-[#AFC2D5]" data-astro-cid-azfyafmr> <h2 class="text-2xl font-bold text-[#2E2E2E] mb-2" data-astro-cid-azfyafmr>${autor.name}</h2> <p class="text-[#AFC2D5] font-semibold mb-3" data-astro-cid-azfyafmr>${autor.role}</p> <p class="text-gray-600 text-sm mb-6 leading-relaxed" data-astro-cid-azfyafmr>${autor.shortBio}</p>  <div class="bg-[#F4E2D8] rounded-lg p-4 mb-6 text-left" data-astro-cid-azfyafmr> <h3 class="text-sm font-bold text-[#2E2E2E] mb-2" data-astro-cid-azfyafmr>💭 Su historia:</h3> <p class="text-sm text-gray-700 leading-relaxed" data-astro-cid-azfyafmr>${autor.personalStory}</p> </div>  <div class="mb-6" data-astro-cid-azfyafmr> <h3 class="text-sm font-semibold text-[#2E2E2E] mb-3" data-astro-cid-azfyafmr>Lo que más le gusta:</h3> <div class="flex flex-wrap gap-2 justify-center" data-astro-cid-azfyafmr> ${autor.specialties.map((specialty) => renderTemplate`<span class="bg-[#C8D6B9] bg-opacity-50 text-[#2E2E2E] text-xs px-3 py-1 rounded-full" data-astro-cid-azfyafmr> ${specialty} </span>`)} </div> </div>  <div class="bg-yellow-50 rounded-lg p-3 mb-4" data-astro-cid-azfyafmr> <p class="text-sm text-gray-700 italic" data-astro-cid-azfyafmr>"${autor.funFact}"</p> </div> <div class="flex items-center justify-between text-sm text-gray-500 mb-6" data-astro-cid-azfyafmr> <span data-astro-cid-azfyafmr>${autor.articlesCount} artículos</span> ${autor.featured && renderTemplate`<span class="text-yellow-600 font-medium" data-astro-cid-azfyafmr>⭐ Fundador</span>`} </div> <div class="space-y-3" data-astro-cid-azfyafmr> <p class="text-xs text-gray-600 font-medium" data-astro-cid-azfyafmr>Escribe sobre:</p> <p class="text-sm text-[#2E2E2E] italic" data-astro-cid-azfyafmr>"${autor.favoriteTopic}"</p> <a${addAttribute(`/autores/${autor.slug}/`, "href")} class="inline-flex items-center px-6 py-3 bg-[#AFC2D5] text-white font-medium rounded-lg hover:bg-[#9DB3C6] transition-colors text-sm w-full justify-center" data-astro-cid-azfyafmr>
Ver sus artículos →
</a> </div> </div> </div>`)} </div>  <div class="text-center mt-16" data-astro-cid-azfyafmr> <div class="bg-gradient-to-r from-[#AFC2D5] to-[#C8D6B9] rounded-2xl p-8 shadow-lg max-w-4xl mx-auto" data-astro-cid-azfyafmr> <h2 class="text-3xl font-bold text-white mb-4" data-astro-cid-azfyafmr>¿Tienes una historia que contar?</h2> <p class="text-white text-opacity-90 mb-6 text-lg max-w-2xl mx-auto" data-astro-cid-azfyafmr>
Si tienes experiencias reales con tus mascotas, historias que puedan ayudar a otros papás y mamás perrunes, 
          o simplemente quieres compartir el amor por los peluditos, ¡nos encantaría conocerte!
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center" data-astro-cid-azfyafmr> <a href="/contacto/" class="inline-flex items-center px-8 py-4 bg-white text-[#AFC2D5] font-bold rounded-lg hover:bg-gray-50 transition-colors" data-astro-cid-azfyafmr>
💌 Comparte tu historia
</a> <a href="/articulos/" class="inline-flex items-center px-8 py-4 bg-white bg-opacity-20 text-white font-medium rounded-lg hover:bg-opacity-30 transition-colors border border-white border-opacity-30" data-astro-cid-azfyafmr>
📚 Lee nuestros artículos
</a> </div> </div> </div> </div> </body></html>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/autores/index.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/autores/index.astro";
const $$url = "/autores";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
