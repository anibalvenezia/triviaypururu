# Banco de preguntas

**Una pregunta = un archivo.** Cada categoría tiene su carpeta y cada archivo se
llama con el código de la categoría y un número correlativo de 4 dígitos:

```
data/historia/HIST0001.json
data/historia/HIST0002.json
data/ciencia/CIEN0001.json
```

La lista de categorías (código, nombre y carpeta) está en `categorias.json`. **Su
orden es el orden de las categorías en el juego** (ruleta, etc.).

| Código | Categoría | Código | Categoría |
|---|---|---|---|
| CORD | Córdoba | DEPO | Deportes |
| HIST | Historia | MUND | Mundo |
| CIEN | Ciencia | ARTE | Arte |
| MUSI | Música | CULT | Cultura general |
| LITE | Literatura | BAND | Banderas |
| CINE | Cine y series | QDIJ | Quién dijo |
| TVES | TV y espectáculos | ASTR | Astronomía |

## Agregar una pregunta

1. Mirar cuál es el último número de la carpeta (por ejemplo `HIST0129.json`).
2. Crear el siguiente (`HIST0130.json`) con este formato:

```json
{
  "c": "Ciencia",
  "t": "mc",
  "p": 1,
  "g": "planeta-mas-grande",
  "q": "¿Cuál es el planeta más grande del Sistema Solar?",
  "o": ["Júpiter", "Saturno", "Neptuno", "Urano"],
  "a": "Júpiter",
  "n": "Nota que se muestra al revelar la respuesta (opcional)."
}
```

| Campo | Qué es |
|---|---|
| `c` | Categoría, igual al `nombre` en `categorias.json` |
| `t` | Tipo: `mc` opción múltiple (4 opciones) · `vf` verdadero/falso · `ab` sin opciones · `ord` ordenar |
| `p` | Puntos: `1` si tiene opciones o es verdadero/falso, `2` si es sin opciones |
| `g` | Grupo temático (opcional). Preguntas sobre el mismo hecho comparten grupo para que no salgan dos en la misma partida |
| `q` | Enunciado |
| `o` | Opciones (solo `mc` y `ord`) |
| `a` | Respuesta. En `mc` tiene que ser **idéntica** a una de las opciones; en `vf`, `"Verdadero"` o `"Falso"`; en `ord`, la lista en el orden correcto (se puede omitir: se usa `o`) |
| `n` | Nota explicativa (opcional) |
| `img` | Lista de URLs de imagen, con alternativas en cadena (opcional) |

## Cargar preguntas desde el panel

El panel (`/admin` en el sitio) crea los archivos por vos. Los nombres que genera son
`CODIGO-AAAAMMDD-HHMMSS.json` (por ejemplo `HIST-20261030-134512.json`) y el validador los
acepta junto con los `CODIGO0001.json` escritos a mano.

- El formulario tiene cuatro tipos: opción múltiple, verdadero/falso, sin opciones y ordenar.
- **Ordenar:** cargá los elementos ya en el orden correcto en *Opciones* y dejá *Respuesta* vacía.
  El archivo queda sin `a`; el validador y el build usan `o` como respuesta.
- Cada opción va en su propio ítem (pueden llevar comas).
- El panel se arma solo desde `categorias.json` (`scripts/generar-panel.mjs`); una categoría nueva aparece sin tocar nada.
- En la compu: `npx decap-server` en la raíz del repo y abrir `/admin/` del sitio compilado.

## Sumar una categoría nueva

1. Elegir un código de 3 a 5 letras mayúsculas y crear la carpeta `data/<carpeta>/`.
2. Agregarla a `categorias.json` (el lugar que ocupe define el orden en el juego).
3. Si tiene que aparecer en alguna ronda, sumarla a `RONDAS` en `app.jsx`.
4. Correr `npm test`.

## Antes de subir

`npm run validar` revisa el nombre de cada archivo, los campos obligatorios, que la
respuesta esté entre las opciones y que no haya preguntas repetidas. Es la misma
revisión que corre GitHub en cada pull request.
