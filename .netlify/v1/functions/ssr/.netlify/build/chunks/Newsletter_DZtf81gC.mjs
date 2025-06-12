import { b as createAstro, c as createComponent, a as renderTemplate, h as defineScriptVars, d as addAttribute, m as maybeRenderHead } from './astro/server_BYXCEbbA.mjs';
import 'kleur/colors';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://Balto.com");
const $$Newsletter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Newsletter;
  const {
    source = "general",
    title = "Suscr\xEDbete al newsletter",
    description = "Recibe consejos exclusivos, art\xEDculos y novedades sobre el cuidado de mascotas directamente en tu correo.",
    variant = "default"
  } = Astro2.props;
  const newsletterId = `newsletter-${Math.random().toString(36).substring(2, 15)}`;
  const variantConfig = {
    default: {
      title: title || "Suscr\xEDbete al newsletter",
      description
    },
    homepage: {
      title: title || "Mantente al d\xEDa con Balto",
      description: description || "Recibe las \xFAltimas noticias, gu\xEDas exclusivas y consejos de expertos directamente en tu inbox."
    },
    footer: {
      title: title || "Newsletter",
      description: description || "Consejos semanales para tu mascota"
    }
  };
  const config = variantConfig[variant];
  return renderTemplate(_a || (_a = __template(["<!-- VARIANT: DEFAULT (Gradiente verde para sidebars) -->", "<!-- VARIANT: HOMEPAGE (Dise\xF1o amarillo sutil) -->", "<!-- VARIANT: FOOTER (Dise\xF1o minimalista) -->", "<script>(function(){", `
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById(newsletterId);
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = form.querySelector('.button-text');
    const loadingText = form.querySelector('.loading-text');
    const messageContainer = form.querySelector('.message-container');
    const successMessage = form.querySelector('.success-message');
    const errorMessage = form.querySelector('.error-message');
    const errorText = form.querySelector('.error-text');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtener datos del formulario
      const formData = new FormData(form);
      const email = formData.get('email');

      if (!email) {
        showError('Por favor, ingresa tu email');
        return;
      }

      // Mostrar estado de carga
      setLoading(true);
      hideMessages();

      try {
        // Enviar a nuestra API que conecta con Airtable
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            source: source || 'general'
          })
        });

        const result = await response.json();

        if (result.success) {
          showSuccess(result.message);
          form.reset(); // Limpiar formulario
          
          // Opcional: Google Analytics event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_signup', {
              'custom_parameter': source
            });
          }
        } else {
          showError(result.message || 'Error al procesar la suscripci\xF3n');
        }

      } catch (error) {
        console.error('Error newsletter:', error);
        showError('Error de conexi\xF3n. Int\xE9ntalo de nuevo.');
      } finally {
        setLoading(false);
      }
    });

    function setLoading(isLoading) {
      if (submitButton) {
        submitButton.disabled = isLoading;
      }
      if (buttonText && loadingText) {
        if (isLoading) {
          buttonText.classList.add('hidden');
          loadingText.classList.remove('hidden');
        } else {
          buttonText.classList.remove('hidden');
          loadingText.classList.add('hidden');
        }
      }
    }

    function showSuccess(message) {
      if (messageContainer && successMessage) {
        messageContainer.classList.remove('hidden');
        successMessage.classList.remove('hidden');
        successMessage.textContent = message;
      }
    }

    function showError(message) {
      if (messageContainer && errorMessage && errorText) {
        messageContainer.classList.remove('hidden');
        errorMessage.classList.remove('hidden');
        errorText.textContent = message;
      }
    }

    function hideMessages() {
      if (messageContainer) {
        messageContainer.classList.add('hidden');
      }
      if (successMessage) {
        successMessage.classList.add('hidden');
      }
      if (errorMessage) {
        errorMessage.classList.add('hidden');
      }
    }
  });
})();<\/script>`])), variant === "default" && renderTemplate`${maybeRenderHead()}<div class="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-8 text-white overflow-hidden shadow-xl"><div class="absolute inset-0 opacity-20"><div class="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full blur-xl"></div><div class="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-300 rounded-full blur-lg"></div></div><div class="relative z-10"><div class="flex items-center gap-3 mb-4"><div class="w-20 backdrop-blur-sm rounded-full flex items-center justify-center"><img src="/images/perro2.svg" alt="Newsletter" class="w-30"></div><h3 class="text-xl font-bold">${config.title}</h3></div><p class="text-white/90 mb-6 leading-relaxed">${config.description}</p><form${addAttribute(newsletterId, "id")} class="newsletter-form space-y-4"${addAttribute(source, "data-source")}><div><input type="text" name="name" placeholder="Tu nombre" class="w-full px-5 py-4 text-gray-900 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all duration-300 placeholder-gray-500"></div><div><input type="email" name="email" placeholder="tu@email.com" class="w-full px-5 py-4 text-gray-900 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all duration-300 placeholder-gray-500" required></div><div class="flex items-start"><input type="checkbox"${addAttribute(`newsletter-terms-${newsletterId}`, "id")} name="accept-terms" required class="mt-1 h-4 w-4 rounded border-white/30 text-green-600 focus:ring-white bg-white/20"><label${addAttribute(`newsletter-terms-${newsletterId}`, "for")} class="ml-3 text-sm text-white/90 leading-relaxed">
Acepto recibir correos y la <a href="/privacidad" class="underline hover:text-yellow-300">política de privacidad</a></label></div><button type="submit" class="w-full bg-white text-green-600 hover:text-green-700 py-4 px-6 rounded-xl text-sm font-bold transition-all duration-300 hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"><span class="button-text">🚀 Suscribirme gratis</span><span class="loading-text hidden">Enviando...</span></button><div class="message-container mt-3 hidden"><div class="success-message hidden p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm">
✅ ¡Suscripción exitosa! Revisa tu email para confirmar.
</div><div class="error-message hidden p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
❌ <span class="error-text">Error al suscribirse. Inténtalo de nuevo.</span></div></div></form></div></div>`, variant === "homepage" && renderTemplate`<div class="bg-white rounded-2xl border border-yellow-200 p-8 shadow-sm"><div class="text-center mb-6"><h3 class="text-2xl font-bold text-gray-900 mb-2">${config.title}</h3><p class="text-gray-600">${config.description}</p></div><form${addAttribute(newsletterId, "id")} class="newsletter-form"${addAttribute(source, "data-source")}><div class="flex flex-col gap-4 mb-4"><div><input type="text" name="name" placeholder="Tu nombre (opcional)" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"></div><div class="flex flex-col sm:flex-row gap-4"><div class="flex-1"><input type="email" name="email" placeholder="tu@email.com" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200" required></div><button type="submit" class="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"><span class="button-text">Suscribirme</span><span class="loading-text hidden">Enviando...</span></button></div></div><div class="flex items-start justify-center"><input type="checkbox"${addAttribute(`newsletter-terms-${newsletterId}`, "id")} name="accept-terms" required class="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"><label${addAttribute(`newsletter-terms-${newsletterId}`, "for")} class="ml-3 text-sm text-gray-600">
Acepto recibir correos y la <a href="/privacidad" class="text-yellow-600 hover:text-yellow-700 underline">política de privacidad</a></label></div><div class="message-container mt-4 hidden"><div class="success-message hidden p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">
✅ ¡Suscripción exitosa! Revisa tu email para confirmar.
</div><div class="error-message hidden p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
❌ <span class="error-text">Error al suscribirse. Inténtalo de nuevo.</span></div></div></form></div>`, variant === "footer" && renderTemplate`<div class="bg-gray-50 rounded-lg p-6 border border-gray-200"><div class="mb-4"><h4 class="text-lg font-bold text-gray-900 mb-1">${config.title}</h4><p class="text-sm text-gray-600">${config.description}</p></div><form${addAttribute(newsletterId, "id")} class="newsletter-form"${addAttribute(source, "data-source")}><div class="space-y-3 mb-3"><input type="email" name="email" placeholder="Email" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400" required><button type="submit" class="w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-md transition-colors duration-200"><span class="button-text">Enviar</span><span class="loading-text hidden">...</span></button></div><div class="flex items-start"><input type="checkbox"${addAttribute(`newsletter-terms-${newsletterId}`, "id")} name="accept-terms" required class="mt-0.5 h-3 w-3 rounded border-gray-300 text-gray-600 focus:ring-gray-500"><label${addAttribute(`newsletter-terms-${newsletterId}`, "for")} class="ml-2 text-xs text-gray-500">
Acepto la <a href="/privacidad" class="text-gray-700 hover:text-gray-900 underline">política de privacidad</a></label></div><div class="message-container mt-3 hidden"><div class="success-message hidden p-2 bg-green-100 border border-green-300 text-green-800 rounded text-xs">
✅ ¡Suscripción exitosa!
</div><div class="error-message hidden p-2 bg-red-100 border border-red-300 text-red-800 rounded text-xs">
❌ <span class="error-text">Error al suscribirse.</span></div></div></form></div>`, defineScriptVars({ newsletterId, source }));
}, "/Users/manuel/Downloads/magazine/canycatmagazin/src/components/common/Newsletter.astro", void 0);

export { $$Newsletter as $ };
