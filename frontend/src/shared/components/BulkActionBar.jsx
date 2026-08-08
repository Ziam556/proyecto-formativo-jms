/**
 * Barra de acciones masivas (habilitar / deshabilitar).
 * Se muestra cuando hay filas seleccionadas en una tabla.
 *
 * Props:
 *  - count       {number}   — cantidad de elementos seleccionados
 *  - entityLabel {string}   — nombre en plural para el mensaje (ej: "material(es)", "usuario(s)")
 *  - onEnable    {Function} — acción al hacer clic en "Habilitar seleccionados"
 *  - onDisable   {Function} — acción al hacer clic en "Deshabilitar seleccionados"
 */
export default function BulkActionBar({ count, entityLabel = "elemento(s)", onEnable, onDisable }) {
    if (!count) return null;
    return (
        <div className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl bg-purple-900/40 border border-purple-400/20 flex-wrap">
            <span className="text-white/70 text-xs font-medium">
                {count} {entityLabel} seleccionado(s)
            </span>
            <button
                onClick={onEnable}
                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition"
            >
                Habilitar seleccionados
            </button>
            <button
                onClick={onDisable}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition"
            >
                Deshabilitar seleccionados
            </button>
        </div>
    );
}
