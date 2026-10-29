/* Compila la app a un único HTML autocontenido, listo para Netlify Drop.
   Uso:  npm install  &&  npm run build   ->  dist/index.html
   (Netlify publica la carpeta dist/; con Netlify Drop se arrastra dist/)     */
import { build } from "esbuild";
import { writeFileSync, statSync, mkdirSync } from "node:fs";

const SALIDA = "dist/index.html";
mkdirSync("dist", { recursive: true });

const resultado = await build({
  entryPoints: ["entry.jsx"],
  bundle: true,
  minify: true,
  write: false,
  loader: { ".jsx": "jsx" },
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
