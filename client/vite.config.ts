import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      "jonnie-semimythic-silvana.ngrok-free.dev", // Cho phép domain cụ thể này
      ".ngrok-free.dev", // HOẶC: Cho phép tất cả domain đuôi ngrok (tiện hơn)
    ],
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
