/* Vista previa de las preguntas en el panel: las dibuja como las ve el jugador, con la respuesta
   revelada, y avisa en vivo de los errores que después marcaría la validación de GitHub.
   Los estilos (juego.css) salen de app.jsx en cada build; la lista de colecciones la completa el build. */
(function () {
  var CMS = window.CMS;
  var h = window.h;
  if (!CMS || !h) { console.warn("Vista previa: falta CMS o h, no se registra."); return; }

  var COLECCIONES = /*COLECCIONES*/[];
  var LETRAS = ["A", "B", "C", "D", "E", "F"];

  function txt(x) { return typeof x === "string" ? x.trim() : ""; }
  function lista(x) { return Array.isArray(x) ? x.map(txt).filter(Boolean) : []; }

  /* Las mismas reglas que scripts/validar.mjs, para enterarse antes de abrir el pull request. */
  function avisos(d) {
    var e = [], w = [];
    var o = lista(d.o), a = typeof d.a === "string" ? d.a.trim() : "";
    var hayA = a !== "";
    if (!txt(d.q)) e.push("Falta el enunciado.");
    if (d.t === "mc") {
      if (o.length < 2) e.push("Opción múltiple necesita opciones (idealmente 4).");
      else if (o.length !== 4) w.push("Tiene " + o.length + " opciones; el resto del banco usa 4.");
      if (!hayA) e.push("Falta la respuesta.");
      else if (o.indexOf(a) < 0) e.push("La respuesta tiene que ser idéntica a una de las opciones.");
      if (new Set(o).size !== o.length) e.push("Hay opciones repetidas.");
      if (d.p !== 1) w.push("Opción múltiple suele valer 1 punto.");
    } else if (d.t === "vf") {
      if (a.toLowerCase() !== "verdadero" && a.toLowerCase() !== "falso") e.push("La respuesta tiene que ser Verdadero o Falso.");
      if (o.length) e.push("Verdadero o falso no lleva opciones: vaciá la lista.");
    } else if (d.t === "ab") {
      if (!hayA) e.push("Falta la respuesta.");
      if (o.length) e.push("Sin opciones no lleva opciones: vaciá la lista.");
      if (d.p !== 2) w.push("Las preguntas sin opciones suelen valer 2 puntos.");
    } else if (d.t === "ord") {
      if (o.length < 2) e.push("Ordenar necesita al menos 2 elementos, ya en el orden correcto.");
      if (hayA) w.push("En ordenar la respuesta se deja vacía: el orden de las opciones ya es la respuesta.");
      if (new Set(o).size !== o.length) e.push("Hay elementos repetidos.");
    }
    return { e: e, w: w };
  }

  function claseImagen(d) {
    if (d.c === "Banderas") return "bandera";
    if (typeof d.g === "string" && d.g.indexOf("prov-") === 0) return "mapa";
    return "";
  }

  /* Prueba las direcciones en cadena, igual que el juego. */
  function imagen(urls, d) {
    return h("div", { key: urls.join("|") },
      h("div", { className: "obra " + claseImagen(d) },
        h("img", {
          src: urls[0], alt: "", "data-i": "0",
          onError: function (ev) {
            var t = ev.target, i = +t.getAttribute("data-i") + 1;
            if (i < urls.length) { t.setAttribute("data-i", String(i)); t.src = urls[i]; }
            else { t.style.display = "none"; if (t.parentNode.nextSibling) t.parentNode.nextSibling.style.display = "block"; }
          }
        })),
      h("div", { className: "obra obra-falla", style: { display: "none" } },
        h("span", { className: "eyebrow" }, "No se pudo cargar la imagen"),
        h("p", { className: "ayuda" }, "Se probaron " + urls.length + " direcciones. Revisá las URLs.")));
  }

  function cajaAvisos(av) {
    var filas = av.e.map(function (m) { return h("li", { key: "e" + m, style: { color: "var(--frutilla)" } }, m); })
      .concat(av.w.map(function (m) { return h("li", { key: "w" + m, style: { color: "var(--manteca)" } }, m); }));
    if (!filas.length)
      return h("p", { className: "ayuda", style: { color: "var(--menta)", margin: "0 0 4px" } }, "✓ Sin errores. Así la vería el jugador al revelar la respuesta.");
    return h("div", { className: "tarjeta tarjeta-suave", style: { marginTop: 0, marginBottom: 4 } },
      h("div", { className: "eyebrow", style: { marginBottom: 8 } }, av.e.length ? "Corregir antes de guardar" : "Para revisar"),
      h("ul", { style: { margin: 0, paddingLeft: 18, lineHeight: 1.5, fontSize: 14 } }, filas));
  }

  function Vista(props) {
    var d = props.entry.get("data").toJS();
    var o = lista(d.o);
    var a = typeof d.a === "string" ? d.a.trim() : "";
    var urls = lista(d.img);
    var av = avisos(d);

    var opciones = null;
    if (d.t === "mc") {
      opciones = o.map(function (op, i) {
        var ok = op === a;
        return h("button", { key: i, className: "opt" + (ok ? " ok" : ""), disabled: true },
          h("span", { className: "letra" }, ok ? "✓" : LETRAS[i] || "·"), h("span", null, op));
      });
    } else if (d.t === "vf") {
      opciones = ["Verdadero", "Falso"].map(function (op, i) {
        var ok = op.toLowerCase() === a.toLowerCase();
        return h("button", { key: op, className: "opt" + (ok ? " ok" : ""), disabled: true },
          h("span", { className: "letra" }, ok ? "✓" : LETRAS[i]), h("span", null, op));
      });
    } else if (d.t === "ord") {
      opciones = [h("p", { key: "ayuda", className: "ayuda" }, "El juego mezcla estos elementos; acá se ven en el orden correcto.")]
        .concat(o.map(function (op, i) {
          return h("button", { key: i, className: "opt ok", disabled: true },
            h("span", { className: "letra" }, String(i + 1)), h("span", null, op));
        }));
    }

    var respuesta = d.t === "ord" ? o.join("  →  ") : a;

    return h("div", { className: "tb", style: { minHeight: 0 } },
      h("div", { className: "tb-wrap", style: { padding: "14px 18px 18px" } },
        cajaAvisos(av),
        h("section", { className: "tarjeta" },
          h("div", { className: "row", style: { justifyContent: "space-between", marginBottom: 14 } },
            h("span", { className: "tag" }, d.c || ""),
            h("span", { className: "tag tag-pts" }, (d.p || "?") + " " + (d.p === 1 ? "punto" : "puntos"))),
          h("p", { className: "pregunta" }, txt(d.q) || "(sin enunciado)"),
          urls.length ? imagen(urls, d) : null,
          opciones ? h("div", { className: "stack", style: { marginTop: 18 } }, opciones) : null,
          h("div", { className: "respuesta" },
            h("div", { className: "eyebrow", style: { marginBottom: 6 } }, "Respuesta"),
            h("div", { className: "respuesta-txt" }, respuesta || "—"),
            txt(d.titulo) ? h("p", { className: "ficha" }, d.titulo) : null,
            txt(d.n) ? h("p", { className: "nota" }, d.n) : null))));
  }

  COLECCIONES.forEach(function (nombre) { CMS.registerPreviewTemplate(nombre, Vista); });
  CMS.registerPreviewStyle("/admin/juego.css");
})();
