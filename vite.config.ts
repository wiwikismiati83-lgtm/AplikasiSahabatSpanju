import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'suppress-vite-hmr-logs',
        transformIndexHtml: {
          order: 'pre',
          handler() {
            return [
              {
                tag: 'script',
                attrs: {},
                children: `(function(){
  var origError = console.error;
  var origWarn = console.warn;
  function isVite(arg) {
    if (!arg) return false;
    var str = '';
    if (typeof arg === 'string') str = arg;
    else if (arg && typeof arg.message === 'string') str = arg.message;
    else { try { str = String(arg); } catch(_) {} }
    var l = str.toLowerCase();
    return l.indexOf('[vite]') !== -1 || l.indexOf('websocket') !== -1;
  }
  console.error = function() {
    for (var i = 0; i < arguments.length; i++) { if (isVite(arguments[i])) return; }
    return origError.apply(console, arguments);
  };
  console.warn = function() {
    for (var i = 0; i < arguments.length; i++) { if (isVite(arguments[i])) return; }
    return origWarn.apply(console, arguments);
  };
})();`,
                injectTo: 'head-prepend',
              },
            ];
          },
        },
      },
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
        manifest: {
          id: '/',
          name: 'Sahabat SPANJU - SMPN 7 Pasuruan',
          short_name: 'SPANJU',
          description: 'Aplikasi Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan',
          theme_color: '#059669',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
