import { SlidersHorizontal } from "lucide-react";

export default function ClearFiltersButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="
                h-12 
                flex-1 
                sm:flex-none 
                sm:w-[189px] 
                flex 
                items-center 
                justify-center 
                gap-[6px] 
                rounded 
                border-0 
                bg-[#0e7490] 
                text-white 
                text-[0.82rem] 
                font-semibold 
                cursor-pointer 
                box-border"
        >
            <SlidersHorizontal size={15} />
            Limpiar filtros
        </button>
    );
}
