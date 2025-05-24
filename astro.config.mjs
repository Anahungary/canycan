// astro.config.mjs - Configuración optimizada con @tailwindcss/vite
// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // 🌐 URL del sitio para SEO y generación de sitemap
  site: 'https://patadigital.netlify.app', // 🔄 Cambiar por tu URL real
  
  // 📦 Output estático para Netlify
  output: 'static',
  
  // 🔧 Integraciones
  integrations: [
    react({
      // Configuración opcional para React
      experimentalReactChildren: true,
    })
  ],
  
  // ⚡ Configuración de Vite optimizada
  vite: {
    plugins: [
      tailwindcss() // ✅ Tu configuración actual de Tailwind
    ],
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    build: {
      // Optimizaciones para producción
      cssCodeSplit: true,
      minify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'utils': ['marked'] // Si usas marked para markdown
          }
        }
      }
    },
    // Optimizaciones CSS
    css: {
      devSourcemap: true
    }
  },
  
  // 📝 Configuración de markdown
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  }
});