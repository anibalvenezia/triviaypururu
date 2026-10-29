# Banco de preguntas

Un archivo por categoría. Cada uno es una lista `[ ... ]` de preguntas.
El orden de las categorías en el juego lo define `index.js`.

## Formato

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
| `c` | Categoría. Tiene que ser igual en todo el archivo. |
| `t` | Tipo: `mc` opción múltiple (4 opciones) · `vf` verdadero/falso · `ab` sin opciones · `ord` ordenar |
| `p` | Puntos: `1` si tiene opciones o es verdadero/falso, `2` si es sin opciones |
| `g` | Grupo temático (opcional). Preguntas sobre el mismo hecho comparten grupo para que no salgan dos en la misma partida |
| `q` | Enunciado |
| `o` | Opciones (solo `mc` y `ord`) |
| `a` | Respuesta. En `mc` tiene que ser **idéntica** a una de las opciones; en `vf`, `"Verdadero"` o `"Falso"`; en `ord`, la lista en el orden correcto |
| `n` | Nota explicativa (opcional) |
| `img` | Lista de URLs de imagen, con alternativas en cadena (opcional) |

## Sumar una categoría nueva

1. Crear `data/<nombre>.json` con la lista de preguntas.
2. Importarla en `data/index.js` y agregarla a la lista (el orden ahí es el de la ruleta).
3. Si tiene que aparecer en alguna ronda, sumarla a `RONDAS` en `app.jsx`.
4. Correr `npm test`.

## Antes de subir

`npm run validar` revisa campos obligatorios, que la respuesta esté entre las
opciones y que no haya preguntas repetidas. Es la misma revisión que corre GitHub
en cada pull request.
