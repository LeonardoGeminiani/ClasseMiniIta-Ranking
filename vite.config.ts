import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

// function NunjucksPlugin() {
//   return {
//     name: 'vite-plugin-nunjucks',
//     transformIndexHtml(html) {
//       const templatePath = path.resolve(__dirname, 'index.html');
//       const template = fs.readFileSync(templatePath, 'utf-8');
//       const renderedHtml = nunjucks.renderString(template);
//       return renderedHtml;
//     },
//   };
// }


function vitePluginNunjucks() {
  return {
    name: 'vite-plugin-nunjucks',
    transformIndexHtml(html) {
        // Inizializza Nunjucks
        const env = nunjucks.configure('src/templates', { autoescape: true });

        // Renderizza il template Nunjucks
        return env.renderString(html);
      },
  };
}

// https://vitejs.dev/config/
export default defineConfig(async () => ({

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  }, 
  plugins: [vitePluginNunjucks()],

}));
