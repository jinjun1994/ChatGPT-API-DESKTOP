const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')
const path = require('path')
const { defineConfig } = require('vite');
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'


/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: Path.join(__dirname, 'src', 'renderer'),
    publicDir: 'public',
    resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'src/renderer'),
          'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'

        },
        
      },
    server: {
        port: 8080,
    },
    open: false,
    build: {
        outDir: Path.join(__dirname, 'build', 'renderer'),
        emptyOutDir: true,
    },
    plugins: [vuePlugin(),
        VueI18nPlugin({ /* options */ }),

],
});

module.exports = config;
