export { renderers } from '../../renderers.mjs';

async function POST() {
  return new Response(JSON.stringify({ message: 'API funcionando' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
