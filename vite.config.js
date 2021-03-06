import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    minify: false,
    target: "esnext"
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    },
  },
  plugins: [vue(), jsx()]
})
