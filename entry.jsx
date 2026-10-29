import React from "react";
import { createRoot } from "react-dom/client";

/* Shim de almacenamiento.
   La app usa window.storage.get(k) y window.storage.set(k, v), las dos asíncronas.
   Acá las mapeamos a localStorage, con fallback en memoria si está bloqueado
   (modo incógnito, cookies de terceros, etc.). Nunca tienen que rechazar:
   perder la rotación de preguntas es aceptable, romper la partida no. */
(function () {
  const memoria = new Map();

  function leerCrudo(k) {
    try {
      const v = window.localStorage.getItem(k);
      return v === null && memoria.has(k) ? memoria.get(k) : v;
    } catch (e) {
      return memoria.has(k) ? memoria.get(k) : null;
    }
  }

  function escribirCrudo(k, v) {
    const s = v === null || v === undefined ? "" : String(v);
    memoria.set(k, s);
    try {
      window.localStorage.setItem(k, s);
    } catch (e) {
      /* queda sólo en memoria para esta sesión */
    }
  }

  window.storage = {
    get(k) {
      return Promise.resolve(leerCrudo(k));
    },
    set(k, v) {
      escribirCrudo(k, v);
      return Promise.resolve(true);
    },
    remove(k) {
      memoria.delete(k);
      try {
        window.localStorage.removeItem(k);
      } catch (e) {
        /* nada */
      }
      return Promise.resolve(true);
    },
  };
})();

import App from "./app.jsx";

const nodo = document.getElementById("root");
createRoot(nodo).render(<App />);
