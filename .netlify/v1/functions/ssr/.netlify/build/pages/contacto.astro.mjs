/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate, e as renderScript, m as maybeRenderHead } from '../chunks/astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Container } from '../chunks/Container_BIbJk0Bg.mjs';
export { renderers } from '../renderers.mjs';

const $$Contacto = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Contacto - Balto", "description": "Ponte en contacto con el equipo de la revista Balto. Responderemos todas tus preguntas sobre mascotas." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, { "class": "py-12" }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto"> <!-- Header --> <div class="text-center mb-12"> <h1 class="text-4xl font-bold mb-6 text-gray-900">Contáctanos</h1> <p class="text-xl text-gray-600 max-w-2xl mx-auto">
¿Tienes preguntas, sugerencias o quieres colaborar con nosotros? 
          Nos encanta escuchar de nuestra comunidad de amantes de mascotas.
</p> </div> <div class="grid lg:grid-cols-2 gap-12"> <!-- Formulario de Contacto --> <div class="bg-white rounded-xl shadow-lg p-8"> <h2 class="text-2xl font-bold mb-6 text-gray-900">Envíanos un mensaje</h2> <form id="contact-form" class="space-y-6"> <div class="grid md:grid-cols-2 gap-4"> <div> <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
Nombre *
</label> <input type="text" id="firstName" name="firstName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Tu nombre"> </div> <div> <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
Apellido *
</label> <input type="text" id="lastName" name="lastName" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="Tu apellido"> </div> </div> <div> <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
Correo electrónico *
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="tu@email.com"> </div> <div> <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
Asunto *
</label> <select id="subject" name="subject" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"> <option value="">Selecciona un tema</option> <option value="pregunta-general">Pregunta general sobre mascotas</option> <option value="sugerencia-articulo">Sugerencia de artículo</option> <option value="colaboracion">Propuesta de colaboración</option> <option value="error-sitio">Reportar error en el sitio</option> <option value="publicidad">Consulta publicitaria</option> <option value="otro">Otro</option> </select> </div> <div> <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
Mensaje *
</label> <textarea id="message" name="message" rows="6" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical" placeholder="Cuéntanos en qué te podemos ayudar..."></textarea> </div> <div class="flex items-start"> <input type="checkbox" id="newsletter" name="newsletter" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"> <label for="newsletter" class="ml-3 text-sm text-gray-600">
Quiero recibir el newsletter de Balto con consejos y novedades sobre mascotas
</label> </div> <button type="submit" class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"> <span class="button-text">Enviar mensaje</span> <span class="loading-text hidden">Enviando...</span> </button> </form> <!-- Mensajes de respuesta --> <div id="form-messages" class="mt-4 hidden"> <div id="success-message" class="hidden p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.
</div> <div id="error-message" class="hidden p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
❌ Error al enviar el mensaje. Inténtalo de nuevo o escríbenos directamente a contacto@baltosabe.com
</div> </div> </div> <!-- Información de Contacto --> <div class="space-y-8"> <!-- Información Principal --> <div class="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6"> <h3 class="text-xl font-bold mb-4 text-gray-900">Información de Contacto</h3> <div class="space-y-4"> <div class="flex items-start space-x-3"> <div class="bg-blue-500 rounded-full p-2 mt-1"> <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"> <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path> <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path> </svg> </div> <div> <h4 class="font-semibold text-gray-900">Email General</h4> <a href="mailto:contacto@baltosabe.com" class="text-blue-600 hover:underline">
contacto@baltosabe.com
</a> </div> </div> <div class="flex items-start space-x-3"> <div class="bg-green-500 rounded-full p-2 mt-1"> <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path> </svg> </div> <div> <h4 class="font-semibold text-gray-900">Ubicación</h4> <p class="text-gray-600">Bogotá, Colombia</p> </div> </div> <div class="flex items-start space-x-3"> <div class="bg-purple-500 rounded-full p-2 mt-1"> <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path> </svg> </div> <div> <h4 class="font-semibold text-gray-900">Tiempo de Respuesta</h4> <p class="text-gray-600">24-48 horas laborales</p> </div> </div> </div> </div> <!-- Contactos Específicos --> <div class="bg-white rounded-xl shadow-lg p-6"> <h3 class="text-xl font-bold mb-4 text-gray-900">Contactos Específicos</h3> <div class="space-y-4 text-sm"> <div> <h4 class="font-semibold text-gray-800 mb-1">📝 Colaboraciones y Guest Posts</h4> <a href="mailto:colaboraciones@baltosabe.com" class="text-blue-600 hover:underline">
colaboraciones@baltosabe.com
</a> </div> <div> <h4 class="font-semibold text-gray-800 mb-1">📢 Publicidad y Partnerships</h4> <a href="mailto:publicidad@baltosabe.com" class="text-blue-600 hover:underline">
publicidad@baltosabe.com
</a> </div> <div> <h4 class="font-semibold text-gray-800 mb-1">🔒 Privacidad y Datos</h4> <a href="mailto:privacidad@baltosabe.com" class="text-blue-600 hover:underline">
privacidad@baltosabe.com
</a> </div> <div> <h4 class="font-semibold text-gray-800 mb-1">⚖️ Legal y Términos</h4> <a href="mailto:legal@baltosabe.com" class="text-blue-600 hover:underline">
legal@baltosabe.com
</a> </div> </div> </div> <!-- FAQ Rápido --> <div class="bg-yellow-50 rounded-xl p-6"> <h3 class="text-xl font-bold mb-4 text-gray-900">Preguntas Frecuentes</h3> <div class="space-y-3 text-sm"> <div> <h4 class="font-semibold text-gray-800">¿Responden consultas veterinarias?</h4> <p class="text-gray-600">No damos diagnósticos médicos. Siempre consulta con un veterinario.</p> </div> <div> <h4 class="font-semibold text-gray-800">¿Puedo proponer un tema de artículo?</h4> <p class="text-gray-600">¡Por supuesto! Usa el formulario seleccionando "Sugerencia de artículo".</p> </div> <div> <h4 class="font-semibold text-gray-800">¿Hacen colaboraciones?</h4> <p class="text-gray-600">Sí, escribimos sobre marcas y productos que aporten valor a nuestros lectores.</p> </div> </div> </div> </div> </div> </div> ` })}  ${renderScript($$result2, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/contacto.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/contacto.astro", void 0);

const $$file = "/Users/manuel/Downloads/magazine/canycatmagazin/src/pages/contacto.astro";
const $$url = "/contacto";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contacto,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
