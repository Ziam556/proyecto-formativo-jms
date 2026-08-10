import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FileText, MoreVertical, UploadCloud, X } from "lucide-react";
import { SearchField, BackButton, Button, alertConfirm, alertSuccess, alertError } from "@/shared";
import {
    getQuotations,
    getConsumableMaterials,
    getReturnableMaterials,
    addQuotation,
    removeQuotation,
} from "../services/quotationService";

// ── Constantes ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

const TYPE_LABELS = {
    returnable: "Devolutivo",
    consumable:  "Consumo",
};

const TYPE_BADGE = {
    returnable: "bg-blue-600 text-white",
    consumable:  "bg-amber-600 text-white",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Card de cotización ────────────────────────────────────────────────────────

function QuotationCard({ quotation, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const fileUrl = `http://localhost:4000/${quotation.filePath}`;

    // Cerrar menú al clic afuera
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleDelete = async () => {
        const ok = await alertConfirm(
            "¿Eliminar cotización?",
            "Esta acción no se puede deshacer. El archivo será eliminado permanentemente."
        );
        if (!ok) return;
        try {
            await onDelete(quotation);
            alertSuccess("Cotización eliminada.");
        } catch (err) {
            alertError(err.message);
        }
    };

    return (
        <div className="relative flex flex-col gap-2 rounded-2xl bg-[rgba(10,8,25,0.75)] border border-white/15 p-4 hover:bg-[rgba(10,8,25,0.90)] transition-colors shadow-lg">

            {/* Ícono + nombre archivo */}
            <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <FileText size={18} className="text-red-300" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-[0.82rem] font-semibold leading-snug truncate" title={quotation.fileName}>
                        {quotation.fileName}
                    </p>
                    <p className="text-white/60 text-[0.74rem] truncate mt-[2px]" title={quotation.materialName}>
                        {quotation.materialName}
                    </p>
                </div>

                {/* Menú "..." */}
                <div className="relative shrink-0" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors text-white/60 hover:text-white"
                    >
                        <MoreVertical size={15} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-8 z-20 min-w-[140px] bg-[#1e1535] border border-white/15 rounded-xl shadow-xl overflow-hidden">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-2.5 text-[0.8rem] text-white/80 hover:bg-white/10 transition-colors"
                            >
                                Ver PDF
                            </a>
                            <a
                                href={fileUrl}
                                download={quotation.fileName}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-2.5 text-[0.8rem] text-white/80 hover:bg-white/10 transition-colors"
                            >
                                Descargar
                            </a>
                            <button
                                onClick={() => { setMenuOpen(false); handleDelete(); }}
                                className="block w-full text-left px-4 py-2.5 text-[0.8rem] text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Badge de tipo */}
            <span className={`self-start text-[0.68rem] font-semibold px-2 py-[2px] rounded-full ${TYPE_BADGE[quotation.materialType] ?? "bg-white/10 text-white/60"}`}>
                {TYPE_LABELS[quotation.materialType] ?? quotation.materialType}
            </span>

            {/* Metadatos */}
            <div className="flex flex-col gap-[2px] mt-1 border-t border-white/10 pt-2">
                <p className="text-white/45 text-[0.69rem] truncate">
                    <span className="text-white/60">Subido:</span> {formatDate(quotation.uploadedAt)}
                </p>
                <p className="text-white/45 text-[0.69rem] truncate" title={quotation.uploadedByEmail}>
                    <span className="text-white/60">Por:</span> {quotation.uploadedByEmail ?? "—"}
                </p>
            </div>
        </div>
    );
}

// ── Selector de material con búsqueda ────────────────────────────────────────

function MaterialSearchSelect({ materials, idField, value, onChange, loading }) {
    const [query, setQuery]   = useState("");
    const [open, setOpen]     = useState(false);
    const containerRef        = useRef(null);

    const selected = materials.find((m) => String(m[idField]) === String(value));

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = materials.filter((m) =>
        m.material_element_name?.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (m) => {
        onChange(String(m[idField]));
        setOpen(false);
        setQuery("");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
    };

    return (
        <div className="flex flex-col gap-1 relative" ref={containerRef}>
            <label className="text-white/70 text-[0.78rem] font-medium">Material</label>

            {/* Campo principal */}
            <div
                onClick={() => !loading && setOpen(true)}
                className={`w-full h-11 px-3 flex items-center justify-between gap-2 rounded-xl border cursor-text transition-colors
                    ${open ? "border-purple-400 bg-white/15" : "border-white/20 bg-white/10 hover:border-white/40"}
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {open ? (
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={selected ? selected.material_element_name : "Buscar material..."}
                        className="flex-1 bg-transparent outline-none text-[0.85rem] text-white placeholder-white/40 min-w-0"
                    />
                ) : (
                    <span className={`flex-1 text-[0.85rem] truncate ${selected ? "text-white" : "text-white/80"}`}>
                        {loading ? "Cargando..." : selected ? selected.material_element_name : "Selecciona un material"}
                    </span>
                )}

                {selected && !open ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-white/40 hover:text-white bg-transparent border-0 cursor-pointer text-[0.85rem] shrink-0 leading-none"
                    >
                        ✕
                    </button>
                ) : (
                    <span className="text-white/40 text-[0.75rem] shrink-0">▾</span>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-[calc(100%+4px)] z-[9999] w-full bg-[#1e1535] border border-white/15 rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
                        {filtered.length === 0 ? (
                            <p className="px-4 py-3 text-[0.82rem] text-white/40 text-center">Sin resultados</p>
                        ) : (
                            filtered.map((m) => (
                                <div
                                    key={m[idField]}
                                    onClick={() => handleSelect(m)}
                                    className={`px-4 py-2.5 cursor-pointer border-b border-white/8 last:border-0 hover:bg-purple-600/30 transition-colors
                                        ${String(m[idField]) === String(value) ? "bg-purple-600/20" : ""}`}
                                >
                                    <span className="text-[0.84rem] font-medium text-white truncate block">
                                        {m.material_element_name}
                                    </span>
                                    <span className="text-[0.72rem] text-white/45">
                                        ID: {m[idField]}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Drop zone PDF ─────────────────────────────────────────────────────────────

function PdfDropZone({ file, onChange, onClear }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type === "application/pdf") onChange(f);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-colors text-center
                ${dragging
                    ? "border-purple-400 bg-purple-500/10"
                    : file
                        ? "border-green-400/50 bg-green-500/8 cursor-default"
                        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }}
            />

            {file ? (
                <>
                    <FileText size={22} className="text-green-300" />
                    <p className="text-green-200 text-[0.8rem] font-medium truncate w-full px-2">{file.name}</p>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 transition-colors"
                    >
                        <X size={11} className="text-white" />
                    </button>
                </>
            ) : (
                <>
                    <UploadCloud size={22} className="text-white/40" />
                    <p className="text-white/50 text-[0.78rem]">
                        Arrastra un PDF aquí<br />
                        <span className="text-white/35 text-[0.72rem]">o haz clic para seleccionar (máx. 20 MB)</span>
                    </p>
                </>
            )}
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function QuotationsPage() {
    // ── Estado ─────────────────────────────────────────────────────────────
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading]       = useState(true);

    // Form añadir
    const [matType, setMatType]     = useState("");
    const [materials, setMaterials] = useState([]);
    const [matId, setMatId]         = useState("");
    const [pdfFile, setPdfFile]     = useState(null);
    const [saving, setSaving]       = useState(false);
    const [formErr, setFormErr]     = useState(null);
    const [matLoading, setMatLoading] = useState(false);

    // Lista derecha
    const [search, setSearch]         = useState("");
    const [filterType, setFilterType] = useState("all");
    const [page, setPage]             = useState(1);

    // ── Cargar cotizaciones ────────────────────────────────────────────────
    const loadQuotations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getQuotations();
            setQuotations(data);
        } catch (err) {
            alertError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadQuotations(); }, [loadQuotations]);

    // ── Cargar materiales según tipo ───────────────────────────────────────
    useEffect(() => {
        if (!matType) { setMaterials([]); setMatId(""); return; }
        const fetch = async () => {
            setMatLoading(true);
            setMatId("");
            setMaterials([]);
            try {
                const data = matType === "returnable"
                    ? await getReturnableMaterials()
                    : await getConsumableMaterials();
                setMaterials(data);
            } catch {
                setMaterials([]);
            } finally {
                setMatLoading(false);
            }
        };
        fetch();
    }, [matType]);

    // ── Enviar cotización ──────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErr(null);

        if (!matType) return setFormErr("Selecciona el tipo de material.");
        if (!matId)   return setFormErr("Selecciona un material.");
        if (!pdfFile) return setFormErr("Adjunta un archivo PDF.");

        try {
            setSaving(true);
            await addQuotation(matType, matId, pdfFile);
            alertSuccess("Cotización agregada correctamente.");
            setPdfFile(null);
            setMatId("");
            await loadQuotations();
        } catch (err) {
            setFormErr(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ── Eliminar cotización ────────────────────────────────────────────────
    const handleDelete = async (q) => {
        await removeQuotation(q.quotationId);
        setQuotations((prev) => prev.filter((x) => x.quotationId !== q.quotationId));
    };

    // ── Filtrado y paginación ──────────────────────────────────────────────
    const filtered = useMemo(() => {
        return quotations.filter((q) => {
            const matchType = filterType === "all" || q.materialType === filterType;
            const term = search.trim().toLowerCase();
            const matchSearch = !term
                || q.fileName.toLowerCase().includes(term)
                || q.materialName.toLowerCase().includes(term);
            return matchType && matchSearch;
        });
    }, [quotations, search, filterType]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage   = Math.min(page, totalPages);
    const from       = (safePage - 1) * PAGE_SIZE;
    const current    = filtered.slice(from, from + PAGE_SIZE);

    const handleSearch = (val) => { setSearch(val); setPage(1); };
    const handleFilter = (type) => { setFilterType(type); setPage(1); };

    // Helper para nombre de campo de ID según tipo
    const idField = matType === "consumable"
        ? "consumable_material_id"
        : "returnable_material_id";

    return (
        <div className="mt-4 border border-white bg-app-gradient w-full rounded-3xl grid grid-cols-1 lg:grid-cols-[280px_1fr] overflow-hidden">

            {/* ── Panel izquierdo — agregar cotización ──────────────────────── */}
            <form
                onSubmit={handleSubmit}
                className="p-6 border-b lg:border-b-0 lg:border-r border-white/15 bg-brand flex flex-col gap-4"
            >
                <BackButton />

                <div className="text-white font-bold mt-2 text-[0.95rem]">Agregar cotización</div>

                {/* Tipo de material */}
                <div className="flex flex-col gap-1">
                    <label className="text-white/70 text-[0.78rem] font-medium">Tipo de material</label>
                    <select
                        value={matType}
                        onChange={(e) => setMatType(e.target.value)}
                        className="w-full rounded-xl bg-white/10 border border-white/20 text-[0.85rem] px-3 py-2.5 outline-none focus:border-purple-400 transition-colors"
                        style={{ color: matType ? "white" : "rgba(255,255,255,0.6)" }}
                    >
                        <option value="" disabled className="bg-[#1e1535] text-white/60">Selecciona el tipo de material</option>
                        <option value="returnable" className="bg-[#1e1535] text-white">Devolutivo</option>
                        <option value="consumable"  className="bg-[#1e1535] text-white">Consumo</option>
                    </select>
                </div>

                {/* Selector de material con búsqueda */}
                <MaterialSearchSelect
                    materials={materials}
                    idField={idField}
                    value={matId}
                    onChange={setMatId}
                    loading={matLoading}
                />

                {/* Drop zone PDF */}
                <PdfDropZone
                    file={pdfFile}
                    onChange={setPdfFile}
                    onClear={() => setPdfFile(null)}
                />

                {formErr && (
                    <p className="text-red-300 text-[0.8rem]">{formErr}</p>
                )}

                <Button type="submit" variant="secondary" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cotización"}
                </Button>
            </form>

            {/* ── Panel derecho — lista de cotizaciones ─────────────────────── */}
            <div className="flex flex-col p-4 sm:p-6 gap-4 flex-1 min-w-0">

                {/* Barra de búsqueda + filtros */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-1 min-w-0">
                        <SearchField
                            placeholder="Buscar por nombre o material..."
                            value={search}
                            onChange={handleSearch}
                            fullWidth
                        />
                    </div>
                    {/* Chips de filtro */}
                    <div className="flex gap-2 shrink-0 flex-wrap">
                        {[
                            { key: "all",        label: "Todos"      },
                            { key: "returnable", label: "Devolutivo" },
                            { key: "consumable", label: "Consumo"    },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => handleFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-[0.78rem] font-semibold transition-colors border
                                    ${filterType === key
                                        ? "bg-purple-600 border-purple-500 text-white shadow"
                                        : "bg-[rgba(10,8,25,0.65)] border-white/20 text-white hover:bg-[rgba(10,8,25,0.85)]"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conteo */}
                <p className="text-white text-[0.75rem] font-medium drop-shadow">
                    {filtered.length} cotización{filtered.length !== 1 ? "es" : ""}
                </p>

                {/* Grid de cards */}
                {loading ? (
                    <p className="text-white/50 text-center py-10">Cargando cotizaciones...</p>
                ) : current.length === 0 ? (
                    <p className="text-white font-medium text-center py-10 text-[0.88rem] drop-shadow">
                        {search || filterType !== "all"
                            ? "No se encontraron cotizaciones con esos filtros."
                            : "Aún no hay cotizaciones registradas."}
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {current.map((q) => (
                            <QuotationCard key={q.quotationId} quotation={q} onDelete={handleDelete} />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                        <span className="text-white text-sm">Página</span>
                        {[
                            { label: "|◀", action: () => setPage(1),                disabled: safePage === 1         },
                            { label: "◀",  action: () => setPage((p) => p - 1),     disabled: safePage === 1         },
                            { label: "▶",  action: () => setPage((p) => p + 1),     disabled: safePage === totalPages },
                            { label: "▶|", action: () => setPage(totalPages),       disabled: safePage === totalPages },
                        ].map(({ label, action, disabled }) => (
                            <button
                                key={label}
                                onClick={action}
                                disabled={disabled}
                                className={`px-2 py-1 rounded text-xs font-semibold transition-colors
                                    ${disabled
                                        ? "bg-white/20 text-white/40 cursor-not-allowed"
                                        : "bg-white/75 text-gray-700 cursor-pointer hover:bg-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                        <span className="text-white text-sm">
                            {from + 1}–{Math.min(from + PAGE_SIZE, filtered.length)} de {filtered.length}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
