export default function Textarea({
    label,
    error,
    rows = 3,
    ...props
}) {
    return (
        <div className="w-full">

            {label && (
                <label className={`block text-[8px] mb-1 place-self-start ${error ? "text-red-600" : "text-text-primary"}`}>
                    {label}
                </label>
            )}

            <textarea
                rows={rows}
                className={`
                    w-full
                    rounded-[8px]
                    border
                    px-4
                    py-3
                    text-base
                    bg-[rgba(217,217,217,0.54)]
                    hover:border-2
                    focus:outline-none
                    focus:ring-1
                    focus:ring-focus-ring
                    resize-none
                    ${error ? "border-red-600" : "border-black"}
                `}
                {...props}
            />

            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}
        </div>
    );
}
