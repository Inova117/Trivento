import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    // TanStack Start (router plugin + build). `server.entry` apunta a
    // src/server.ts, nuestro wrapper de errores del SSR.
    //
    // `prerender` genera el HTML de la página durante el build: la salida queda
    // en `dist/client` (index.html + assets + renders), que es exactamente la
    // carpeta que Netlify publica. Sin esto, el HTML solo se produce en tiempo
    // de petición y `dist/client` no existe → "Deploy directory 'dist/client'
    // does not exist".
    tanstackStart({
      server: { entry: "server" },
      prerender: { enabled: true },
    }),
    viteReact(),
    tailwindcss(),
    // Lee el alias "@/*" de tsconfig.json.
    tsconfigPaths(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});