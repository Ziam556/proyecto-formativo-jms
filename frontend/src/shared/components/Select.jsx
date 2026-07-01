// labelVariant="light" → label blanco  (fondos degradado / oscuros)   [default]
// labelVariant="dark"  → label negro   (fondos claros / cards blancas)
export default function Select({
    label,
    name,
    error,
    options = [],
    value,
    onChange,
    placeholder = "Seleccione una opción",
    labelVariant = "light",
}) {
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

            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`
                    w-full
                    h-12
                    px-4
                    text-[12px]
                    rounded-[8px]
                    border
                    bg-[rgba(217,217,217,0.54)]
                    hover:border-2
                    hover:border-focus-border
                    ${error ? "border-red-600" : "border-black"}
                `}
            >
                <option value="">{placeholder}</option>

                {options.map((opt) => (
                    <option
                        key={opt.value ?? opt.id}
                        value={opt.value ?? opt.id}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-caption text-red-600 place-self-start">
                    {error}
                </p>
            )}
        </div>
    );
}