import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { users as usersData } from "../data/users.js";
import { ClearFiltersButton, DataTable, StatsPills, ReportDropdown, BackButton, Input, Select } from "@/shared";
import { userColumns } from "../table/userColumns.jsx";
import { userReportFields } from "../reports/config/userReportFields.js";
import { generateUserReport } from "../reports/services/generateUserReport.js";

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

    // Selección de filas
    const [rowSelection, setRowSelection] = useState({});

    // Columnas activas del reporte (sincronizadas con los toggles de la tabla)
    const [reportCols, setReportCols] = useState(
        Object.fromEntries(userColumns.map((c) => [c.id, true]))
    );

    // Datos filtrados
    const filtered = useMemo(() => {
        return usersData.filter((user) => {
            if (filters.name         && !user.name?.toLowerCase().includes(filters.name.toLowerCase()))       return false;
            if (filters.email        && !user.email?.toLowerCase().includes(filters.email.toLowerCase()))     return false;
            if (filters.documentType && user.documentType !== filters.documentType)                            return false;
            if (filters.phone        && !String(user.phone).includes(filters.phone))                          return false;
            return true;
        });
    }, [filters]);

    // Stats pills
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

    const uniqueDocTypes = Object.keys(DOC_DOT);

    const clearFilters = () =>
        setFilters({ name: "", email: "", documentType: "", phone: "" });

    // Campos activos según los toggles de la tabla (excluye "actions")
    const activeFields = useMemo(() =>
        userReportFields.filter((f) => reportCols[f.key] !== false),
        [reportCols]
    );

    // Reporte de todos los usuarios
    const handleAllReport = (format) => {
        generateUserReport({ format, activeFields, scope: "all" });
    };

    // Reporte de usuarios seleccionados
    const handleSelectedReport = (format) => {
        const selectedIds = Object.keys(rowSelection)
            .filter((idx) => rowSelection[idx])
            .map((idx) => filtered[Number(idx)]?.id)
            .filter(Boolean);

        if (!selectedIds.length) {
            alert("Seleccione al menos un usuario.");
            return;
        }

        generateUserReport({ format, activeFields, scope: "selected", selectedIds });
    };

    return (
        <div className="min-h-[calc(100vh-64px)] py-4 px-3 sm:px-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <BackButton to="/dashboard/userpage" />
                <h1 className="text-white text-[1rem] sm:text-[1.2rem] font-bold m-0">
                    Lista de usuarios
                </h1>
            </div>

            {/* Stats pills */}
            <div className="mb-[6px] overflow-x-auto">
                <StatsPills stats={statsPills} />
            </div>

            {/* Filtros */}
            <div className="flex gap-[10px] items-end mb-3 flex-wrap">

                <div className="flex flex-col gap-1 w-full sm:w-[320px]">
                    <label className="text-white text-[0.75rem] font-medium">Nombre</label>
                    <Input
                        name="name"
                        value={filters.name}
                        onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Buscar por nombre"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[320px]">
                    <label className="text-white text-[0.75rem] font-medium">Correo electrónico</label>
                    <Input
                        name="email"
                        value={filters.email}
                        onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
                        placeholder="Buscar por correo"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[320px]">
                    <label className="text-white text-[0.75rem] font-medium">Tipo de documento</label>
                    <Select
                        name="documentType"
                        value={filters.documentType}
                        options={uniqueDocTypes.map((d) => ({ id: d, label: d }))}
                        onChange={(e) => setFilters((f) => ({ ...f, documentType: e.target.value }))}
                        placeholder="Selecciona el tipo"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-[320px]">
                    <label className="text-white text-[0.75rem] font-medium">Teléfono</label>
                    <Input
                        name="phone"
                        value={filters.phone}
                        onChange={(e) => setFilters((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Buscar por teléfono"
                    />
                </div>

                {/* Limpiar filtros + Reportes */}
                <div className="flex flex-wrap gap-[10px] items-end w-full sm:w-auto">

                    <ClearFiltersButton onClick={clearFilters} />

                    <div className="flex flex-row gap-[6px] w-full sm:w-auto flex-wrap">
                        <ReportDropdown
                            label="Generar reporte de todos los usuarios"
                            onPDF={() => handleAllReport("pdf")}
                            onExcel={() => handleAllReport("excel")}
                        />
                        <ReportDropdown
                            label="Generar reporte de usuario seleccionado"
                            onPDF={() => handleSelectedReport("pdf")}
                            onExcel={() => handleSelectedReport("excel")}
                        />
                    </div>

                </div>

            </div>

            {/* Tabla */}
            <DataTable
                data={filtered}
                columns={userColumns}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onReportColsChange={setReportCols}
            />

        </div>
    );
}
