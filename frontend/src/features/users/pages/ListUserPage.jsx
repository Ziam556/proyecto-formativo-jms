import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { getUsers, toggleUser } from "../services/userService.js";
import { normalizeUsers } from "../utils/normalizeUser.js";
import { ClearFiltersButton, DataTable, StatsPills, ReportDropdown, BackButton, Input, Select, BulkActionBar, alertConfirm, alertSuccess, alertError } from "@/shared";
import { getUserColumns } from "../table/userColumns.jsx";
import { userReportFields } from "../reports/config/userReportFields.js";
import { generateUserReport } from "../reports/services/generateUserReport.js";

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ListUserPage() {

    // Datos del backend
    const [users, setUsers]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [loadError, setLoadError] = useState(null);

    const loadUsers = useCallback(() => {
        let active = true;
        setLoading(true);
        getUsers()
            .then((rows) => normalizeUsers(rows))
            .then((normalized) => {
                if (!active) return;
                setUsers(normalized);
                setLoadError(null);
            })
            .catch((err) => { if (!active) return; setLoadError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => { return loadUsers(); }, [loadUsers]);

    // Filtros
    const [filters, setFilters] = useState({
        name:         "",
        email:        "",
        group:        "",
        phone:        "",
    });

    // Selección de filas
    const [rowSelection, setRowSelection] = useState({});
    const [reportCols, setReportCols] = useState({});

    // Datos filtrados
    const filtered = useMemo(() => {
        return users.filter((user) => {
            if (filters.name  && !user.name?.toLowerCase().includes(filters.name.toLowerCase()))   return false;
            if (filters.email && !user.email?.toLowerCase().includes(filters.email.toLowerCase())) return false;
            if (filters.group && user.group !== filters.group)                                      return false;
            if (filters.phone && !String(user.phone).includes(filters.phone))                       return false;
            return true;
        });
    }, [filters, users]);

    // Stats pills: total + conteo por grupos predefinidos únicamente
    const GRUPOS_PREDEFINIDOS = ["Administrador", "Instructor", "Invitado"];
    const statsPills = useMemo(() => {
        const pills = [{ label: "Total", count: users.length, color: "#e2e8f0" }];
        GRUPOS_PREDEFINIDOS.forEach((grupo) => {
            const count = users.filter((u) => u.group === grupo).length;
            pills.push({ label: grupo, count, color: "#2563eb" });
        });
        return pills;
    }, [users]);

    const uniqueGroups = useMemo(
        () => [...new Set(users.map((u) => u.group).filter(Boolean))],
        [users]
    );

    const clearFilters = () =>
        setFilters({ name: "", email: "", group: "", phone: "" });

    // Selección masiva
    const selectedUsers = useMemo(() =>
        Object.keys(rowSelection)
            .filter((idx) => rowSelection[idx])
            .map((idx) => filtered[Number(idx)])
            .filter(Boolean),
        [rowSelection, filtered]
    );

    const selectedUsersRef = useRef(selectedUsers);
    selectedUsersRef.current = selectedUsers;

    const handleBulkToggle = useCallback(async (targetEnabled) => {
        const accion = targetEnabled ? "habilitar" : "deshabilitar";
        const targets = selectedUsersRef.current.filter((u) => u.enabled !== targetEnabled);
        if (!targets.length) {
            alertError("Sin cambios", `Todos los seleccionados ya están ${targetEnabled ? "habilitados" : "deshabilitados"}.`);
            return;
        }
        const count = targets.length;
        const confirm = await alertConfirm(
            `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} ${count} usuario(s)?`,
            `Se ${accion}n ${count} usuario(s) seleccionado(s).`
        );
        if (!confirm.isConfirmed) return;
        try {
            await Promise.all(targets.map((u) => toggleUser(u.document)));
            alertSuccess("Listo", `${count} usuario(s) ${targetEnabled ? "habilitados" : "deshabilitados"} correctamente.`);
            setRowSelection({});
            loadUsers();
        } catch (err) {
            alertError("Error", err.message);
        }
    }, [loadUsers]);

    // Campos activos según los toggles de la tabla
    const activeFields = useMemo(() =>
        userReportFields.filter((f) => reportCols[f.key] !== false),
        [reportCols]
    );

    const columns = useMemo(
        () => getUserColumns(loadUsers),
        [loadUsers]
    );

    const handleAllReport = (format) => {
        generateUserReport({ format, activeFields, scope: "all", users });
    };

    const handleSelectedReport = (format) => {
        const selectedIds = Object.keys(rowSelection)
            .filter((idx) => rowSelection[idx])
            .map((idx) => filtered[Number(idx)]?.id)
            .filter(Boolean);

        if (!selectedIds.length) {
            alert("Seleccione al menos un usuario.");
            return;
        }

        generateUserReport({ format, activeFields, scope: "selected", selectedIds, users });
    };

    return (
        <div className="min-h-full py-4 px-3 sm:px-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <BackButton to="/dashboard/userpage" />
                <h1 className="text-white text-[1rem] sm:text-[1.2rem] font-bold m-0">
                    Lista de usuarios
                </h1>
            </div>

            {/* Error */}
            {loadError && (
                <div className="mb-4 rounded-lg bg-red-900/40 border border-red-400/30 px-4 py-3 text-red-200 text-sm">
                    No se pudieron cargar los usuarios: {loadError}
                </div>
            )}

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
                    <label className="text-white text-[0.75rem] font-medium">Grupo</label>
                    <Select
                        name="group"
                        value={filters.group}
                        options={uniqueGroups.map((g) => ({ id: g, label: g }))}
                        onChange={(e) => setFilters((f) => ({ ...f, group: e.target.value }))}
                        placeholder="Selecciona el grupo"
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

            {/* BARRA ACCIÓN MASIVA */}
            <BulkActionBar
                count={selectedUsers.length}
                entityLabel="usuario(s)"
                onEnable={() => handleBulkToggle(true)}
                onDisable={() => handleBulkToggle(false)}
            />

            {/* Tabla */}
            {loading ? (
                <p className="text-white/70 text-sm px-2 py-4">Cargando usuarios...</p>
            ) : (
                <DataTable
                    data={filtered}
                    columns={columns}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    onReportColsChange={setReportCols}
                />
            )}

        </div>
    );
}
