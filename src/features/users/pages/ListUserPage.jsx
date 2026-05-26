import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { users as usersData } from "../data/users.js";
import { DataTable, StatsPills, ReportDropdown, BackButton, InputForList } from "@/shared";
import { userColumns } from "../table/userColumns.jsx";

// ─── Colores por tipo de documento para pills ──────────────────────────────
const DOC_DOT = {
    CC:  "#16a34a",
    TI:  "#2563eb",
    CE:  "#9333ea",
    PPT: "#d97706",
    PEP: "#6b7280",
};

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ListUserPage() {

    // Filtros
    const [filters, setFilters] = useState({
        name:         "",
        email:        "",
        documentType: "",
        phone:        "",
    });

    // Datos filtrados que se pasan a la tabla
    const filtered = useMemo(() => {
        return usersData.filter((user) => {
            if (filters.name         && !user.name?.toLowerCase().includes(filters.name.toLowerCase()))                   return false;
            if (filters.email        && !user.email?.toLowerCase().includes(filters.email.toLowerCase()))                 return false;
            if (filters.documentType && user.documentType !== filters.documentType)                                        return false;
            if (filters.phone        && !String(user.phone).includes(filters.phone))                                      return false;
            return true;
        });
    }, [filters]);

    // Stats pills: total + conteo por tipo de documento
    const statsPills = useMemo(() => {
        const pills = [{ label: "Total", count: usersData.length, color: "#e2e8f0" }];
        Object.entries(DOC_DOT).forEach(([docType, color]) => {
            pills.push({
                label: docType,
                count: usersData.filter((u) => u.documentType === docType).length,
                color,
            });
        });
        return pills;
    }, []);

    // Lista fija de tipos de documento (igual que las pills)
    const uniqueDocTypes = Object.keys(DOC_DOT);

    const clearFilters = () =>
        setFilters({ name: "", email: "", documentType: "", phone: "" });

    return (
        <div className="min-h-[calc(100vh-64px)] py-4 px-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <BackButton to="/dashboard/userpage" />
                <h1 className="text-white text-[1.2rem] font-bold m-0">
                    Lista de usuarios
                </h1>
            </div>

            {/* Stats pills */}
            <div className="mb-[6px]">
                <StatsPills stats={statsPills} />
            </div>

            {/* Filtros */}
            <div className="flex gap-[10px] items-end mb-3 flex-wrap">

                {/* Nombre */}
                <InputForList
                    label="Nombre"
                    type="search"
                    value={filters.name}
                    onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Buscar por nombre"
                />

                {/* Correo */}
                <InputForList
                    label="Correo electrónico"
                    type="search"
                    value={filters.email}
                    onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Buscar por correo"
                />

                {/* Tipo de documento — select nativo con el mismo estilo */}
                <div className="flex flex-col gap-1 w-[320px]">
                    <label className="text-xs text-[#c4b5fd] font-medium">
                        Tipo de documento
                    </label>
                    <select
                        value={filters.documentType}
                        onChange={(e) => setFilters((f) => ({ ...f, documentType: e.target.value }))}
                        className="w-[320px] h-14 bg-[rgba(217,217,217,0.54)] border-0 rounded text-[0.85rem] text-[#111] outline-none box-border backdrop-blur-sm px-[14px]"
                    >
                        <option value="">Selecciona el tipo</option>
                        {uniqueDocTypes.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Teléfono */}
                <InputForList
                    label="Teléfono"
                    type="search"
                    value={filters.phone}
                    onChange={(e) => setFilters((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Buscar por teléfono"
                />

                {/* Limpiar filtros + Reportes */}
                <div className="flex gap-[10px] items-end">

                    <button
                        onClick={clearFilters}
                        className="w-[189px] h-14 flex items-center justify-center gap-[6px] rounded border-0 bg-[#0e7490] text-white text-[0.82rem] font-semibold cursor-pointer shrink-0 box-border"
                    >
                        <SlidersHorizontal size={15} />
                        Limpiar Filtros
                    </button>

                    {/* Reportes apilados */}
                    <div className="flex flex-col gap-[6px]">
                        <ReportDropdown
                            label="Generar reporte de todos los usuarios"
                            color="#00304D"
                            width={280}
                            height={70}
                        />
                        <ReportDropdown
                            label="Generar reporte de usuario seleccionado"
                            color="#00304D"
                            width={280}
                            height={70}
                        />
                    </div>

                </div>

            </div>

            {/* Tabla */}
            <DataTable data={filtered} columns={userColumns} />

        </div>
    );
}
