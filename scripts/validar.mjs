/* Revisa el banco de preguntas (data/<categoría>/<CODIGO>0000.json). Sale con error si algo
   rompería el juego; los avisos son cosas raras pero no fatales.
   Uso: npm run validar */
import { readdirSync, readFileSync } from "node:fs";

const DIR = "data";
const TIPOS = ["ab", "mc", "vf", "ord"];
const errores = [];
const avisos = [];
const huellas = new Map();
let total = 0;

const categorias = JSON.parse(readFileSync(`${DIR}/categorias.json`, "utf8"));
const codigos = new Set();
const carpetas = new Set();
const porArchivo = []; // { archivo, categoria, lista }

for (const cat of categorias) {
  if (!/^[A-Z]{3,5}$/.test(cat.codigo || "")) errores.push(`categorias.json: el código «${cat.codigo}» tiene que ser de 3 a 5 letras mayúsculas`);
  if (codigos.has(cat.codigo)) errores.push(`categorias.json: código repetido ${cat.codigo}`);
  if (carpetas.has(cat.carpeta)) errores.push(`categorias.json: carpeta repetida ${cat.carpeta}`);
  codigos.add(cat.codigo);
  carpetas.add(cat.carpeta);
  let nombres;
  try {
    nombres = readdirSync(`${DIR}/${cat.carpeta}`).sort();
  } catch {
    errores.push(`categorias.json: no existe la carpeta data/${cat.carpeta}`);
    continue;
  }
  for (const nombre of nombres) {
    const archivo = `${cat.carpeta}/${nombre}`;
    if (!nombre.endsWith(".json")) {
      avisos.push(`${archivo}: no es .json, el juego lo ignora`);
      continue;
    }
    // CODIGO0001.json (a mano) · CODIGO-AAAAMMDD-HHMMSS.json y ORD-AAAAMMDD-HHMMSS.json (los crea el panel de carga)
    if (!new RegExp(`^(${cat.codigo}\\d{4}|(${cat.codigo}|ORD)-[A-Za-z0-9-]{6,})\\.json$`).test(nombre))
      errores.push(`${archivo}: el nombre tiene que ser ${cat.codigo} + 4 dígitos, por ejemplo ${cat.codigo}0001.json`);
    let x;
    try {
      x = JSON.parse(readFileSync(`${DIR}/${archivo}`, "utf8"));
    } catch (e) {
      errores.push(`${archivo}: JSON inválido (${e.message})`);
      continue;
    }
    if (x?.c !== cat.nombre) errores.push(`${archivo}: la categoría (c) es ${JSON.stringify(x?.c)} y debería ser «${cat.nombre}»`);
    porArchivo.push({ archivo, x });
  }
}
for (const d of readdirSync(DIR, { withFileTypes: true })) {
  if (d.isDirectory() && !carpetas.has(d.name)) errores.push(`data/${d.name}: carpeta que no está en categorias.json, sus preguntas no aparecerían`);
}
const archivos = porArchivo;

for (const { archivo, x } of porArchivo) {
  {
    total++;
    const donde = archivo + (typeof x?.q === "string" ? ` «${x.q.slice(0, 50)}»` : "");
    const err = (m) => errores.push(`${donde}: ${m}`);
    const av = (m) => avisos.push(`${donde}: ${m}`);
    if (typeof x !== "object" || x === null) { err("no es un objeto"); continue; }
    if (typeof x.c !== "string" || !x.c.trim()) err("falta la categoría (c)");
    if (!TIPOS.includes(x.t)) err(`tipo (t) inválido: ${JSON.stringify(x.t)}; tiene que ser ${TIPOS.join(" | ")}`);
    if (![1, 2].includes(x.p)) err(`puntaje (p) tiene que ser 1 o 2, vino ${JSON.stringify(x.p)}`);
    if (typeof x.q !== "string" || !x.q.trim()) err("falta el enunciado (q)");
    if (x.g !== undefined && (typeof x.g !== "string" || !x.g.trim())) err("el grupo (g) tiene que ser texto no vacío");
    if (x.n !== undefined && typeof x.n !== "string") err("la nota (n) tiene que ser texto");
    if (x.img !== undefined && (!Array.isArray(x.img) || !x.img.length || x.img.some((u) => typeof u !== "string")))
      err("img tiene que ser una lista de URLs");

    if (x.t === "mc") {
      if (!Array.isArray(x.o) || x.o.length < 2) err("mc necesita una lista de opciones (o) de al menos 2");
      else {
        if (typeof x.a !== "string") err("en mc la respuesta (a) tiene que ser texto");
        else if (!x.o.includes(x.a)) err(`la respuesta «${x.a}» no está entre las opciones`);
        if (new Set(x.o).size !== x.o.length) err("hay opciones repetidas");
        if (x.o.length !== 4) av(`tiene ${x.o.length} opciones (el resto del banco usa 4)`);
      }
      if (x.p !== 1) av("mc suele valer 1 punto");
    } else if (x.t === "vf") {
      if (!["verdadero", "falso"].includes(String(x.a).toLowerCase())) err('en vf la respuesta (a) tiene que ser "Verdadero" o "Falso"');
      if (x.o) err("vf no lleva opciones (o)");
    } else if (x.t === "ab") {
      if (typeof x.a !== "string" || !x.a.trim()) err("falta la respuesta (a)");
      if (x.o) err("ab no lleva opciones (o)");
      if (x.p !== 2) av("las preguntas sin opciones suelen valer 2 puntos");
    } else if (x.t === "ord") {
      // a se puede omitir: el juego usa o, que ya viene en el orden correcto
      const a = x.a === undefined ? x.o : x.a;
      if (!Array.isArray(x.o) || !Array.isArray(a)) err("ord necesita opciones (o) como lista, y si lleva respuesta (a), también como lista");
      else if ([...x.o].sort().join("\u0000") !== [...a].sort().join("\u0000")) err("en ord, a tiene que tener los mismos elementos que o, en el orden correcto");
    }

    // misma huella = el juego las trataría como la misma pregunta
    const huella = String(x.q) + (x.g || "");
    if (huellas.has(huella)) err(`repetida con ${huellas.get(huella)} (mismo texto y grupo)`);
    else huellas.set(huella, donde);
  }
}

for (const a of avisos) console.warn("aviso  ", a);
for (const e of errores) console.error("ERROR  ", e);
console.log(`\n${total} preguntas en ${categorias.length} categorías · ${errores.length} errores · ${avisos.length} avisos`);
process.exit(errores.length ? 1 : 0);
