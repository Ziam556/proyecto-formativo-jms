export { getStateTypes, getCategoriesTypes } from "@/shared/services/catalogService.js";

// getDimensionsTypes sigue siendo local: las dimensiones no son un catálogo
// de BD, son etiquetas fijas para los inputs de Largo/Ancho/Profundidad.
export async function getDimensionsTypes() {
  return [
    { id: "L", label: "Largo" },
    { id: "A", label: "Ancho" },
    { id: "P", label: "Profundidad" },
  ];
}
