/**
 * Convierte una fecha en formato ISO (yyyy-mm-dd) o un Date al formato local dd/mm/aaaa.
 * Retorna "—" si el valor es nulo/vacío.
 */
export function formatDate(value) {
  if (!value) return "—";
  // Parsear como UTC para evitar desfase de zona horaria
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00Z`);
  if (isNaN(d.getTime())) return String(value);
  const dd   = String(d.getUTCDate()).padStart(2, "0");
  const mm   = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
