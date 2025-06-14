// astro.config.mjs - CONFIGURACIÓN QUE FUNCIONA
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

// Cargar variables de entorno manualmente
import { config } from 'dotenv';
config();

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  
  site: 'https://baltosabe.netlify.app/',
  
  output: 'server',
  adapter: netlify(),
  
  server: {
    port: 4321,
    host: true,
  },
  
  // 🔧 CONFIGURACIÓN VITE PARA EVITAR PROCESAMIENTO DE IMÁGENES EN CONTENT
  vite: {
    plugins: [
      // Plugin para desactivar procesamiento de assets en content collections
      {
        name: 'disable-content-assets',
        resolveId(id) {
          // Si es una imagen desde content collections, retornar null para que no se procese
          if (id.includes('?astroContentImageFlag=')) {
            return null;
          }
        }
      }
    ],
    optimizeDeps: {
      exclude: ['@astrojs/content-assets']
    }
  },
  
  // 🔧 CONFIGURACIÓN DE MARKDOWN SIMPLE
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});