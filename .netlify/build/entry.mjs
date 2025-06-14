import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BcdYSRr0.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin-sync.astro.mjs');
const _page2 = () => import('./pages/alimentacion.astro.mjs');
const _page3 = () => import('./pages/articulos/admin-sync.astro.mjs');
const _page4 = () => import('./pages/articulos/page/_page_.astro.mjs');
const _page5 = () => import('./pages/articulos/_slug_.astro.mjs');
const _page6 = () => import('./pages/articulos.astro.mjs');
const _page7 = () => import('./pages/autores.astro.mjs');
const _page8 = () => import('./pages/buscar.astro.mjs');
const _page9 = () => import('./pages/cachorros.astro.mjs');
const _page10 = () => import('./pages/categorias/_id_.astro.mjs');
const _page11 = () => import('./pages/categorias.astro.mjs');
const _page12 = () => import('./pages/comportamiento.astro.mjs');
const _page13 = () => import('./pages/contacto.astro.mjs');
const _page14 = () => import('./pages/cuidado.astro.mjs');
const _page15 = () => import('./pages/debug-breed.astro.mjs');
const _page16 = () => import('./pages/entrenamiento.astro.mjs');
const _page17 = () => import('./pages/etiquetas/_slug_.astro.mjs');
const _page18 = () => import('./pages/etiquetas.astro.mjs');
const _page19 = () => import('./pages/nuevos-duenos/_slug_.astro.mjs');
const _page20 = () => import('./pages/nuevos-duenos.astro.mjs');
const _page21 = () => import('./pages/privacidad.astro.mjs');
const _page22 = () => import('./pages/razas/_slug_.astro.mjs');
const _page23 = () => import('./pages/razas.astro.mjs');
const _page24 = () => import('./pages/salud.astro.mjs');
const _page25 = () => import('./pages/sobre-nosotros.astro.mjs');
const _page26 = () => import('./pages/tag/_tag_.astro.mjs');
const _page27 = () => import('./pages/terminos.astro.mjs');
const _page28 = () => import('./pages/test-simple.astro.mjs');
const _page29 = () => import('./pages/tu-raza-ideal.astro.mjs');
const _page30 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin-sync.html", _page1],
    ["src/pages/alimentacion/index.astro", _page2],
    ["src/pages/articulos/admin-sync.astro", _page3],
    ["src/pages/articulos/page/[page].astro", _page4],
    ["src/pages/articulos/[slug].astro", _page5],
    ["src/pages/articulos/index.astro", _page6],
    ["src/pages/autores/index.astro", _page7],
    ["src/pages/buscar.astro", _page8],
    ["src/pages/cachorros/index.astro", _page9],
    ["src/pages/categorias/[id].astro", _page10],
    ["src/pages/categorias/index.astro", _page11],
    ["src/pages/comportamiento/index.astro", _page12],
    ["src/pages/contacto.astro", _page13],
    ["src/pages/cuidado/index.astro", _page14],
    ["src/pages/debug-breed.astro", _page15],
    ["src/pages/entrenamiento/index.astro", _page16],
    ["src/pages/etiquetas/[slug].astro", _page17],
    ["src/pages/etiquetas/index.astro", _page18],
    ["src/pages/nuevos-duenos/[slug].astro", _page19],
    ["src/pages/nuevos-duenos/index.astro", _page20],
    ["src/pages/privacidad.astro", _page21],
    ["src/pages/razas/[slug].astro", _page22],
    ["src/pages/razas/index.astro", _page23],
    ["src/pages/salud/index.astro", _page24],
    ["src/pages/sobre-nosotros.astro", _page25],
    ["src/pages/tag/[tag].astro", _page26],
    ["src/pages/terminos.astro", _page27],
    ["src/pages/test-simple.js", _page28],
    ["src/pages/tu-raza-ideal.astro", _page29],
    ["src/pages/index.astro", _page30]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "888344f9-b7a8-4331-b627-a2b44cc7e7db"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
