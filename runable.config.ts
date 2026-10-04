import { join } from 'node:path';
import { defineConfig } from 'runable';

export default defineConfig({
  ssr: true,

  distdir: 'dist/app',

  siteUrl: process.env.RUNABLE_SITE_URL,

  head: {
    title: process.env.RUN_PUBLIC_SITE_NAME,
    link: [{ rel: 'icon', href: '/favicon.svg' }],
  },

  css: ['./app/css/main.css'],

  alias: { '@': join(import.meta.dirname, './app') },

  modules: ['@runablejs/tailwindcss'],

  components: [
    { dirs: './app/components/ui', prefix: 'U', pathPrefix: false },
    { dirs: './app/components/app', prefix: 'U', pathPrefix: false },
  ],

  tailwindcss: { injectCss: false },
});

// export default defineModule({
//   configKey: "ui",
//   meta: { name: "domutala-ui" },

//   ssr: false,

//   css: ["./app/css/main.css"],

//   alias: { "@": join(import.meta.dirname, "./app") },

//   modules: ["@runablejs/tailwindcss"],

//   components: [{ dirs: "./app/components/ui", prefix: "U", pathPrefix: false }],

//   tailwindcss: { injectCss: false },

//   vite: {
//     resolve: { dedupe: ["vue", "@vue/runtime-core", "@vue/runtime-dom"] },
//     optimizeDeps: { exclude: ["vue", "@vue/runtime-core", "@vue/runtime-dom"] },
//   },
// });
