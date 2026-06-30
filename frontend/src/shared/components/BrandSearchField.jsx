import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:4000";

/**
 * Campo de búsqueda de marcas.
 * Misma apariencia que <Input>, pero con dropdown de sugerencias
 * cargadas desde GET /api/brands.
 *
 * Props:
 *   label    – texto del label
 *   value    – valor actual (string)
 *   onChange – fn(value: string) → actualiza el campo
 *   error    – mensaje de error (string)
 */
export default function BrandSearchField({ label, value = "", onChange, error }) {
  const [brands, setBrands]       = useState([]);
  const [open, setOpen]           = useState(false);
  const containerRef              = useRef(null);

  // Cargar marcas habilitadas al montar
  useEffect(() => {
    fetch(`${API_BASE}/api/brands`)
      .then((r) => r.json())
      .then((data) => setBrands(data.filter((b) => b.enabled !== false)))
      .catch(() => {});
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = value.trim()
    ? brands.filter((b) => b.name.toLowerCase().includes(value.toLowerCase()))
    : brands;

  const handleSelect = (name) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          className={`block text-[8px] mb-1 place-self-start ${
            error ? "text-red-600" : "text-text-primary"
          }`}
        >
          {label}
        </label>
      )}

      {/* Input con mismo estilo que Input.jsx */}
      <div className="relative h-12 flex items-center">
        <input
          type="text"
          autoComplete="off"
          value={value}
          placeholder="Buscar marca"
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={`
            relative w-full h-12 rounded-[8px] border px-4 text-base
            bg-[rgba(217,217,217,0.54)]
            hover:border-2
            focus:outline-none focus:ring-1 focus:ring-focus-ring
            ${error ? "border-red-600" : "border-black"}
          `}
        />
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-black/20 bg-white shadow-lg">
          {filtered.map((b) => (
            <li
              key={b.id}
              onMouseDown={() => handleSelect(b.name)}
              className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-[rgba(112,13,124,0.12)] transition"
            >
              {b.name}
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {error && (
        <p className="text-caption text-red-600 place-self-start">{error}</p>
      )}
    </div>
  );
}
