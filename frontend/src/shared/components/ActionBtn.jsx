export default function ActionBtn({ icon: Icon, label, onClick, danger = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-6 py-5 rounded-xl border text-[0.95rem] font-semibold transition-all duration-200 ${
                danger
                    ? "border-red-400/60 bg-white/15 text-red-600 hover:bg-red-500/20"
                    : "border-black/30 bg-white/15 text-black hover:bg-white/25"
            }`}
        >
            <Icon size={20} className="flex-shrink-0" />
            {label}
        </button>
    );
}
