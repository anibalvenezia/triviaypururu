/* Junta todas las categorías en un solo banco.
   El ORDEN de esta lista define el orden de las categorías en la app (ruleta, etc.).
   Para sumar una categoría nueva: crear data/<nombre>.json, importarla acá y
   agregarla a la lista. Ver data/README.md. */
import cordoba from "./cordoba.json";
import historia from "./historia.json";
import ciencia from "./ciencia.json";
import musica from "./musica.json";
import literatura from "./literatura.json";
import cine_y_series from "./cine-y-series.json";
import tv_y_espectaculos from "./tv-y-espectaculos.json";
import deportes from "./deportes.json";
import mundo from "./mundo.json";
import arte from "./arte.json";
import cultura_general from "./cultura-general.json";
import banderas from "./banderas.json";
import quien_dijo from "./quien-dijo.json";

export default [...cordoba, ...historia, ...ciencia, ...musica, ...literatura, ...cine_y_series, ...tv_y_espectaculos, ...deportes, ...mundo, ...arte, ...cultura_general, ...banderas, ...quien_dijo];
