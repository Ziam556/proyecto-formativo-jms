// variant="dark"  → fondo semitransparente, label blanca  (fondos degradado)
// variant="light" → fondo blanco, label gris               (cards blancas)
export default function Textarea({
    label,
    error,
    rows = 4,
    variant = "dark",
    ...props
}) {
    const isLight = variant === "light";

    return (
        <div className="w-full">

            {label && (
                <label className={`block text-[0.82rem] mb-1 place-self-start font-semibold
                    ${error ? "text-red-600" : isLight ? "text-gray-700" : "text-white"}`}>
                    {label}
                </label>
            )}

            <textarea
                rows={rows}
                className={`
                    w-full rounded-[8px] border px-4 py-3 text-[0.85rem]
                    focus:outline-none focus:ring-1 resize-none
                    ${isLight
                        ? "bg-white border-gray-200 focus:ring-purple-400"
                        : "bg-[rgba(217,217,217,0.54)] hover:border-2 focus:ring-focus-ring border-black"
                    }
                    ${error ? "border-red-600" : ""}
                `}
                {...props}
            />

            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}