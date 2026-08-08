import { getStateTypes } from "@/shared/services/catalogService.js";

// Cache simple en memoria: state.json no cambia en tiempo de ejecución,
// así que no tiene sentido volver a pedirlo por cada material normalizado.
let stateMapPromise = null;

function loadStateMap() {
  if (!stateMapPromise) {
    stateMapPromise = getStateTypes().then((types) => {
      // types: [{ id: "N.D", label: "No disponible" }, ...]
      const map = {};
      types.forEach((t) => { map[t.id] = t.label; });
      return map;
    });
  }
  return stateMapPromise;
}

// Traduce un código guardado en BD (ej. "N.D", "T") a su etiqueta legible
// (ej. "No disponible", "Traslado"). Si el código no existe en el catálogo
// o ya es una etiqueta completa (datos viejos guardados antes de este fix),
// se devuelve tal cual para no romper la vista.
export async function translateStateCode(code) {
  if (!code) return code;
  const map = await loadStateMap();
  return map[code] ?? code;
}

// Versión para traducir una lista completa de materiales ya normalizados.
export async function translateStatesInList(items) {
  const map = await loadStateMap();
  return items.map((item) => ({
    ...item,
    state: map[item.state] ?? item.state,
  }));
}