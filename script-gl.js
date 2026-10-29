import { cpSync, mkdirSync } from "node:fs"

const src = "node_modules/maplibre-gl/dist"
const dest = "public/maplibre"

mkdirSync(dest, { recursive: true })
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
    cpSync(`${src}/${file}`, `${dest}/${file}`)
}