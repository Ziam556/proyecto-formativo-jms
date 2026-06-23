// Tarjeta de campo label+valor usada en las páginas de "Ver detalle"
// (ViewConsumableMaterial, ViewLoans, ViewReturnableMaterial, etc.)
export default function Field({ label, value }) {
    return (
        <div className="bg-white/80 rounded-[8px] p-3 flex-1 min-w-[140px]">
            <span className="text-black/50 text-xs font-semibold uppercase tracking-wide">
                {label}
            </span>
            <p className="text-black font-medium mt-[2px]">{value ?? "—"}</p>
        </div>
    );
}
