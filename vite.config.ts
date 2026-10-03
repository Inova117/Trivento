import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    // TanStack Start (SSR build + router plugin). `server.entry` points at
    // src/server.ts, our SSR error wrapper.
    tanstackStart({ server: { entry: "server" } }),
    viteReact(),
    tailwindcss(),
    // Reads the "@/*" alias from tsconfig.json.
    tsconfigPaths(),
    // Build target (Cloudflare by default).
    nitro(),
  ],
  resolve: {
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
});
