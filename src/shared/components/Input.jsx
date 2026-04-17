export default function Input({
    type = "text",
    error,
    ...props
}){
    return (
        <div className="w-[320px]">

            <div className="relative h-12 flex items-center">

                {type !== "date" && (
                    <div 
                        className="absolute inset-0"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.currentTarget.nextSibling.focus();
                        }}
                    />
                )}

                <input
                    type={type}
                    className={`
                        relative
                        w-full
                        h-12
                        rounded-md
                        border
                        border-border
                        px-4
                        text-base
                        hover:border-2
                        hover:border-focus-border
                        focus:outline-none
                        focus:ring-1
                        focus:ring-focus-ring
                        ${error ? "border-red-600" : "border border-border"}      
                    `}
                    {...props}
                />
            </div>

            <div></div>
            {error && <p className="text-caption text-red-600 place-self-start">{error}</p>}

        </div>
    );
};