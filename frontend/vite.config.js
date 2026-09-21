import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: 'Job_Portal',
  server: {
    port: 5173,
    headers: {
      "Cache-Control": "no-store",
    },
  },
});
