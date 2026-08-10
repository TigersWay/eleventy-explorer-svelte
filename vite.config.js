import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { name, version, license, author } from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    ViteEjsPlugin({ name, version, license, author }),
    ViteMinifyPlugin({ collapseWhitespace: true, removeComments: false })
  ],

  publicDir: 'static',
  build: { outDir: 'public' },

  resolve: {
    alias: {
      $lib: '/src/lib',
      $assets: '/src/assets'
    }
  }
});
