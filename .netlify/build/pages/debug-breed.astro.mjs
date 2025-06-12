/* empty css                                 */
import { c as createComponent, g as renderHead, a as renderTemplate } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import 'clsx';
import { b as breedsData } from '../chunks/index_NJrSibqZ.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$DebugBreed = createComponent(($$result, $$props, $$slots) => {
  const afghanHound = breedsData.find((breed) => breed.id === "afghan-hound") || breedsData[0];
  return renderTemplate`<html data-astro-cid-qc3pqecm> <head><title>Debug Breed Data</title>${renderHead()}</head> <body data-astro-cid-qc3pqecm> <h1 data-astro-cid-qc3pqecm>Debug: Datos de la raza</h1> <h2 data-astro-cid-qc3pqecm>Estructura completa:</h2> <pre data-astro-cid-qc3pqecm>${JSON.stringify(afghanHound, null, 2)}</pre> <h2 data-astro-cid-qc3pqecm>Verificaciones específicas:</h2> <p data-astro-cid-qc3pqecm><strong data-astro-cid-qc3pqecm>breed.id:</strong> ${afghanHound?.id || "undefined"}</p> <p data-astro-cid-qc3pqecm><strong data-astro-cid-qc3pqecm>breed.name:</strong> ${afghanHound?.name || "undefined"}</p> <p data-astro-cid-qc3pqecm><strong data-astro-cid-qc3pqecm>breed.image:</strong> ${afghanHound?.image || "undefined"}</p> <p data-astro-cid-qc3pqecm><strong data-astro-cid-qc3pqecm>breed.images:</strong> ${afghanHound?.images ? JSON.stringify(afghanHound.images) : "undefined"}</p> <p data-astro-cid-qc3pqecm><strong data-astro-cid-qc3pqecm>breed.type:</strong> ${afghanHound?.type || "undefined"}</p> <h2 data-astro-cid-qc3pqecm>¿Cómo se pasa al layout?</h2> <p data-astro-cid-qc3pqecm>En tu página [slug].astro, probablemente tienes algo como:</p> <pre data-astro-cid-qc3pqecm>const breed = ${`{
  data: breedData
}`}</pre> <p data-astro-cid-qc3pqecm>Pero tal vez debería ser simplemente:</p> <pre data-astro-cid-qc3pqecm>const breed = breedData</pre> </body></html>`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/debug-breed.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/debug-breed.astro";
const $$url = "/debug-breed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DebugBreed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
