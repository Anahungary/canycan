// astro.config.mjs - CORREGIDO PARA CARGAR .env
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
  
  site: 'https://patadigital.com',
  
  output: 'server',
  adapter: netlify(),
  
  server: {
    port: 4321,
    host: true,
  }
});