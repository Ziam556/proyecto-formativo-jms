// variant="dark"       → fondo semitransparente  (fondos degradado / oscuros)  [default]
// variant="light"      → fondo blanco            (cards blancas)
// labelVariant="light" → label blanco            [default]
// labelVariant="dark"  → label negro
export default function Textarea({
    label,
    error,
    rows = 4,
    variant = "dark",
    labelVariant = "light",
    ...props
}) {
    const isLight = variant === "light";

    const labelColor = error
        ? "text-red-600"
        : labelVariant === "dark"
        ? "text-black"
        : "text-white";

    return (
        <div className="w-full">

            {label && (
                <label className={`block text-[12px] mb-1 place-self-start font-semibold ${labelColor}`}>
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