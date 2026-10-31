/* Compila la app a un único HTML autocontenido, listo para Netlify Drop.
   Uso:  npm install  &&  npm run build   ->  dist/index.html
   (Netlify publica la carpeta dist/; con Netlify Drop se arrastra dist/)     */
import { build } from "esbuild";
import { writeFileSync, statSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { configuracion } from "./scripts/generar-panel.mjs";


/* El banco vive en data/<carpeta>/<CODIGO>0001.json, un archivo por pregunta.
   Este plugin lo junta en un módulo virtual: categorías en el orden de
   data/categorias.json (define el orden de la ruleta) y, dentro de cada una,
   por nombre de archivo. */
function leerBanco(dir = "data") {
  const categorias = JSON.parse(readFileSync(`${dir}/categorias.json`, "utf8"));
  return categorias.flatMap((c) =>
    readdirSync(`${dir}/${c.carpeta}`)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => JSON.parse(readFileSync(`${dir}/${c.carpeta}/${f}`, "utf8")))
      // las de ordenar cargadas desde el panel traen solo o (ya en orden); a = o
      .map((x) => (x.t === "ord" && x.a === undefined ? { ...x, a: x.o } : x))
  );
}

const bancoDePreguntas = {
  name: "banco-de-preguntas",
  setup(b) {
    b.onResolve({ filter: /^banco-de-preguntas$/ }, () => ({ path: "banco", namespace: "banco" }));
    b.onLoad({ filter: /.*/, namespace: "banco" }, () => ({
      contents: `export default ${JSON.stringify(leerBanco())};`,
      loader: "js",
    }));
  },
};

const SALIDA = "dist/index.html";
mkdirSync("dist", { recursive: true });

const resultado = await build({
  entryPoints: ["entry.jsx"],
  bundle: true,
  minify: true,
  write: false,
  loader: { ".jsx": "jsx" },
  plugins: [bancoDePreguntas],
  define: { "process.env.NODE_ENV": '"production"' },
});

/* Si el código contiene "</script" literal, el navegador cortaría el bloque
   antes de tiempo. Hay que escaparlo. */
const js = resultado.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const ICONO =
  "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E" +
  "%3Ctext y=%27.9em%27 font-size=%2790%27%3E%F0%9F%8D%BF%3C/text%3E%3C/svg%3E";

writeFileSync(
  SALIDA,
  `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Trivia y Pururú</title>
<meta name="description" content="Practicá para tu próxima noche de trivia." />
<meta name="theme-color" content="#120b1f" />
<link rel="icon" href="${ICONO}" />
<style>html,body{margin:0;padding:0;background:#120b1f;}#root{min-height:100vh;}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>
`
);

console.log(`${SALIDA} · ${(statSync(SALIDA).size / 1024).toFixed(0)} KB`);

/* Panel de carga de preguntas: admin/index.html + config.yml generado desde categorias.json */
mkdirSync("dist/admin", { recursive: true });
writeFileSync("dist/admin/index.html", readFileSync("admin/index.html"));
writeFileSync("dist/admin/config.yml", configuracion(JSON.parse(readFileSync("data/categorias.json", "utf8"))));

/* Vista previa del panel: estilos del juego (extraídos de app.jsx para que no se desfasen)
   y la lista de colecciones, que es la misma que arma generar-panel.mjs. */
const css = readFileSync("app.jsx", "utf8").match(/^const CSS = `([\s\S]*?)^`;/m);
if (!css) throw new Error("No encontré «const CSS = `…`;» en app.jsx: la vista previa del panel necesita ese bloque.");
writeFileSync("dist/admin/juego.css", css[1]);
const colecciones = JSON.parse(readFileSync("data/categorias.json", "utf8")).map((c) => c.carpeta.replace(/-/g, "_"));
writeFileSync(
  "dist/admin/preview.js",
  readFileSync("admin/preview.js", "utf8").replace("/*COLECCIONES*/[]", JSON.stringify(colecciones))
);
console.log("dist/admin · panel de carga y vista previa");
