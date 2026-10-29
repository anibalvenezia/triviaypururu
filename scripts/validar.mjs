/* Revisa el banco de preguntas (data/*.json). Sale con error si algo
   rompería el juego; los avisos son cosas raras pero no fatales.
   Uso: npm run validar */
import { readdirSync, readFileSync } from "node:fs";

const DIR = "data";
const TIPOS = ["ab", "mc", "vf", "ord"];
const errores = [];
const avisos = [];
const huellas = new Map();
let total = 0;

const indice = readFileSync(`${DIR}/index.js`, "utf8");
const archivos = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();

for (const archivo of archivos) {
  if (!indice.includes(`./${archivo}`)) {
    errores.push(`${archivo}: no está importado en data/index.js, sus preguntas no aparecerían en el juego`);
  }
  let lista;
  try {
    lista = JSON.parse(readFileSync(`${DIR}/${archivo}`, "utf8"));
  } catch (e) {
    errores.push(`${archivo}: JSON inválido (${e.message})`);
    continue;
  }
  if (!Array.isArray(lista)) {
    errores.push(`${archivo}: tiene que ser una lista de preguntas []`);
    continue;
  }
  const categorias = new Set(lista.map((x) => x?.c));
  if (categorias.size > 1) avisos.push(`${archivo}: mezcla categorías (${[...categorias].join(", ")})`);

  lista.forEach((x, i) => {
    total++;
    const donde = `${archivo} #${i + 1}` + (typeof x?.q === "string" ? ` «${x.q.slice(0, 50)}»` : "");
    const err = (m) => errores.push(`${donde}: ${m}`);
    const av = (m) => avisos.push(`${donde}: ${m}`);

    if (typeof x !== "object" || x === null) return err("no es un objeto");
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
      if (!Array.isArray(x.o) || !Array.isArray(x.a)) err("ord necesita opciones (o) y respuesta (a) como listas");
      else if ([...x.o].sort().join("\u0000") !== [...x.a].sort().join("\u0000")) err("en ord, a tiene que tener los mismos elementos que o, en el orden correcto");
    }

    // misma huella = el juego las trataría como la misma pregunta
    const huella = String(x.q) + (x.g || "");
    if (huellas.has(huella)) err(`repetida con ${huellas.get(huella)} (mismo texto y grupo)`);
    else huellas.set(huella, donde);
  });
}

for (const a of avisos) console.warn("aviso  ", a);
for (const e of errores) console.error("ERROR  ", e);
console.log(`\n${total} preguntas en ${archivos.length} archivos · ${errores.length} errores · ${avisos.length} avisos`);
process.exit(errores.length ? 1 : 0);
