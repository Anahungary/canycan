import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  
  site: 'https://patadigital.com',
  
  server: {
    port: 4321,
    host: true,
  }
});