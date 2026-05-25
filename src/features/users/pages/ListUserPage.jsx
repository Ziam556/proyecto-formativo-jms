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
        <div style={{ minHeight: "calc(100vh - 64px)", padding: "16px 24px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <BackButton to="/dashboard/userpage" />
                <h1 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                    Lista de usuarios
                </h1>
            </div>

            {/* Stats pills */}
            <div style={{ marginBottom: "6px" }}>
                <StatsPills stats={statsPills} />
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "12px", flexWrap: "wrap" }}>

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
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "320px" }}>
                    <label style={{ fontSize: "0.75rem", color: "#c4b5fd", fontWeight: 500 }}>
                        Tipo de documento
                    </label>
                    <select
                        value={filters.documentType}
                        onChange={(e) => setFilters((f) => ({ ...f, documentType: e.target.value }))}
                        style={{
                            width: "320px",
                            height: "56px",
                            background: "rgba(217,217,217,0.54)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0 14px",
                            fontSize: "0.85rem",
                            color: "#111",
                            outline: "none",
                            boxSizing: "border-box",
                            backdropFilter: "blur(4px)",
                        }}
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
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>

                    <button
                        onClick={clearFilters}
                        style={{
                            width: "189px",
                            height: "56px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            borderRadius: "4px",
                            background: "#0e7490",
                            border: "none",
                            color: "#fff",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                            boxSizing: "border-box",
                        }}
                    >
                        <SlidersHorizontal size={15} />
                        Limpiar Filtros
                    </button>

                    {/* Reportes apilados */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
