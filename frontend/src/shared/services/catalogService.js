const CATALOG_URL = "http://localhost:4000/api/catalogs";

// Cache en memoria: los catálogos no cambian en tiempo de ejecución
const cache = {};

export async function getCatalog(type) {
  if (cache[type]) return cache[type];
  const response = await fetch(`${CATALOG_URL}/${type}`);
  if (!response.ok) throw new Error(`Error al obtener catálogo: ${type}`);
  const data = await response.json();
  cache[type] = data;
  return data;
}

export const getStateTypes         = () => getCatalog("state");
export const getDocumentTypes      = () => getCatalog("document_type");
export const getUserTypes          = () => getCatalog("user_type");
export const getCategoriesTypes    = () => getCatalog("category");
export const getMaterialTypes      = () => getCatalog("material_type");
