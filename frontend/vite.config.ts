import fs from "fs"
import path from "path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Eksport ze SketchUpa (Eryk.dae + folder tekstur) leży w public/models obok Eryk.glb, ale strona
// wczytuje tylko .glb. Bez tego Vite kopiowałby źródła do dist, a Cloudflare Pages odrzuca pliki
// większe niż 25 MiB (sam .dae ma ~43 MB) — deploy kończył się błędem.
function dropModelSources(): Plugin {
  return {
    name: "drop-model-sources",
    apply: "build",
    closeBundle() {
      const dir = path.resolve(__dirname, "dist/models")
      if (!fs.existsSync(dir)) return
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith(".glb")) continue
        fs.rmSync(path.join(dir, entry.name), { recursive: true, force: true })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), dropModelSources()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
