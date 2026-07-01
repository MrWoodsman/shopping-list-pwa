import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // automatycznie odświeża apkę, jak zmienisz kod
      manifest: {
        name: "Lista Zakupów",
        short_name: "Zakupy",
        description: "Domowa lista zakupów",
        theme_color: "#09090b",
        background_color: "#09090b",
        display: "standalone", // wymusza tryb pełnoekranowy (bez przeglądarki)
        icons: [
          {
            // Vite domyślnie ma plik vite.svg w folderze public/,
            // docelowo wrzucisz tu ikonę np. 192x192 jako .png
            src: "/vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["dev.mrwoodsman.pl"],
  },
});
