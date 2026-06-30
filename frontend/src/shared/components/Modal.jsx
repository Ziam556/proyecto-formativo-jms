import { X } from "lucide-react";

/**
 * Modal genérico reutilizable.
 * @param {string}   title    - Título del modal
 * @param {Function} onClose  - Callback para cerrar
 * @param {node}     children - Contenido interno
 */
export default function Modal({ title, onClose, children }) {
    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[3px]"
            onClick={onClose}
        >
            {/* Panel */}
            <div
                className="relative w-full max-w-[420px] mx-4 rounded-2xl bg-[linear-gradient(160deg,rgba(100,60,160,0.92)_0%,rgba(60,60,140,0.92)_100%)] backdrop-blur-xl border border-white/20 shadow-[0_12px_48px_rgba(0,0,0,0.45)] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white text-[1.05rem] font-semibold m-0">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-transparent border-0 cursor-pointer flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido */}
                {children}
            </div>
        </div>
    );
}