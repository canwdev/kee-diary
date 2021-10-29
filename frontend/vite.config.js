import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createVuePlugin } from 'vite-plugin-vue2'
import html from 'vite-plugin-html'
const isProd = process.env.NODE_ENV === 'production' // 'development'

export default defineConfig({
  base: './',
  build: {
    outDir: '../dist-frontend',
  },
  server: {
    port: '8081'
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/variables.scss";`
      }
    }
  },
  plugins: [
    createVuePlugin(),
    html({
      inject: {
        data: {
          title: 'KeeNote',
          injectScript: isProd ? `` : `<script src="http://127.0.0.1:9999/tank-ui.js"></script><link rel="stylesheet" href="http://127.0.0.1:9999/tank-ui.css">`
        },
      },
      minify: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})

