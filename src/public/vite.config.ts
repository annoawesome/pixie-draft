import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  build: {
    outDir: "../../public",
  },

  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});
