import React, { useState, useEffect, useMemo } from "react";
import PREGUNTAS from "banco-de-preguntas"; // generado por build.mjs desde data/

/* ============================================================
   TRIVIA Y PURURÚ — práctica para la mesa de Córdoba
   3 rondas temáticas de 12 · semifinal por eliminación · final a pulsador
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root{
  --noche:#181243;
  --panel:#241B5E;
  --alto:#2F2478;
  --tiza:#FFF6E9;
  --manteca:#FFD447;
  --frutilla:#FF5D8F;
  --menta:#4EE1B0;
  --cielo:#7CB6FF;
  --humo:rgba(255,246,233,.58);
  --borde:rgba(255,246,233,.14);
  --r:18px;
}
*{box-sizing:border-box}
button{font-family:inherit}
.tb{
  min-height:100vh;background:var(--noche);color:var(--tiza);
  font-family:'Outfit',system-ui,sans-serif;font-size:16px;
  background-image:
    radial-gradient(circle at 8% 0%, rgba(255,212,71,.16), transparent 45%),
    radial-gradient(circle at 100% 12%, rgba(255,93,143,.16), transparent 42%),
    radial-gradient(circle at 50% 100%, rgba(78,225,176,.10), transparent 55%);
  background-attachment:fixed;
}
.tb-wrap{max-width:600px;margin:0 auto;padding:0 18px;width:100%}
.contenido{padding-top:22px;padding-bottom:120px}
.centro{text-align:center}
.stack{display:flex;flex-direction:column;gap:10px}
.row{display:flex;gap:10px;align-items:center}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}

.eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--humo)}
.mono{font-family:'Space Mono',monospace;font-size:13px}
.titulo{font-family:'Fredoka',sans-serif;font-weight:700;font-size:clamp(30px,8.5vw,42px);line-height:1.02;margin:0;letter-spacing:-.01em}
.titulo-2{font-family:'Fredoka',sans-serif;font-weight:600;font-size:21px;margin:0 0 12px}
.bajada{color:var(--humo);margin:6px 0 0;font-size:14.5px;line-height:1.45}
.ayuda{color:var(--humo);font-size:14px;line-height:1.5;margin:8px 0 0}
.nota{color:var(--humo);font-size:13px;line-height:1.5;margin:10px 0 0}
.pie{text-align:center;color:var(--humo);font-size:12.5px;margin-top:30px}

.logo{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;
  background:linear-gradient(150deg,var(--manteca),var(--frutilla));flex:0 0 auto;
  box-shadow:0 8px 24px rgba(255,93,143,.32)}
.marca{display:flex;gap:14px;align-items:center}
.splash{display:flex;flex-direction:column;align-items:center;gap:14px;padding-top:34vh}

/* --- botones héroe del menú --- */
.hero{
  display:flex;align-items:center;gap:14px;width:100%;text-align:left;cursor:pointer;
  border:none;border-radius:22px;padding:20px 18px;color:#1A1140;
  box-shadow:0 10px 0 rgba(0,0,0,.22);transition:transform .1s ease,box-shadow .1s ease;
}
.hero:active{transform:translateY(6px);box-shadow:0 4px 0 rgba(0,0,0,.22)}
.hero-a{background:linear-gradient(135deg,#FFD447,#FFA94D)}
.hero-b{background:linear-gradient(135deg,#4EE1B0,#7CB6FF)}
.hero-emoji{font-size:30px;line-height:1}
.hero-txt{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.hero-txt strong{font-family:'Fredoka',sans-serif;font-size:19px;font-weight:600}
.hero-txt span{font-size:13.5px;opacity:.75;line-height:1.35}
.hero-flecha{font-size:22px;font-weight:700;opacity:.6}


/* --- botones --- */
.btn{
  width:100%;min-height:50px;border:1.5px solid var(--tiza);background:transparent;color:var(--tiza);
  font-weight:600;font-size:15.5px;padding:13px 16px;border-radius:14px;cursor:pointer;
  transition:transform .08s ease,background .15s ease,color .15s ease;
}
.btn:hover{background:rgba(255,246,233,.12)}
.btn:active{transform:translateY(2px)}
.btn-primario{background:var(--manteca);border-color:var(--manteca);color:#241703;box-shadow:0 5px 0 rgba(0,0,0,.22)}
.btn-primario:hover{background:#ffdf70;color:#241703}
.btn-primario:active{box-shadow:0 1px 0 rgba(0,0,0,.22)}
.btn-si{background:var(--menta);border-color:var(--menta);color:#06301F}
.btn-si:hover{background:#74ecc4;color:#06301F}
.btn-no{background:var(--frutilla);border-color:var(--frutilla);color:#3A0416}
.btn-no:hover{background:#ff81a9;color:#3A0416}
.btn-borde{border-color:var(--borde);font-weight:500;min-height:44px;font-size:14px}
.grande{min-height:56px;font-size:17px;font-family:'Fredoka',sans-serif;font-weight:600}
.chico{min-height:40px;font-size:13.5px;padding:8px 12px;width:auto}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn:focus-visible,.opt:focus-visible,.puls:focus-visible,.hero:focus-visible,
.selector:focus-visible,.salir:focus-visible,.toggle:focus-visible{outline:3px solid var(--menta);outline-offset:3px}

/* --- barra superior --- */
.barra{position:sticky;top:0;z-index:30;background:rgba(18,13,52,.94);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--borde)}
.barra-in{padding-top:10px;padding-bottom:8px}
.barra-fila{display:flex;align-items:center;justify-content:space-between;gap:12px}
.barra-detalle{font-size:14.5px;font-weight:600;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.salir{width:40px;height:40px;flex:0 0 auto;border-radius:50%;border:1px solid var(--borde);
  background:rgba(255,246,233,.06);color:var(--tiza);font-size:15px;cursor:pointer}
.salir:hover{background:rgba(255,93,143,.22)}
.marcador{display:flex;gap:8px;margin-top:10px;overflow-x:auto}
.marca{flex:1;min-width:76px;background:rgba(255,246,233,.06);border-radius:12px;padding:7px 10px}
.marca-nm{display:block;font-size:11.5px;color:var(--humo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.marca-pt{font-family:'Fredoka',sans-serif;font-size:20px;font-weight:700;line-height:1.1}

.barra-inferior{position:fixed;left:0;right:0;bottom:0;z-index:25;padding:12px 0 calc(12px + env(safe-area-inset-bottom));
  background:linear-gradient(to top,rgba(18,13,52,.98) 68%,rgba(18,13,52,0))}

/* --- tarjetas y preguntas --- */
.tarjeta{background:var(--panel);border:1px solid var(--borde);border-radius:var(--r);padding:20px;margin-top:14px}
.tarjeta-suave{background:var(--alto)}
.compacta{padding:15px}
.tag{display:inline-flex;font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:.08em;
  text-transform:uppercase;border:1px solid var(--borde);padding:4px 10px;border-radius:999px;color:var(--humo)}
.tag-pts{border-color:var(--manteca);color:var(--manteca)}
.pregunta{font-size:20.5px;line-height:1.3;font-weight:600;margin:0}
.pregunta.chica{font-size:15px;font-weight:500;line-height:1.4}

.opt{
  width:100%;text-align:left;background:rgba(255,246,233,.05);border:1.5px solid var(--borde);
  color:var(--tiza);padding:15px;border-radius:14px;font-size:15.5px;cursor:pointer;
  display:flex;gap:12px;align-items:flex-start;line-height:1.35;min-height:52px;
  transition:background .12s ease,border-color .12s ease;
}
.opt:hover:not(:disabled){background:rgba(255,246,233,.1)}
.opt.chico{min-height:46px;padding:12px 14px;font-size:15px}
.opt .letra{font-family:'Space Mono',monospace;font-size:12.5px;color:var(--manteca);padding-top:3px;flex:0 0 auto;min-width:14px}
.opt.ok{background:rgba(78,225,176,.18);border-color:var(--menta)}
.opt.ok .letra{color:var(--menta)}
.opt.mal{background:rgba(255,93,143,.16);border-color:var(--frutilla)}
.opt.mal .letra{color:var(--frutilla)}
.opt.tomada{border-color:var(--manteca);background:rgba(255,212,71,.12)}
.opt:disabled{cursor:default;opacity:1}

.respuesta{border-left:3px solid var(--menta);padding-left:14px;margin-top:18px}
.respuesta-txt{font-size:17px;font-weight:700;line-height:1.35}
.respuesta-txt.chica{font-size:14px;color:var(--menta);font-weight:600;margin-top:6px}

.veredicto{margin-top:12px;text-align:center;font-family:'Fredoka',sans-serif;font-weight:600;
  font-size:17px;padding:12px;border-radius:14px}
.veredicto[data-ok="si"]{background:rgba(78,225,176,.16);color:var(--menta)}
.veredicto[data-ok="no"]{background:rgba(255,93,143,.14);color:var(--frutilla)}

.progreso{display:flex;gap:4px}
.paso{height:6px;flex:1;background:rgba(255,246,233,.15);border-radius:4px;transition:background .2s ease}
.paso.hecho{background:var(--menta)}
.paso.actual{background:var(--manteca)}

.reloj-linea{display:flex;align-items:center;gap:10px;margin-top:12px}
.reloj-barra{flex:1;height:6px;background:rgba(255,246,233,.15);border-radius:4px;overflow:hidden}
.reloj-barra span{display:block;height:100%;background:var(--manteca);transition:width 1s linear}

/* --- formularios --- */
.input{width:100%;background:rgba(10,6,36,.6);border:1.5px solid var(--borde);color:var(--tiza);
  padding:14px;border-radius:14px;font-family:'Outfit',sans-serif;font-size:15.5px;min-height:50px}
.input:focus{outline:none;border-color:var(--manteca)}
select.input{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--humo) 50%),linear-gradient(135deg,var(--humo) 50%,transparent 50%);
  background-position:calc(100% - 20px) 22px,calc(100% - 14px) 22px;background-size:6px 6px;background-repeat:no-repeat;padding-right:42px}
.campo{display:flex;flex-direction:column;gap:6px}
.campo>span{font-size:13px;color:var(--humo)}
.campo-eq{display:flex;align-items:center;gap:10px}
.punto{width:12px;height:12px;border-radius:50%;flex:0 0 auto}
.selector{min-height:64px;border-radius:16px;border:1.5px solid var(--borde);background:rgba(255,246,233,.05);
  color:var(--tiza);font-family:'Fredoka',sans-serif;font-size:22px;font-weight:600;cursor:pointer}
.selector.activo{background:var(--manteca);border-color:var(--manteca);color:#241703}
.toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;margin-top:16px;
  background:rgba(255,246,233,.05);border:1px solid var(--borde);border-radius:14px;padding:14px;
  color:var(--tiza);font-size:15px;cursor:pointer;min-height:52px}
.switch{width:46px;height:26px;border-radius:99px;background:rgba(255,246,233,.2);position:relative;flex:0 0 auto;transition:background .2s ease}
.switch i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--tiza);transition:transform .2s ease}
.toggle.on .switch{background:var(--menta)}
.toggle.on .switch i{transform:translateX(20px)}
.aviso{font-size:13.5px;padding:11px 14px;border-radius:12px}
.aviso.bien{background:rgba(78,225,176,.16);color:var(--menta)}
.aviso.mal{background:rgba(255,93,143,.14);color:var(--frutilla)}

/* --- puestos y stats --- */
.fila-puesto{display:flex;align-items:center;gap:12px;background:var(--panel);border:1px solid var(--borde);
  border-radius:var(--r);padding:15px 18px}
.num{font-family:'Space Mono',monospace;font-size:12px;color:var(--humo);min-width:14px}
.fila-nm{flex:1;font-weight:600}
.fila-pt{font-family:'Fredoka',sans-serif;font-size:26px;font-weight:700;line-height:1}
.ronda-linea{display:flex;gap:12px;align-items:flex-start;padding:7px 0;font-size:14.5px}
.selector.chico{min-height:56px;font-size:15px;font-family:'Outfit',sans-serif;font-weight:600}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.stats div{background:var(--panel);border:1px solid var(--borde);border-radius:14px;padding:13px;text-align:center}
.stats strong{display:block;font-family:'Fredoka',sans-serif;font-size:21px;color:var(--manteca)}
.stats span{font-size:11.5px;color:var(--humo)}

/* --- final --- */
.meta-final{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.tanteador{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.tanteador-eq{background:var(--panel);border:1px solid var(--borde);border-radius:14px;padding:12px}
.kernels{display:flex;gap:6px;margin-top:8px}
.kernel{width:16px;height:16px;border-radius:50%;background:rgba(255,246,233,.16)}
.kernel.lleno{box-shadow:0 0 12px currentColor}
.pulsadores{margin-top:12px}
.puls{
  width:100%;aspect-ratio:1/1;border-radius:50%;border:5px solid rgba(0,0,0,.22);
  font-family:'Fredoka',sans-serif;font-weight:700;font-size:18px;color:#1A1140;cursor:pointer;
  box-shadow:0 10px 0 rgba(0,0,0,.34), inset 0 -8px 18px rgba(0,0,0,.16);
  transition:transform .06s ease,box-shadow .06s ease;
  display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;line-height:1.1;
}
.puls:active{transform:translateY(10px);box-shadow:0 0 0 rgba(0,0,0,.34), inset 0 -4px 12px rgba(0,0,0,.2)}
.cuenta{font-family:'Fredoka',sans-serif;font-weight:700;font-size:58px;line-height:1.05;color:var(--frutilla);margin-top:6px}
.cuenta.calma{color:var(--menta)}
.confeti{display:flex;justify-content:center;animation:flota 2.4s ease-in-out infinite alternate}
@keyframes flota{from{transform:translateY(0)}to{transform:translateY(-10px)}}

/* --- ruleta --- */
.ruleta-zona{display:flex;flex-direction:column;align-items:center;margin-top:16px}
.ruleta-puntero{font-size:28px;line-height:1;margin-bottom:-8px;z-index:2;color:var(--tiza);
  text-shadow:0 3px 8px rgba(0,0,0,.6);filter:drop-shadow(0 2px 0 rgba(0,0,0,.3))}
.ruleta{width:min(74vw,290px);aspect-ratio:1/1;border-radius:50%;
  filter:drop-shadow(0 12px 28px rgba(0,0,0,.4))}

/* --- veredicto del solitario --- */
.veredicto-botones{gap:12px}
.juzgar{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
  min-height:104px;border:none;border-radius:20px;cursor:pointer;
  font-family:'Fredoka',sans-serif;font-weight:600;font-size:17px;color:#0D2A1E;
  box-shadow:0 6px 0 rgba(0,0,0,.26);transition:transform .07s ease,box-shadow .07s ease;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation}
.juzgar:active{transform:translateY(5px);box-shadow:0 1px 0 rgba(0,0,0,.26)}
.juzgar.bien{background:var(--menta)}
.juzgar.mal{background:var(--frutilla);color:#3A0416}
.juzgar-icono{font-size:26px;line-height:1;font-weight:700}

/* --- obras de arte --- */
.obra{margin-top:16px;border-radius:14px;overflow:hidden;background:rgba(10,6,36,.5);border:1px solid var(--borde)}
.obra img{width:100%;height:auto;max-height:46vh;object-fit:contain;display:block}
.obra.bandera{background:rgba(255,246,233,.9);padding:14px}
.obra.bandera img{max-height:30vh}
.obra.mapa{background:transparent;padding:10px}
.obra.mapa img{max-height:36vh;width:auto;max-width:100%;margin:0 auto;object-fit:contain}
.obra-esqueleto{width:100%;height:200px;background:linear-gradient(100deg,rgba(255,246,233,.05),rgba(255,246,233,.14),rgba(255,246,233,.05));
  background-size:220% 100%;animation:brillo 1.3s linear infinite}
@keyframes brillo{to{background-position:-220% 0}}
.obra-falla{padding:20px;text-align:center}
.ficha{font-size:13.5px;color:var(--manteca);margin-top:8px;line-height:1.45;font-weight:600}
.diag{font-size:11px;color:var(--humo);margin-top:10px;word-break:break-all;line-height:1.5}

/* --- arena espejada del pulsador --- */
.espejo{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.espejo-mitad{background:var(--panel);border:2px solid var(--borde);border-radius:20px;
  padding:18px 16px;min-height:30vh;cursor:pointer;color:var(--tiza);text-align:center;
  display:flex;align-items:center;justify-content:center;
  transition:background .12s ease,border-color .12s ease;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation}
.espejo-mitad:active{background:var(--alto);border-color:rgba(255,246,233,.35)}
.espejo-mitad.arriba{transform:rotate(180deg)}
.espejo-contenido{display:flex;flex-direction:column;gap:12px;align-items:center;max-width:100%}
.espejo-preg{font-size:17.5px;font-weight:600;line-height:1.35;overflow-wrap:break-word}
.espejo-toca{color:#1A1140;font-family:'Fredoka',sans-serif;font-weight:700;
  border-radius:999px;padding:11px 20px;font-size:15px;box-shadow:0 5px 0 rgba(0,0,0,.26)}
.buzz-nombre{font-family:'Fredoka',sans-serif;font-weight:700;font-size:34px;line-height:1.1;margin-top:6px}

/* --- finalistas y campeón --- */
.versus{display:flex;flex-direction:column;gap:12px;margin:26px 0 18px;align-items:stretch}
.versus-eq{border-radius:18px;padding:22px 16px;font-family:'Fredoka',sans-serif;font-weight:700;
  font-size:22px;color:#1A1140;box-shadow:0 8px 0 rgba(0,0,0,.24);line-height:1.15;word-break:break-word}
.versus-vs{font-family:'Fredoka',sans-serif;font-weight:700;font-size:18px;color:var(--humo);
  letter-spacing:.2em;align-self:center}
.campeon-zona{position:relative}
.trofeo{font-size:74px;line-height:1;margin-top:16px;animation:flota 2.2s ease-in-out infinite alternate;
  filter:drop-shadow(0 10px 24px rgba(255,212,71,.35))}
.trofeo.apagado{animation:none;filter:none}
.campeon-nombre{font-size:clamp(34px,10vw,52px);margin-top:6px}
.marcador-final{display:flex;gap:12px;justify-content:center;margin-top:24px}
.marcador-final-eq{background:var(--panel);border:1px solid var(--borde);border-radius:16px;
  padding:14px 18px;min-width:130px;text-align:center}
.marcador-final-eq .kernels{margin-top:10px}
.festejo{position:fixed;inset:0;pointer-events:none;z-index:5;overflow:hidden}
.papelito{position:absolute;top:-24px;border-radius:3px;opacity:.95;
  animation-name:caer;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes caer{to{transform:translateY(108vh) rotate(calc(var(--giro) * 640deg))}}

/* --- modal --- */
.tapa{position:fixed;inset:0;z-index:60;background:rgba(9,5,28,.72);backdrop-filter:blur(4px);
  display:flex;align-items:flex-end;justify-content:center;padding:16px}
.tapa-panel{width:100%;max-width:520px;background:var(--panel);border:1px solid var(--borde);
  border-radius:24px;padding:26px 22px calc(22px + env(safe-area-inset-bottom));text-align:center;
  animation:sube .18s ease}
@keyframes sube{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}
.tapa-emoji{font-size:38px;margin-bottom:10px}

@media (min-width:640px){ .tapa{align-items:center} }
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}}
`;


/* ============================================================
   UTILIDADES
   ============================================================ */

const CATS = [...new Set(PREGUNTAS.map((q) => q.c))];
const LETRAS = ["A", "B", "C", "D", "E"];
const COLORES = ["#FFD447", "#FF5D8F", "#4EE1B0", "#7CB6FF", "#C99CFF", "#FFA94D"];
const PUNTOS_FINAL = 3;
const PRUEBAS_IMAGEN = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/250px-Flag_of_Argentina.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-starry_night_ballance1.jpg/250px-VanGogh-starry_night_ballance1.jpg",
  "obras/noche.jpg",
];

const RONDAS = [
  { nombre: "Letras, música y Córdoba", corto: "Letras y Córdoba", cats: ["Literatura", "Música", "Cultura general", "Córdoba", "Arte", "Mundo", "Banderas"] },
  { nombre: "Deportes, cine y espectáculos", corto: "Deportes y pantalla", cats: ["Deportes", "Cine y series", "TV y espectáculos"] },
  { nombre: "Historia, ciencias y frases célebres", corto: "Historia y ciencias", cats: ["Historia", "Ciencia", "Astronomía", "Quién dijo"] },
];

// huella estable de una pregunta, para recordar cuáles ya salieron entre partidas
function huella(t) {
  let h = 5381;
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
  return h.toString(36);
}

function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// toma preguntas repartiendo en partes iguales entre categorías,
// para que ninguna (por ejemplo Literatura) quede afuera por azar
function tomarBalanceado(lista, cantidad, prioridad = []) {
  const porCat = {};
  lista.forEach((q) => { (porCat[q.c] = porCat[q.c] || []).push(q); });
  // las categorías prioritarias entran dos veces en la rueda: salen con más frecuencia
  const cats = mezclar(Object.keys(porCat));
  prioridad.forEach((c) => { if (porCat[c]) cats.unshift(c); });
  const out = [];
  while (out.length < cantidad) {
    let tomo = false;
    for (const c of cats) {
      if (porCat[c].length) {
        out.push(porCat[c].shift());
        tomo = true;
        if (out.length >= cantidad) break;
      }
    }
    if (!tomo) break;
  }
  return out;
}

function armarRonda(pool, usadas, cantidad = 12, cats = null, vistas = new Set(), temasPrevios = new Set()) {
  let libres = pool.filter((q) => !usadas.has(q.uid));
  if (cats) {
    const tematicas = libres.filter((q) => cats.includes(q.c));
    if (tematicas.length >= cantidad) libres = tematicas;
  }
  // primero las que nunca salieron en ninguna partida; las repetidas van al fondo
  const priorizar = (l) => [
    ...mezclar(l.filter((q) => !vistas.has(q.h))),
    ...mezclar(l.filter((q) => vistas.has(q.h))),
  ];
  const abiertas = priorizar(libres.filter((q) => q.t === "ab" || q.t === "ord"));
  const cerradas = priorizar(libres.filter((q) => q.t === "mc"));
  const vf = priorizar(libres.filter((q) => q.t === "vf"));
  // si de un formato quedan muy pocas, pedir la cuota fija haría que salgan siempre las mismas
  const cupo = (lista, deseado) => Math.min(deseado, Math.max(0, Math.floor(lista.length / 5)), lista.length);
  const prioridad = cats && cats.includes("Literatura") ? ["Literatura", "Arte"] : [];
  const sel = [
    ...tomarBalanceado(abiertas, Math.max(cupo(abiertas, 5), Math.min(5, abiertas.length)), prioridad),
    ...tomarBalanceado(cerradas, Math.max(cupo(cerradas, 5), Math.min(5, cerradas.length)), prioridad),
    ...tomarBalanceado(vf, cupo(vf, 2), prioridad),
  ];
  const resto = priorizar(libres.filter((q) => !sel.includes(q)));
  while (sel.length < cantidad && resto.length) sel.push(resto.shift());
  // dos preguntas del mismo tema en una ronda se delatan entre sí
  const grupos = new Set(temasPrevios);
  const limpias = [];
  const repetidas = [];
  for (const q of sel) {
    if (q.g && grupos.has(q.g)) { repetidas.push(q); continue; }
    if (q.g) grupos.add(q.g);
    limpias.push(q);
  }
  for (const q of resto) {
    if (limpias.length >= cantidad) break;
    if (limpias.includes(q)) continue;
    if (q.g && grupos.has(q.g)) continue;
    if (q.g) grupos.add(q.g);
    limpias.push(q);
  }
  while (limpias.length < cantidad && repetidas.length) limpias.push(repetidas.pop());
  // garantizar que ninguna categoría del tema quede afuera de la ronda
  const presentes = new Set(limpias.map((q) => q.c));
  for (const c of new Set(libres.map((q) => q.c))) {
    if (presentes.has(c)) continue;
    const cand = priorizar(libres.filter((q) => q.c === c && !limpias.includes(q) && !(q.g && grupos.has(q.g))))[0];
    if (!cand) continue;
    const cuenta = {};
    limpias.forEach((q) => { cuenta[q.c] = (cuenta[q.c] || 0) + 1; });
    const mayor = Object.keys(cuenta).sort((x, y) => cuenta[y] - cuenta[x])[0];
    const i = limpias.findIndex((q) => q.c === mayor);
    if (i >= 0) {
      limpias[i] = cand;
      presentes.add(c);
      if (cand.g) grupos.add(cand.g);
    }
  }
  // garantizar un par de preguntas con cuadro cuando la ronda incluye Arte
  if (cats && cats.includes("Arte")) {
    const conCuadro = limpias.filter((q) => q.img).length;
    const faltan = 2 - conCuadro;
    for (let k = 0; k < faltan; k++) {
      const cand = mezclar(
        libres.filter((q) => q.img && !limpias.includes(q) && !(q.g && grupos.has(q.g)))
      )[0];
      if (!cand) break;
      // se reemplaza una de la categoría más repetida que no sea de Arte
      const cuenta = {};
      limpias.forEach((q) => { cuenta[q.c] = (cuenta[q.c] || 0) + 1; });
      const mayor = Object.keys(cuenta)
        .filter((c) => c !== "Arte" && cuenta[c] > 1)
        .sort((x, y) => cuenta[y] - cuenta[x])[0];
      const i = limpias.findIndex((q) => q.c === mayor);
      if (i < 0) break;
      limpias[i] = cand;
      if (cand.g) grupos.add(cand.g);
    }
  }
  return mezclar(limpias).slice(0, cantidad);
}

/* ============================================================
   PIEZAS DE INTERFAZ
   ============================================================ */

/* ============================================================
   IMÁGENES DE OBRAS (Met Museum Open Access, CC0)
   ============================================================ */

/* Qué clase de imagen es, para darle el encuadre que le corresponde. */
function altDe(q) {
  if (q.c === "Banderas") return "Bandera";
  if ((q.g || "").startsWith("prov-")) return "Mapa";
  return "Obra a identificar";
}

function ImagenObra({ url, alt }) {
  const fuentes = Array.isArray(url) ? url : [url];
  const [i, setI] = useState(0);
  const [estado, setEstado] = useState("cargando");
  const [detalle, setDetalle] = useState(false);

  useEffect(() => { setI(0); setEstado("cargando"); setDetalle(false); }, [fuentes[0]]);

  function fallo() {
    if (i + 1 < fuentes.length) { setI(i + 1); setEstado("cargando"); }
    else setEstado("error");
  }

  if (estado === "error") {
    return (
      <div className="obra obra-falla">
        <span className="eyebrow">No se pudo cargar la imagen</span>
        <p className="ayuda">Pueden saltear esta pregunta.</p>
        <button className="btn btn-borde chico" style={{ marginTop: 10 }}
          onClick={() => setDetalle(!detalle)}>
          {detalle ? "Ocultar detalle" : "Ver detalle técnico"}
        </button>
        {detalle && (
          <p className="diag">
            Se probaron {fuentes.length} direcciones. La última fue:<br />
            <span className="mono">{fuentes[fuentes.length - 1]}</span>
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={"obra" + (alt === "Bandera" ? " bandera" : alt === "Mapa" ? " mapa" : "")}>
      {estado !== "ok" && <div className="obra-esqueleto" />}
      <img key={fuentes[i]} src={fuentes[i]} alt={alt || "Obra de arte"}
        loading="eager"
        style={{ display: estado === "ok" ? "block" : "none" }}
        onLoad={() => setEstado("ok")} onError={fallo} />
    </div>
  );
}

function Logo({ size = 46 }) {
  return (
    <span className="logo" style={{ width: size, height: size, fontSize: size * 0.54 }} aria-hidden="true">
      🍿
    </span>
  );
}

function Tapa({ children, accion }) {
  return (
    <div className="tapa" role="dialog" aria-modal="true">
      <div className="tapa-panel">{children}{accion}</div>
    </div>
  );
}

function BarraJuego({ titulo, detalle, onSalir, equipos }) {
  return (
    <header className="barra">
      <div className="tb-wrap barra-in">
        <div className="barra-fila">
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow">{titulo}</div>
            <div className="barra-detalle">{detalle}</div>
          </div>
          <button className="salir" onClick={onSalir} aria-label="Salir de la partida">✕</button>
        </div>
        {equipos && (
          <div className="marcador">
            {equipos.map((e) => (
              <div className="marca" key={e.id}>
                <span className="marca-nm">{e.nombre}</span>
                <span className="marca-pt" style={{ color: e.color }}>{e.puntos}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function Enunciado({ pregunta }) {
  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <span className="tag">{pregunta.c}</span>
        <span className="tag tag-pts">{pregunta.p} {pregunta.p === 1 ? "punto" : "puntos"}</span>
      </div>
      <p className="pregunta">{pregunta.q}</p>
      {pregunta.img && <ImagenObra url={pregunta.img} alt={altDe(pregunta)} />}
    </>
  );
}

function Respuesta({ pregunta }) {
  return (
    <div className="respuesta">
      <div className="eyebrow" style={{ marginBottom: 6 }}>Respuesta</div>
      <div className="respuesta-txt">
        {Array.isArray(pregunta.a) ? pregunta.a.join("  →  ") : pregunta.a}
      </div>
      {pregunta.titulo && <p className="ficha">{pregunta.titulo}</p>}
      {pregunta.n && <p className="nota">{pregunta.n}</p>}
    </div>
  );
}

function Pregunta({ pregunta, equipos, solo, onResolver, encabezado, segundos, etiquetaAccion }) {
  const [elegida, setElegida] = useState(null);
  const [revelada, setRevelada] = useState(false);
  const [orden, setOrden] = useState([]);
  const [aciertos, setAciertos] = useState([]);
  const [reloj, setReloj] = useState(segundos || 0);

  const opciones = useMemo(() => {
    if (pregunta.t === "mc") return mezclar(pregunta.o);
    if (pregunta.t === "vf") return ["Verdadero", "Falso"];
    if (pregunta.t === "ord") return mezclar(pregunta.o);
    return null;
  }, [pregunta]);

  useEffect(() => {
    setElegida(null); setRevelada(false); setOrden([]); setAciertos([]); setReloj(segundos || 0);
  }, [pregunta, segundos]);

  useEffect(() => {
    if (!segundos || revelada) return;
    if (reloj <= 0) { setRevelada(true); return; }
    const t = setTimeout(() => setReloj((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [reloj, segundos, revelada]);

  function elegirOpcion(op) {
    if (revelada) return;
    setElegida(op);
    setRevelada(true);
    if (solo) setAciertos(op === pregunta.a ? [equipos[0].id] : []);
  }

  function tocarOrden(op) {
    if (revelada) return;
    if (orden.includes(op)) { setOrden(orden.filter((x) => x !== op)); return; }
    const nuevo = [...orden, op];
    setOrden(nuevo);
    if (nuevo.length === pregunta.o.length) {
      setRevelada(true);
      if (solo) setAciertos(nuevo.every((v, i) => v === pregunta.a[i]) ? [equipos[0].id] : []);
    }
  }

  return (
    <div className="tb-wrap contenido">
      {encabezado}

      {segundos > 0 && !revelada && (
        <div className="reloj-linea">
          <div className="reloj-barra"><span style={{ width: `${(reloj / segundos) * 100}%` }} /></div>
          <span className="mono">{reloj}s</span>
        </div>
      )}

      <section className="tarjeta">
        <Enunciado pregunta={pregunta} />

        {opciones && pregunta.t !== "ord" && (
          <div className="stack" style={{ marginTop: 18 }}>
            {opciones.map((op, i) => {
              let cls = "opt";
              if (revelada && op === pregunta.a) cls += " ok";
              else if (revelada && op === elegida) cls += " mal";
              return (
                <button key={op} className={cls} onClick={() => elegirOpcion(op)} disabled={revelada}>
                  <span className="letra">{revelada && op === pregunta.a ? "✓" : revelada && op === elegida ? "✕" : LETRAS[i]}</span>
                  <span>{op}</span>
                </button>
              );
            })}
          </div>
        )}

        {pregunta.t === "ord" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <p className="ayuda">Tocá en el orden correcto. Tocá de nuevo para sacar.</p>
            {opciones.map((op) => {
              const pos = orden.indexOf(op);
              let cls = "opt" + (pos >= 0 ? " tomada" : "");
              if (revelada) cls = "opt " + (pos >= 0 && pregunta.a[pos] === op ? "ok" : pos >= 0 ? "mal" : "");
              return (
                <button key={op} className={cls} onClick={() => tocarOrden(op)}>
                  <span className="letra">{pos >= 0 ? pos + 1 : "·"}</span>
                  <span>{op}</span>
                </button>
              );
            })}
          </div>
        )}

        {!opciones && !revelada && (
          <button className="btn btn-primario" style={{ marginTop: 22 }} onClick={() => setRevelada(true)}>
            Ver respuesta
          </button>
        )}

        {revelada && <Respuesta pregunta={pregunta} />}
      </section>

      {/* Si la pregunta tiene opciones, la app ya sabe si acertaste: no hace falta preguntar. */}
      {revelada && solo && opciones && (
        <>
          <div className="veredicto" data-ok={aciertos.length ? "si" : "no"}>
            {aciertos.length ? "¡La sacaste!" : "Esta no salió"}
          </div>
          <button className="btn btn-primario grande" style={{ marginTop: 12 }}
            onClick={() => onResolver(aciertos, pregunta.p)}>
            {etiquetaAccion || "Siguiente"}
          </button>
        </>
      )}

      {revelada && solo && !opciones && (
        <section className="tarjeta tarjeta-suave">
          <div className="eyebrow centro" style={{ marginBottom: 14 }}>¿Cómo te fue?</div>
          <div className="grid2 veredicto-botones">
            <button className="juzgar bien" onClick={() => onResolver([equipos[0].id], pregunta.p)}>
              <span className="juzgar-icono" aria-hidden="true">✓</span>
              <span>La saqué</span>
            </button>
            <button className="juzgar mal" onClick={() => onResolver([], pregunta.p)}>
              <span className="juzgar-icono" aria-hidden="true">✕</span>
              <span>No la saqué</span>
            </button>
          </div>
        </section>
      )}

      {revelada && !solo && (
        <section className="tarjeta tarjeta-suave">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Marcá quiénes la sacaron</div>
          <div className="stack">
            {equipos.map((e) => (
              <button key={e.id} className={"opt chico" + (aciertos.includes(e.id) ? " ok" : "")}
                onClick={() => setAciertos((a) => (a.includes(e.id) ? a.filter((x) => x !== e.id) : [...a, e.id]))}>
                <span className="letra" style={{ color: e.color }}>{aciertos.includes(e.id) ? "✓" : "○"}</span>
                <span>{e.nombre}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primario" style={{ marginTop: 16 }} onClick={() => onResolver(aciertos, pregunta.p)}>
            {etiquetaAccion || "Siguiente pregunta"}
          </button>
        </section>
      )}
    </div>
  );
}

/* ============================================================
   FINAL A PULSADOR: primero en llegar a 3 puntos
   ============================================================ */

function Final({ pregunta, equipos, puntos, numero, onResolver }) {
  const [quien, setQuien] = useState(null);
  const [fase, setFase] = useState("pulsar");
  const [reloj, setReloj] = useState(30);
  const [bloqueado, setBloqueado] = useState(false);
  const primero = quien ? equipos.find((e) => e.id === quien) : null;

  useEffect(() => { setQuien(null); setFase("pulsar"); setReloj(30); setBloqueado(false); }, [pregunta]);

  function buzz(id) {
    if (bloqueado) return;
    setQuien(id);
    setFase("buzz");
    setBloqueado(true);
    // ventana de gracia: se ignora todo toque durante el manotazo
    setTimeout(() => setBloqueado(false), 900);
  }

  useEffect(() => {
    if (fase !== "responder") return;
    if (reloj <= 0) { setFase("juzgar"); return; }
    const t = setTimeout(() => setReloj((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, reloj]);

  return (
    <div className="tb-wrap contenido">
      <div className="meta-final">
        <span className="eyebrow">Pregunta {numero}</span>
        <span className="eyebrow">Gana el primero en llegar a {PUNTOS_FINAL}</span>
      </div>

      <div className="tanteador">
        {equipos.map((e) => (
          <div className="tanteador-eq" key={e.id}>
            <span className="marca-nm">{e.nombre}</span>
            <div className="kernels">
              {Array.from({ length: PUNTOS_FINAL }, (_, i) => (
                <span key={i} className={"kernel" + ((puntos[e.id] || 0) > i ? " lleno" : "")}
                  style={{ background: (puntos[e.id] || 0) > i ? e.color : undefined }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {fase !== "pulsar" && (
        <section className="tarjeta">
          <Enunciado pregunta={pregunta} />
          {fase === "juzgar" && <Respuesta pregunta={pregunta} />}
        </section>
      )}

      {fase === "pulsar" && (
        <>
          <p className="ayuda centro">
            Teléfono en el medio de la mesa, un jugador de cada lado: cada mitad muestra la
            pregunta derecha para su lado. El primero que toca la suya, responde.
          </p>
          <div className="espejo">
            <button className="espejo-mitad arriba" onClick={() => buzz(equipos[0].id)}>
              <span className="espejo-contenido">
                <span className="tag">{pregunta.c}</span>
                <span className="espejo-preg">{pregunta.q}</span>
                {pregunta.img && <ImagenObra url={pregunta.img} alt={altDe(pregunta)} />}
                <span className="espejo-toca" style={{ background: equipos[0].color }}>
                  ¡Tocá acá, {equipos[0].nombre}!
                </span>
              </span>
            </button>
            <button className="espejo-mitad" onClick={() => buzz(equipos[1].id)}>
              <span className="espejo-contenido">
                <span className="tag">{pregunta.c}</span>
                <span className="espejo-preg">{pregunta.q}</span>
                {pregunta.img && <ImagenObra url={pregunta.img} alt={altDe(pregunta)} />}
                <span className="espejo-toca" style={{ background: equipos[1].color }}>
                  ¡Tocá acá, {equipos[1].nombre}!
                </span>
              </span>
            </button>
          </div>
        </>
      )}

      {fase === "buzz" && primero && (
        <section className="tarjeta centro" style={{ borderColor: primero.color, borderWidth: 2 }}>
          <div className="eyebrow">Tocó primero</div>
          <div className="buzz-nombre" style={{ color: primero.color }}>{primero.nombre}</div>
          <div className="stack" style={{ marginTop: 16, pointerEvents: bloqueado ? "none" : "auto", opacity: bloqueado ? 0.55 : 1 }}>
            <button className="btn btn-primario grande" onClick={() => { setFase("responder"); setReloj(30); }}>
              Responder · 30 segundos
            </button>
            <button className="btn btn-borde" onClick={() => { setQuien(null); setFase("pulsar"); }}>
              Fue sin querer, volver a armar
            </button>
          </div>
        </section>
      )}

      {fase === "responder" && (
        <section className="tarjeta tarjeta-suave centro">
          <div className="eyebrow">Responde {primero.nombre}</div>
          <div className={"cuenta " + (reloj > 10 ? "calma" : "")}>{reloj}</div>
          <p className="ayuda">segundos para decirlo en voz alta</p>
          <button className="btn" onClick={() => setFase("juzgar")}>Ya respondimos</button>
        </section>
      )}

      {fase === "juzgar" && (
        <section className="tarjeta tarjeta-suave">
          <div className="eyebrow" style={{ marginBottom: 12 }}>¿{primero.nombre} acertó?</div>
          <div className="grid2">
            <button className="btn btn-si" onClick={() => onResolver(quien)}>Acertó</button>
            <button className="btn btn-no" onClick={() => onResolver(null)}>Erró</button>
          </div>
          <p className="nota">Si erró, la pregunta queda sin punto y pasa la siguiente.</p>
        </section>
      )}
    </div>
  );
}

/* ============================================================
   SEMIFINAL: ruleta de categorías, 3 turnos y desempates
   ============================================================ */

const ICONOS = {
  "Córdoba": "⛰️", Historia: "🏛️", Ciencia: "🔬", "Astronomía": "🔭", "Música": "🎵", Literatura: "📚",
  "Cine y series": "🎬", "TV y espectáculos": "📺", Deportes: "⚽", Mundo: "🌍",
  Arte: "🎨", "Cultura general": "💡", Banderas: "🏳️", "Quién dijo": "💬",
};
const COLORES_RULETA = ["#FFD447", "#FF5D8F", "#4EE1B0", "#7CB6FF", "#C99CFF", "#FFA94D"];

function Ruleta({ cats, onResultado }) {
  const [angulo, setAngulo] = useState(0);
  const [girando, setGirando] = useState(false);
  const n = cats.length;
  const seg = 360 / n;

  function girar() {
    if (girando) return;
    const nuevo = angulo + 5 * 360 + Math.random() * 360;
    setAngulo(nuevo);
    setGirando(true);
    setTimeout(() => {
      setGirando(false);
      const norm = ((nuevo % 360) + 360) % 360;
      const idx = Math.floor(((360 - norm) % 360) / seg) % n;
      onResultado(cats[idx]);
    }, 3400);
  }

  const rad = (g) => (g * Math.PI) / 180;
  return (
    <div className="ruleta-zona">
      <div className="ruleta-puntero" aria-hidden="true">▼</div>
      <svg viewBox="0 0 200 200" className="ruleta"
        style={{ transform: `rotate(${angulo}deg)`, transition: girando ? "transform 3.3s cubic-bezier(.12,.68,.16,1)" : "none" }}>
        {cats.map((c, i) => {
          const a0 = i * seg - 90, a1 = (i + 1) * seg - 90, mid = (a0 + a1) / 2;
          const x0 = 100 + 96 * Math.cos(rad(a0)), y0 = 100 + 96 * Math.sin(rad(a0));
          const x1 = 100 + 96 * Math.cos(rad(a1)), y1 = 100 + 96 * Math.sin(rad(a1));
          const tx = 100 + 66 * Math.cos(rad(mid)), ty = 100 + 66 * Math.sin(rad(mid));
          return (
            <g key={c}>
              <path d={`M100 100 L${x0} ${y0} A96 96 0 ${seg > 180 ? 1 : 0} 1 ${x1} ${y1} Z`}
                fill={COLORES_RULETA[i % COLORES_RULETA.length]} stroke="rgba(0,0,0,.28)" strokeWidth="1" />
              <text x={tx} y={ty} fontSize="14" textAnchor="middle" dominantBaseline="middle">{ICONOS[c] || "❓"}</text>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="15" fill="#181243" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
      </svg>
      <button className="btn btn-primario grande" style={{ marginTop: 18 }} onClick={girar} disabled={girando}>
        {girando ? "Girando…" : "Girar la ruleta"}
      </button>
    </div>
  );
}

function Semifinal({ pool, usadasIniciales, equipos, onFinalistas, vistasGlobal = new Set(), marcarVistas = () => {}, temasPrevios = new Set() }) {
  const [usadas, setUsadas] = useState(() => new Set(usadasIniciales));
  const [pts, setPts] = useState(() => Object.fromEntries(equipos.map((e) => [e.id, 0])));
  const [modo, setModo] = useState("clasificacion"); // clasificacion | eliminacion
  const [numero, setNumero] = useState(1);
  const [qual, setQual] = useState([]);       // ya clasificados a la final
  const [contenders, setContenders] = useState(() => equipos.map((e) => e.id));
  const [spots, setSpots] = useState(2);
  const [fase, setFase] = useState("ruleta");
  const [pregunta, setPregunta] = useState(null);
  const [quienTira, setQuienTira] = useState(() => equipos[Math.floor(Math.random() * equipos.length)].id);
  const [aviso, setAviso] = useState(null);

  const activos = equipos.filter((e) => contenders.includes(e.id));
  const tirador = equipos.find((e) => e.id === quienTira);
  const nombreDe = (id) => equipos.find((e) => e.id === id).nombre;
  const nombres = (ids) => ids.map(nombreDe).join(" y ");

  const cats = useMemo(
    () => [...new Set(pool.filter((q) => !usadas.has(q.uid) && q.t !== "ord").map((q) => q.c))],
    [pool, usadas]
  );

  function sortearTirador(ids) {
    setQuienTira(ids[Math.floor(Math.random() * ids.length)]);
  }

  function elegirPregunta(cat) {
    const libre = (q) => !usadas.has(q.uid) && !(q.g && temasPrevios.has(q.g)) && q.t !== "ord";
    let cand = pool.filter((q) => libre(q) && q.c === cat);
    if (!cand.length) cand = pool.filter(libre);
    if (!cand.length) cand = pool.filter((q) => !usadas.has(q.uid) && q.t !== "ord");
    const frescas = cand.filter((q) => !vistasGlobal.has(q.h));
    const fuente = frescas.length ? frescas : cand;
    const q = fuente[Math.floor(Math.random() * fuente.length)];
    marcarVistas([q]);
    setUsadas((u) => new Set([...u, q.uid]));
    setPregunta(q);
    setFase("pregunta");
  }

  function registrar(ids) {
    setPregunta(null);
    setFase("ruleta");
    if (modo === "clasificacion") {
      const nuevos = { ...pts };
      ids.forEach((id) => { nuevos[id] = (nuevos[id] || 0) + 1; });
      setPts(nuevos);
      if (numero < 3) { setNumero(numero + 1); sortearTirador(contenders); return; }
      evaluar(nuevos);
    } else {
      aplicarEliminacion(ids);
    }
  }

  function evaluar(p) {
    const max = Math.max(...equipos.map((e) => p[e.id]));
    const lideres = equipos.filter((e) => p[e.id] === max).map((e) => e.id);
    // caso 1: exactamente dos con la mayor cantidad → pasan los dos
    if (lideres.length === 2) { onFinalistas(lideres, usadas); return; }
    setModo("eliminacion");
    if (lideres.length === 1) {
      // caso 2: un líder claro pasa; el resto define el otro lugar
      const resto = equipos.filter((e) => e.id !== lideres[0]).map((e) => e.id);
      setQual(lideres);
      setContenders(resto);
      setSpots(1);
      sortearTirador(resto);
      setAviso(`${nombreDe(lideres[0])} ya está en la final. ${nombres(resto)} definen el lugar que queda con preguntas de a una: el que responde mal queda afuera, y si nadie acierta se hace otra.`);
    } else {
      // caso 3: más de dos empatados arriba → rondas de una pregunta hasta que queden dos
      setQual([]);
      setContenders(lideres);
      setSpots(2);
      sortearTirador(lideres);
      setAviso(`Empate entre ${nombres(lideres)}. Preguntas de a una hasta que queden dos: el que responde mal queda afuera, y si aciertan o fallan todos se hace otra.`);
    }
  }

  function aplicarEliminacion(ids) {
    const bien = contenders.filter((id) => ids.includes(id));
    const mal = contenders.filter((id) => !ids.includes(id));
    // nadie acertó: se repite con los mismos
    if (bien.length === 0) {
      sortearTirador(contenders);
      setAviso("Nadie acertó. Va otra pregunta.");
      return;
    }
    // acertaron justo los que se necesitan: clasifican y se termina
    if (bien.length === spots) {
      onFinalistas([...qual, ...bien], usadas);
      return;
    }
    // acertaron más de los lugares disponibles: los que erraron quedan afuera y siguen los demás
    if (bien.length > spots) {
      setContenders(bien);
      sortearTirador(bien);
      setAviso(mal.length
        ? `${nombres(mal)} queda${mal.length > 1 ? "n" : ""} afuera. Siguen ${nombres(bien)} por ${spots === 1 ? "el lugar que queda" : "los lugares que quedan"}.`
        : "Acertaron todos. Va otra pregunta.");
      return;
    }
    // acertaron menos que los lugares: los que acertaron clasifican y los demás siguen por el resto
    setQual([...qual, ...bien]);
    setSpots(spots - bien.length);
    setContenders(mal);
    sortearTirador(mal);
    setAviso(`${nombres(bien)} pasa a la final. ${nombres(mal)} siguen por el lugar que queda.`);
  }

  const estadoDe = (e) => (qual.includes(e.id) ? "final" : contenders.includes(e.id) ? "juega" : "afuera");

  return (
    <div className="tb-wrap contenido">
      <div className="tanteador" style={{ gridTemplateColumns: `repeat(${equipos.length}, 1fr)` }}>
        {equipos.map((e) => {
          const st = estadoDe(e);
          return (
            <div className="tanteador-eq" key={e.id}
              style={st === "final" ? { borderColor: e.color } : st === "afuera" ? { opacity: 0.4 } : undefined}>
              <span className="marca-nm">{e.nombre}{st === "final" ? " ✓" : st === "afuera" ? " ✕" : ""}</span>
              <span className="marca-pt" style={{ color: e.color }}>{pts[e.id]}</span>
            </div>
          );
        })}
      </div>

      {aviso && (
        <div className="tarjeta tarjeta-suave centro">
          <div className="eyebrow">{modo === "eliminacion" ? "Desempate" : "Semifinal"}</div>
          <p className="ayuda">{aviso}</p>
          <button className="btn btn-primario" style={{ marginTop: 14 }} onClick={() => setAviso(null)}>Dale</button>
        </div>
      )}

      {!aviso && fase === "ruleta" && tirador && (
        <>
          <div className="tarjeta tarjeta-suave centro" style={{ paddingBottom: 14 }}>
            <div className="eyebrow">
              {modo === "clasificacion" ? `Pregunta ${numero} de 3 · responden todos` : "Desempate · responden los que siguen"}
            </div>
            <p className="pregunta" style={{ marginTop: 6, color: tirador.color }}>
              Tira la ruleta {tirador.nombre}
            </p>
          </div>
          <Ruleta cats={cats} onResultado={elegirPregunta} />
        </>
      )}

      {!aviso && fase === "pregunta" && pregunta && (
        <Pregunta
          pregunta={pregunta}
          equipos={activos}
          solo={false}
          segundos={0}
          onResolver={(ids) => registrar(ids)}
          encabezado={null}
          etiquetaAccion="Continuar"
        />
      )}
    </div>
  );
}

/* ============================================================
   MODO SOLITARIO
   ============================================================ */

const TOPE_SOLITARIO = 20;

function Solitario({ pool, volver, vistasGlobal = new Set(), marcarVistas = () => {} }) {
  const [modo, setModo] = useState("ruleta"); // ruleta | categoria
  const [cat, setCat] = useState("Todas");
  const [tipo, setTipo] = useState("Todos");
  const [actual, setActual] = useState(null);
  const [usadas, setUsadas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [bien, setBien] = useState(0);
  const [total, setTotal] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejor, setMejor] = useState(0);
  const [cerrada, setCerrada] = useState(false);
  const [jugando, setJugando] = useState(false);
  const [fase, setFase] = useState("ruleta"); // ruleta | pregunta
  const [catRuleta, setCatRuleta] = useState(null);

  const cats = ["Todas", ...new Set(pool.map((q) => q.c))];
  const catsRuleta = useMemo(() => [...new Set(pool.map((q) => q.c))], [pool]);

  const filtradas = useMemo(
    () => pool.filter((q) => (cat === "Todas" || q.c === cat) && (tipo === "Todos" || q.t === tipo)),
    [pool, cat, tipo]
  );
  const tope = Math.min(TOPE_SOLITARIO, modo === "ruleta" ? pool.length : filtradas.length);
  const universo = modo === "ruleta" ? pool : filtradas;

  function elegir(deDonde, listaUsadas, gruposUsados) {
    let libres = deDonde.filter((q) => !listaUsadas.includes(q.uid));
    const sinTema = libres.filter((q) => !q.g || !gruposUsados.includes(q.g));
    if (sinTema.length) libres = sinTema;
    if (!libres.length) return null;
    // primero las que nunca salieron en ninguna partida
    const frescas = libres.filter((q) => !vistasGlobal.has(q.h));
    const fuente = frescas.length ? frescas : libres;
    return fuente[Math.floor(Math.random() * fuente.length)];
  }

  function servir(q, listaUsadas, gruposUsados) {
    if (!q) { setActual(null); setCerrada(true); return; }
    marcarVistas([q]);
    setUsadas([...listaUsadas, q.uid]);
    if (q.g) setGrupos([...gruposUsados, q.g]);
    setActual(q);
    setFase("pregunta");
  }

  function arrancar() {
    setBien(0); setTotal(0); setRacha(0); setMejor(0);
    setCerrada(false); setUsadas([]); setGrupos([]); setJugando(true);
    if (modo === "ruleta") { setActual(null); setCatRuleta(null); setFase("ruleta"); }
    else servir(elegir(filtradas, [], []), [], []);
  }

  function desdeRuleta(categoria) {
    setCatRuleta(categoria);
    const deLaCat = pool.filter((q) => q.c === categoria && (tipo === "Todos" || q.t === tipo));
    const q = elegir(deLaCat.length ? deLaCat : pool, usadas, grupos) || elegir(pool, usadas, grupos);
    servir(q, usadas, grupos);
  }

  function registrar(acerto) {
    const nuevoTotal = total + 1;
    setTotal(nuevoTotal);
    if (acerto) {
      setBien((b) => b + 1);
      setRacha((r) => { const n = r + 1; setMejor((m) => Math.max(m, n)); return n; });
    } else setRacha(0);
    if (nuevoTotal >= tope) { setActual(null); setCerrada(true); return; }
    if (modo === "ruleta") { setActual(null); setCatRuleta(null); setFase("ruleta"); }
    else servir(elegir(filtradas, usadas, grupos), usadas, grupos);
  }

  useEffect(() => {
    setActual(null); setUsadas([]); setGrupos([]); setCerrada(false);
    setTotal(0); setBien(0); setRacha(0); setMejor(0); setJugando(false);
  }, [cat, tipo, modo]);

  const pct = total ? Math.round((bien / total) * 100) : 0;

  return (
    <div>
      <BarraJuego
        titulo="Solitario"
        detalle={jugando && !cerrada ? `Pregunta ${total + 1} de ${tope} · ${bien} acierto${bien === 1 ? "" : "s"}` : "Entrenamiento libre"}
        onSalir={volver}
      />
      <div className="tb-wrap contenido">
        {!jugando && !cerrada && (
          <>
            <div className="grid2">
              <button className={"selector chico" + (modo === "ruleta" ? " activo" : "")} onClick={() => setModo("ruleta")}>
                🎡 Con ruleta
              </button>
              <button className={"selector chico" + (modo === "categoria" ? " activo" : "")} onClick={() => setModo("categoria")}>
                🎯 Una categoría
              </button>
            </div>

            {modo === "categoria" && (
              <div className="grid2" style={{ marginTop: 12 }}>
                <label className="campo">
                  <span>Categoría</span>
                  <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
                    {cats.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="campo">
                  <span>Formato</span>
                  <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="Todos">Todos</option>
                    <option value="ab">Sin opciones</option>
                    <option value="mc">Opción múltiple</option>
                    <option value="vf">Verdadero o falso</option>
                    <option value="ord">Ordenar</option>
                  </select>
                </label>
              </div>
            )}

            <p className="ayuda">
              {modo === "ruleta"
                ? `Tirás la ruleta y respondés una pregunta de la categoría que salga. Rondas de ${tope}.`
                : `Rondas de ${tope} preguntas de la categoría elegida.`}
            </p>

            <button className="btn btn-primario grande" style={{ marginTop: 16 }}
              onClick={arrancar} disabled={!universo.length}>
              Empezar la ronda
            </button>
          </>
        )}

        {cerrada && (
          <div className="centro">
            <div className="confeti"><Logo size={64} /></div>
            <p className="eyebrow" style={{ marginTop: 16 }}>Ronda terminada</p>
            <h2 className="titulo" style={{ color: "var(--manteca)" }}>{bien} de {total}</h2>
            <p className="bajada">{pct} % de efectividad</p>
            <div className="stats">
              <div><strong>{bien}</strong><span>aciertos</span></div>
              <div><strong>{total - bien}</strong><span>erradas</span></div>
              <div><strong>{mejor}</strong><span>mejor racha</span></div>
            </div>
            <div className="stack" style={{ marginTop: 22 }}>
              <button className="btn btn-primario grande" onClick={arrancar}>Otra ronda</button>
              <button className="btn btn-borde" onClick={() => { setCerrada(false); setJugando(false); setTotal(0); setBien(0); }}>
                Cambiar modo
              </button>
            </div>
          </div>
        )}

        {jugando && !cerrada && (
          <div className="progreso" style={{ marginTop: 4 }}>
            {Array.from({ length: tope }, (_, i) => (
              <span key={i} className={"paso " + (i < total ? "hecho" : i === total ? "actual" : "")} />
            ))}
          </div>
        )}

        {jugando && !cerrada && fase === "ruleta" && modo === "ruleta" && (
          <>
            <div className="tarjeta tarjeta-suave centro" style={{ paddingBottom: 14 }}>
              <div className="eyebrow">Pregunta {total + 1} de {tope}</div>
              <p className="pregunta" style={{ marginTop: 6 }}>¿Qué te toca?</p>
            </div>
            <Ruleta cats={catsRuleta} onResultado={desdeRuleta} />
          </>
        )}
      </div>

      {jugando && !cerrada && fase === "pregunta" && actual && (
        <Pregunta
          key={actual.uid}
          pregunta={actual}
          equipos={[{ id: 1, nombre: "Contala como acierto", puntos: 0, color: "#4EE1B0" }]}
          solo
          segundos={0}
          onResolver={(ids) => registrar(ids.length > 0)}
          encabezado={catRuleta ? <div className="eyebrow centro">Salió {ICONOS[catRuleta] || ""} {catRuleta}</div> : null}
          etiquetaAccion={total + 1 >= tope ? "Terminar la ronda" : "Siguiente"}
        />
      )}
    </div>
  );
}

/* ============================================================
   FESTEJO DEL CAMPEÓN
   ============================================================ */

function Festejo({ color }) {
  const piezas = useMemo(() => {
    const paleta = [color, "#FFD447", "#FF5D8F", "#4EE1B0", "#7CB6FF", "#FFF6E9"];
    return Array.from({ length: 28 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      dur: 3.2 + Math.random() * 2.4,
      size: 7 + Math.random() * 8,
      color: paleta[i % paleta.length],
      giro: Math.random() > 0.5 ? 1 : -1,
    }));
  }, [color]);
  return (
    <div className="festejo" aria-hidden="true">
      {piezas.map((p, i) => (
        <span key={i} className="papelito" style={{
          left: p.left + "%",
          width: p.size,
          height: p.size * 1.6,
          background: p.color,
          animationDelay: p.delay + "s",
          animationDuration: p.dur + "s",
          "--giro": p.giro,
        }} />
      ))}
    </div>
  );
}

export default function TriviaYPururu() {
  const [pantalla, setPantalla] = useState("inicio");
  const [equipos, setEquipos] = useState([
    { id: 1, nombre: "Jugador 1", puntos: 0, color: COLORES[0] },
    { id: 2, nombre: "Jugador 2", puntos: 0, color: COLORES[1] },
  ]);
  const [cantEquipos, setCantEquipos] = useState(2);
  const [conReloj, setConReloj] = useState(false);
  const [vistas, setVistas] = useState(new Set());
  const [obrasOk, setObrasOk] = useState(null); // null = probando
  const [temasPartida, setTemasPartida] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const [ronda, setRonda] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [usadas, setUsadas] = useState(new Set());
  const [vivos, setVivos] = useState([]);
  const [ptsFinal, setPtsFinal] = useState({});

  const pool = useMemo(() => {
    const todas = PREGUNTAS.map((q, i) => ({ ...q, uid: "b" + i, h: huella(q.q + (q.g || "")) }));
    const remota = (q) => {
      if (!q.img) return false;
      const primera = Array.isArray(q.img) ? q.img[0] : q.img;
      return !String(primera || "").startsWith("data:");
    };
    // Las imágenes embebidas (data:) andan siempre, aunque la red bloquee las remotas.
    return obrasOk === false ? todas.filter((q) => !remota(q)) : todas;
  }, [obrasOk]);

  // Probamos varias imágenes al abrir. Solo si fallan todas se apagan las preguntas con imagen.
  useEffect(() => {
    let i = 0;
    const prueba = new Image();
    const corte = setTimeout(() => { prueba.src = ""; setObrasOk(true); }, 15000);
    prueba.onload = () => { clearTimeout(corte); setObrasOk(true); };
    prueba.onerror = () => {
      i += 1;
      if (i < PRUEBAS_IMAGEN.length) { prueba.src = PRUEBAS_IMAGEN[i]; return; }
      clearTimeout(corte);
      setObrasOk(false);
    };
    prueba.src = PRUEBAS_IMAGEN[0];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const v = await window.storage.get("trivia:vistas");
        if (v && v.value) setVistas(new Set(JSON.parse(v.value)));
      } catch (e) { /* primera vez */ }
      setCargando(false);
    })();
  }, []);

  function marcarVistas(qs) {
    setVistas((prev) => {
      let n = new Set(prev);
      qs.forEach((q) => { if (q.h) n.add(q.h); });
      // si ya salió casi todo el banco, se reinicia la rotación
      if (n.size > pool.length * 0.85) n = new Set(qs.map((q) => q.h));
      window.storage.set("trivia:vistas", JSON.stringify([...n])).catch(() => {});
      return n;
    });
  }


  function armarEquipos(n) {
    setCantEquipos(n);
    setEquipos((prev) => Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      nombre: (prev[i] && prev[i].nombre) || `Jugador ${i + 1}`,
      puntos: 0,
      color: COLORES[i % COLORES.length],
    })));
  }

  function empezar() {
    const nuevas = armarRonda(pool, new Set(), 12, RONDAS[0].cats, vistas);
    marcarVistas(nuevas);
    setTemasPartida(new Set(nuevas.filter((q) => q.g).map((q) => q.g)));
    setUsadas(new Set(nuevas.map((q) => q.uid)));
    setPreguntas(nuevas);
    setIdx(0);
    setRonda(0);
    setEquipos((es) => es.map((e) => ({ ...e, puntos: 0 })));
    setPantalla("ronda");
  }

  function volverAlMenu() {
    setConfirmarSalida(false);
    setPantalla("inicio");
    setIdx(0);
    setRonda(0);
    setPreguntas([]);
    setUsadas(new Set());
    setVivos([]);
    setPtsFinal({});
    setEquipos((es) => es.map((e) => ({ ...e, puntos: 0 })));
  }

  function sumar(ids, pts) {
    setEquipos((es) => es.map((e) => (ids.includes(e.id) ? { ...e, puntos: e.puntos + pts } : e)));
  }

  function resolverRonda(ids, pts) {
    sumar(ids, pts);
    if (idx + 1 < preguntas.length) setIdx(idx + 1);
    else setPantalla("finRonda");
  }

  function siguienteRonda() {
    if (ronda + 1 < 3) {
      const nuevas = armarRonda(pool, usadas, 12, RONDAS[ronda + 1].cats, vistas, temasPartida);
      marcarVistas(nuevas);
      setTemasPartida((t) => new Set([...t, ...nuevas.filter((q) => q.g).map((q) => q.g)]));
      setUsadas(new Set([...usadas, ...nuevas.map((q) => q.uid)]));
      setPreguntas(nuevas);
      setIdx(0);
      setRonda(ronda + 1);
      setPantalla("ronda");
    } else if (equipos.length === 2) {
      prepararFinal(equipos.map((e) => e.id));
    } else {
      const clasificados = [...equipos].sort((a, b) => b.puntos - a.puntos).slice(0, 3);
      setVivos(clasificados.map((e) => e.id));
      setPantalla("semi");
    }
  }

  function prepararFinal(ids, ya) {
    const yaVistas = ya || new Set([...usadas, ...preguntas.map((q) => q.uid)]);
    const disponibles = pool.filter(
      (q) => !yaVistas.has(q.uid) && !(q.g && temasPartida.has(q.g))
    );
    const elegidas = [
      ...mezclar(disponibles.filter((q) => !vistas.has(q.h))),
      ...mezclar(disponibles.filter((q) => vistas.has(q.h))),
    ].slice(0, 21);
    marcarVistas(elegidas);
    setPreguntas(elegidas);
    setIdx(0);
    setVivos(ids);
    setPtsFinal(Object.fromEntries(ids.map((i) => [i, 0])));
    setPantalla("final");
  }

  function resolverFinal(ganadorId) {
    const nuevos = { ...ptsFinal };
    if (ganadorId) nuevos[ganadorId] = (nuevos[ganadorId] || 0) + 1;
    setPtsFinal(nuevos);
    if (ganadorId && nuevos[ganadorId] >= PUNTOS_FINAL) { setPantalla("campeon"); return; }
    if (idx + 1 < preguntas.length) setIdx(idx + 1);
    else setPantalla("campeon");
  }

  const equiposVivos = equipos.filter((e) => vivos.includes(e.id));


  if (cargando) {
    return (
      <div className="tb">
        <style>{CSS}</style>
        <div className="tb-wrap splash"><Logo size={64} /><p className="eyebrow">Preparando la mesa…</p></div>
      </div>
    );
  }

  return (
    <div className="tb">
      <style>{CSS}</style>

      {/* ---------------- INICIO ---------------- */}
      {pantalla === "inicio" && (
        <div className="tb-wrap contenido">
          <div className="marca">
            <Logo size={52} />
            <div>
              <h1 className="titulo">Trivia y Pururú</h1>
              <p className="bajada">Practicá para tu próxima noche de trivia</p>
            </div>
          </div>

          <div className="stack" style={{ marginTop: 26 }}>
            <button className="hero hero-a" onClick={() => setPantalla("armado")}>
              <span className="hero-emoji" aria-hidden="true">👥</span>
              <span className="hero-txt">
                <strong>Jugar con amigos</strong>
                <span>Tres rondas, semifinal y final a pulsador</span>
              </span>
              <span className="hero-flecha" aria-hidden="true">→</span>
            </button>
            <button className="hero hero-b" onClick={() => setPantalla("solitario")}>
              <span className="hero-emoji" aria-hidden="true">🎯</span>
              <span className="hero-txt">
                <strong>Solitario</strong>
                <span>Preguntas sueltas para entrenar a piacere</span>
              </span>
              <span className="hero-flecha" aria-hidden="true">→</span>
            </button>
          </div>

          <p className="invitacion">
            Preguntas de todo un poco, una ruleta traicionera y una final
            que se gana a puro pulsador. Entrená acá para ganar allá. 🍿
          </p>

          
          <p className="pie">
            {pool.length} preguntas · {[...new Set(pool.map((q) => q.c))].length} categorías
            {obrasOk === false && (
              <><br />No se pudieron cargar las imágenes: las banderas y los cuadros quedaron afuera de esta partida.</>
            )}
          </p>
        </div>
      )}

      {/* ---------------- ARMADO DE EQUIPOS ---------------- */}
      {pantalla === "armado" && (
        <div>
          <BarraJuego titulo="Varios jugadores" detalle="Antes de empezar" onSalir={() => setPantalla("inicio")} />
          <div className="tb-wrap contenido">
            <h2 className="titulo-2">¿Cuántos jugadores son?</h2>
            <div className="grid3">
              {[2, 3, 4, 5, 6].map((n) => (
                <button key={n} className={"selector" + (cantEquipos === n ? " activo" : "")} onClick={() => armarEquipos(n)}>
                  {n}
                </button>
              ))}
            </div>

            <h2 className="titulo-2" style={{ marginTop: 26 }}>Los nombres</h2>
            <div className="stack">
              {equipos.map((e, i) => (
                <div className="campo-eq" key={e.id}>
                  <span className="punto" style={{ background: e.color }} />
                  <input className="input" value={e.nombre} maxLength={22} aria-label={`Nombre del jugador ${i + 1}`}
                    onChange={(ev) => setEquipos((es) => es.map((x, j) => (j === i ? { ...x, nombre: ev.target.value } : x)))} />
                </div>
              ))}
            </div>

            <button className={"toggle" + (conReloj ? " on" : "")} onClick={() => setConReloj(!conReloj)}
              aria-pressed={conReloj}>
              <span>Reloj de 30 segundos por pregunta</span>
              <span className="switch" aria-hidden="true"><i /></span>
            </button>

            {cantEquipos >= 3 && (
              <p className="nota">Con {cantEquipos} jugadores hay semifinal: pasan los tres mejores puntajes.</p>
            )}
          </div>

          <div className="barra-inferior">
            <div className="tb-wrap">
              <button className="btn btn-primario grande" onClick={empezar}>Arrancar la partida</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- RONDA ---------------- */}
      {pantalla === "ronda" && preguntas[idx] && (
        <>
          <BarraJuego
            titulo={`Ronda ${ronda + 1} · ${RONDAS[ronda].corto}`}
            detalle={`Pregunta ${idx + 1} de ${preguntas.length}`}
            onSalir={() => setConfirmarSalida(true)}
            equipos={equipos}
          />
          <Pregunta
            pregunta={preguntas[idx]}
            equipos={equipos}
            solo={false}
            segundos={conReloj ? 30 : 0}
            onResolver={resolverRonda}
            encabezado={
              <div className="progreso">
                {preguntas.map((q, i) => (
                  <span key={i} className={"paso " + (i < idx ? "hecho" : i === idx ? "actual" : "")} />
                ))}
              </div>
            }
          />
        </>
      )}

      {/* ---------------- CIERRE DE RONDA ---------------- */}
      {pantalla === "finRonda" && (
        <div>
          <BarraJuego titulo={`Fin de la ronda ${ronda + 1}`} detalle="Cómo va la mesa"
            onSalir={() => setConfirmarSalida(true)} />
          <div className="tb-wrap contenido">
            <div className="stack">
              {[...equipos].sort((a, b) => b.puntos - a.puntos).map((e, i) => (
                <div className="fila-puesto" key={e.id}>
                  <span className="num">{i + 1}</span>
                  <span className="fila-nm">{e.nombre}</span>
                  <span className="fila-pt" style={{ color: e.color }}>{e.puntos}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="barra-inferior">
            <div className="tb-wrap">
              <button className="btn btn-primario grande" onClick={siguienteRonda}>
                {ronda + 1 < 3 ? `Ir a la ronda ${ronda + 2}` : equipos.length >= 3 ? "Ir a la semifinal" : "Ir a la final"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SEMIFINAL ---------------- */}
      {pantalla === "semi" && equiposVivos.length >= 3 && (
        <>
          <BarraJuego titulo="Semifinal" detalle="Ruleta · 3 preguntas · pasan los 2 mejores"
            onSalir={() => setConfirmarSalida(true)} />
          <Semifinal
            pool={pool}
            usadasIniciales={usadas}
            temasPrevios={temasPartida}
            vistasGlobal={vistas}
            marcarVistas={marcarVistas}
            equipos={equiposVivos}
            onFinalistas={(ids, us) => { setUsadas(us); prepararFinal(ids, us); setPantalla("finalistas"); }}
          />
        </>
      )}

      {/* ---------------- FINAL ---------------- */}
      {pantalla === "final" && preguntas[idx] && equiposVivos.length === 2 && (
        <>
          <BarraJuego titulo="Final a pulsador" detalle={`Primero en llegar a ${PUNTOS_FINAL} puntos`}
            onSalir={() => setConfirmarSalida(true)} />
          <Final
            pregunta={preguntas[idx]}
            equipos={equiposVivos}
            puntos={ptsFinal}
            numero={idx + 1}
            onResolver={resolverFinal}
          />
        </>
      )}

      {/* ---------------- FINALISTAS ---------------- */}
      {pantalla === "finalistas" && equiposVivos.length === 2 && (
        <div className="tb-wrap contenido centro">
          <div className="confeti"><Logo size={70} /></div>
          <p className="eyebrow" style={{ marginTop: 18 }}>Se definió la semifinal</p>
          <h2 className="titulo">¡Tenemos finalistas!</h2>
          <div className="versus">
            <div className="versus-eq" style={{ background: equiposVivos[0].color }}>
              {equiposVivos[0].nombre}
            </div>
            <span className="versus-vs">VS</span>
            <div className="versus-eq" style={{ background: equiposVivos[1].color }}>
              {equiposVivos[1].nombre}
            </div>
          </div>
          <p className="ayuda">Final a pulsador. Gana el primero que llega a {PUNTOS_FINAL} puntos.</p>
          <button className="btn btn-primario grande" style={{ marginTop: 22 }} onClick={() => setPantalla("final")}>
            Jugar la final
          </button>
        </div>
      )}

      {/* ---------------- CAMPEÓN ---------------- */}
      {pantalla === "campeon" && (() => {
        const orden = [...equiposVivos].sort((a, b) => (ptsFinal[b.id] || 0) - (ptsFinal[a.id] || 0));
        const emp = orden.length === 2 && (ptsFinal[orden[0].id] || 0) === (ptsFinal[orden[1].id] || 0);
        return (
          <div className="tb-wrap contenido centro campeon-zona">
            {!emp && <Festejo color={orden[0].color} />}
            <div className={"trofeo" + (emp ? " apagado" : "")} aria-hidden="true">{emp ? "🍿" : "🏆"}</div>
            <p className="eyebrow" style={{ marginTop: 20 }}>{emp ? "La final quedó igualada" : "Campeón de la mesa"}</p>
            <h2 className="titulo campeon-nombre" style={{ color: emp ? "var(--tiza)" : orden[0].color }}>
              {emp ? "Empate" : orden[0].nombre}
            </h2>
            {!emp && <p className="bajada">Se lleva la trivia y el pururú 🍿</p>}
            {emp && <p className="bajada">Se acabaron las preguntas de la final: definen con una de la mesa.</p>}
            <div className="marcador-final">
              {orden.map((e) => (
                <div className="marcador-final-eq" key={e.id}>
                  <span className="marca-nm">{e.nombre}</span>
                  <div className="kernels" style={{ justifyContent: "center" }}>
                    {Array.from({ length: PUNTOS_FINAL }, (_, i) => (
                      <span key={i} className={"kernel" + ((ptsFinal[e.id] || 0) > i ? " lleno" : "")}
                        style={{ background: (ptsFinal[e.id] || 0) > i ? e.color : undefined }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primario grande" style={{ marginTop: 28 }} onClick={volverAlMenu}>
              Otra vuelta
            </button>
          </div>
        );
      })()}

      {pantalla === "solitario" && <Solitario pool={pool} vistasGlobal={vistas} marcarVistas={marcarVistas} volver={() => setPantalla("inicio")} />}

      {/* ---------------- CONFIRMAR SALIDA ---------------- */}
      {confirmarSalida && (
        <Tapa
          accion={
            <div className="stack" style={{ marginTop: 20 }}>
              <button className="btn btn-no" onClick={volverAlMenu}>Sí, cancelar la partida</button>
              <button className="btn btn-primario" onClick={() => setConfirmarSalida(false)}>Seguir jugando</button>
            </div>
          }
        >
          <div className="tapa-emoji" aria-hidden="true">🍿</div>
          <h3 className="titulo-2">¿Cancelamos la partida?</h3>
          <p className="ayuda">Se pierden los puntajes y volvés al menú principal.</p>
        </Tapa>
      )}
    </div>
  );
}
