import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
    Icons({ compiler: 'svelte' }),
    ViteEjsPlugin({ name: pkg.name, version: pkg.version, license: pkg.license, author: pkg.author }),
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
