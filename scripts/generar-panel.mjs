/* Arma la configuración del panel de carga (Decap CMS) a partir de data/categorias.json,
   así las categorías nuevas aparecen solas en el panel. Se llama desde build.mjs
   y también se puede correr suelto:  node scripts/generar-panel.mjs [salida]  */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const q = (s) => JSON.stringify(s); // las cadenas JSON también son YAML válido

/* Decap no tiene contador correlativo ni reemplaza {{uuid_short}} en el nombre del archivo,
   así que los archivos del panel se llaman CODIGO-AAAAMMDD-HHMMSS (único para quien carga a mano). */
const ID = "{{year}}{{month}}{{day}}-{{hour}}{{minute}}{{second}}";

/* Campos de todas las preguntas (mc, vf, ab y ord).
   La categoría va oculta con su valor ya puesto. */
const camposComunes = (cat) => `
      - { label: Categoría, name: c, widget: hidden, default: ${q(cat.nombre)} }
      - label: Tipo de pregunta
        name: t
        widget: select
        default: mc
        options:
          - { label: "Opción múltiple (4 opciones)", value: mc }
          - { label: "Verdadero o falso", value: vf }
          - { label: "Sin opciones (se responde de memoria)", value: ab }
          - { label: "Ordenar (elementos que hay que poner en orden)", value: ord }
      - { label: Puntos, name: p, widget: number, value_type: int, min: 1, max: 2, default: 1, hint: "1 si tiene opciones o es verdadero/falso; 2 si es sin opciones o de ordenar." }
      - { label: Enunciado, name: q, widget: text }
      - { label: Opciones, name: o, widget: list, required: false, field: { label: Opción, name: opcion, widget: string }, hint: "Opción múltiple: 4 opciones. Ordenar: los elementos YA EN EL ORDEN CORRECTO (el juego los mezcla al mostrarlos). Dejar vacío en verdadero/falso y sin opciones." }
      - { label: Respuesta, name: a, widget: string, required: false, hint: "Opción múltiple: idéntica a una de las opciones. Verdadero/falso: Verdadero o Falso. Sin opciones: la respuesta corta. Ordenar: dejar vacía." }
      - { label: Nota, name: n, widget: text, required: false, hint: "Se muestra al revelar la respuesta." }
      - { label: Grupo temático, name: g, widget: string, required: false, hint: "Preguntas sobre el mismo hecho comparten grupo, así no salen dos en la misma partida. Ej: planeta-mas-grande." }
      - { label: Imágenes (URLs), name: img, widget: list, required: false, field: { label: URL, name: url, widget: string }, hint: "Opcional. Si hay varias, las siguientes son alternativas por si la primera no carga." }`;

export function configuracion(categorias) {
  const porCategoria = categorias.map(
    (cat) => `  - name: ${cat.carpeta.replace(/-/g, "_")}
    label: ${q(cat.nombre)}
    label_singular: ${q("pregunta de " + cat.nombre)}
    folder: ${q("data/" + cat.carpeta)}
    create: true
    extension: json
    format: json
    slug: ${q(cat.codigo + "-" + ID)}
    summary: "{{q}}"
    fields:${camposComunes(cat)}`
  );
  return `# Archivo GENERADO por scripts/generar-panel.mjs a partir de data/categorias.json.
# No se edita a mano: los cambios se pierden en el próximo build.
backend:
  name: github
  repo: anibalvenezia/triviaypururu
  branch: testing

# Solo se usa con "npx decap-server" en la compu; en el sitio publicado se ignora.
local_backend: true

# Cada pregunta nueva abre un pull request hacia testing, que revisan Anibal y su prima.
publish_mode: editorial_workflow
locale: es
site_url: https://triviapururu.netlify.app
media_folder: admin/media
public_folder: /admin/media

collections:
${porCategoria.join("\n")}
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const salida = process.argv[2] || "dist/admin/config.yml";
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, configuracion(JSON.parse(readFileSync("data/categorias.json", "utf8"))));
  console.log(`${salida} generado`);
}
