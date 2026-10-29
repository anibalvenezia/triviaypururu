# Trivia y Pururú — código fuente

Juego de práctica para noches de trivia. Compila a **un único archivo HTML
autocontenido** que funciona sin instalar nada del lado de quien juega.
Netlify lo compila y publica solo en cada cambio a `main` (ver "Cómo se trabaja").

## Compilar

```bash
npm install
npm run build
```

Queda `dist/index.html`. Eso es todo lo que hay que publicar (si algún día hace
falta a mano, se arrastra la carpeta `dist` a Netlify Drop).

`npm test` valida el banco de preguntas y después compila.

## Qué hay en cada archivo

| Archivo | Qué es |
|---|---|
| `app.jsx` | La app: lógica de rondas, ruleta, semifinal, final y estilos. Un solo componente React con hooks, sin router. |
| `data/` | **El banco de preguntas**, un `.json` por categoría. Ver `data/README.md`. |
| `scripts/validar.mjs` | Revisa el banco (`npm run validar`). Corre solo en cada pull request. |
| `netlify.toml` | Le dice a Netlify cómo compilar y qué carpeta publicar. |
| `entry.jsx` | Punto de montaje y **shim de almacenamiento**. Ver la advertencia de abajo. |
| `build.mjs` | Empaqueta con esbuild y envuelve el bundle en el HTML. |

## Advertencia importante sobre `entry.jsx`

La app guarda qué preguntas ya salieron llamando a `window.storage.get(k)` y
`window.storage.set(k, v)`, **las dos asíncronas**. Ese objeto no existe en un
navegador común: lo provee `entry.jsx`, mapeándolo a `localStorage` con
fallback en memoria.

Si alguien reescribe ese shim con la API de `localStorage`
(`getItem`/`setItem`) en vez de `get`/`set`, la app compila igual y abre bien,
pero **se rompe en cuanto se sirve la primera pregunta**: tira
`window.storage.set is not a function`, React desmonta el árbol y se ve como
una ruleta trabada. Pasó una vez. Cualquier prueba tiene que llegar hasta
responder una pregunta, no quedarse en la pantalla de inicio.

## Estructura de una pregunta

```js
{
  c: "Córdoba",        // categoría
  t: "mc",             // ab | mc | vf | ord
  p: 1,                // puntaje: 1 con opciones, 2 sin opciones
  g: "mona-nacimiento",// grupo temático (anti-repetición)
  q: "¿En qué año nació la Mona Jiménez?",
  o: ["1951", "1944", "1958", "1963"],   // solo mc y ord
  a: "1951",                              // string, o array ordenado en ord
  n: "Juan Carlos Jiménez Rufino...",     // nota que se muestra al revelar
  img: ["url1", "url2"]                   // opcional, con fallback en cadena
}
```

Las preguntas viven en `data/<categoría>.json` y `data/index.js` las junta.

## Dos mecanismos que conviene no romper

**Grupos (`g`).** Dos preguntas del mismo tema se delatan entre sí. El campo
`g` garantiza que no salga más de una por partida, contando rondas, semifinal
y final. Preguntas sobre el mismo hecho tienen que compartir grupo.

**Huella (`huella()`).** Hash djb2 de `q.q + (q.g || "")`, persistido en
`trivia:vistas`, que rota las preguntas entre partidas. Se incluye el grupo
porque hay preguntas con texto idéntico (por ejemplo las de banderas) que de
otro modo colisionarían.

## Imágenes

Hay 260 preguntas con imagen: 237 remotas (cuadros y banderas, desde Wikimedia
Commons) y 23 embebidas como `data:` URI (los contornos de las provincias,
dibujados a partir de geometrías de Natural Earth, que es dominio público).

Al abrir, la app prueba cargar una imagen remota. Si falla, descarta **solo las
remotas**: las embebidas andan siempre. Las URL de Wikimedia aceptan únicamente
anchos estándar (250, 500, 960, 1280…); cualquier otro ancho devuelve HTTP 400.

## Estado del banco

1617 preguntas, 13 categorías.

| Categoría | | Categoría | |
|---|---|---|---|
| Arte | 160 | Deportes | 128 |
| Ciencia | 158 | Córdoba | 127 |
| Música | 144 | Banderas | 117 |
| Cultura general | 143 | Mundo | 102 |
| Literatura | 142 | TV y espectáculos | 81 |
| Cine y series | 139 | Quién dijo | 47 |
| Historia | 129 | | |

Formatos: 952 opción múltiple, 503 sin opciones, 145 verdadero o falso,
17 de ordenar.

Ninguna pregunta caduca: todas están ancladas a una fecha o a un hecho
consumado, en vez de a "actualmente" o "el último".

## Cómo se trabaja entre varios

Hay dos ramas que se publican en Netlify:

| Rama | Sitio | Para qué |
|---|---|---|
| `main` | https://triviapururu.netlify.app | Lo que usa el grupo. Solo entra lo ya probado. |
| `testing` | https://testing--triviapururu.netlify.app | Ensayo compartido: se prueba en el celular antes de pasar a `main`. |

El camino de un cambio:

1. Se crea una **rama de trabajo** desde `testing` (`astronomia-ronda-1`, `fix-ruleta`...)
   y se prueba en local con `npm test` y `npm run build`.
2. Se abre un **pull request hacia `testing`**. GitHub corre la validación sola y
   Netlify publica una vista previa con link propio del cambio.
3. Una vez mezclado, se prueba `testing` en Netlify jugando de verdad (una partida
   hasta responder preguntas, no solo ver el menú).
4. Si anda bien, se abre un **pull request de `testing` hacia `main`**.
5. Después de mezclar a `main`, se trae `main` de vuelta a `testing` para que no se
   desvíen: `git switch testing && git pull && git merge main && git push`.

Nadie sube directo a `main` ni a `testing`: todo entra por pull request.

Para agregar preguntas no hace falta programar: alcanza con editar el `.json` de la
categoría desde la web de GitHub. Ver `data/README.md`.
