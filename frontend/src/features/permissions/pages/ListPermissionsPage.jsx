import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPermissions } from "../services/permissionService";
import { Input, Button, BackButton } from "@/shared";

export default function ListPermissionsPage() {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");

    useEffect(() => {
        getPermissions()
            .then(setPermissions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filtrar y dividir en dos columnas
    const filtered   = permissions.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.permission_name.toLowerCase().includes(q) ||
            p.permission_codename.toLowerCase().includes(q) ||
            (p.permission_module ?? "").toLowerCase().includes(q)
        );
    });
    const mid        = Math.ceil(filtered.length / 2);
    const leftPerms  = filtered.slice(0, mid);
    const rightPerms = filtered.slice(mid);

    const renderTable = (list) => (
        <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] rounded-xl overflow-hidden">
            <table className="w-full border-collapse table-fixed">
                <colgroup>
                    <col style={{ width: "45%" }} />
                    <col style={{ width: "37%" }} />
                    <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="p-[10px_16px] text-left text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Permiso
                        </th>
                        <th className="p-[10px_16px] text-left text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Codename
                        </th>
                        <th className="p-[10px_16px] text-center text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Acción
                        </th>
                    </tr>
                </thead>
            </table>
            {/* Scroll interno: máx 10 filas (~420px) */}
            <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                <table className="w-full border-collapse table-fixed">
                    <colgroup>
                        <col style={{ width: "45%" }} />
                        <col style={{ width: "37%" }} />
                        <col style={{ width: "18%" }} />
                    </colgroup>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-[10px_16px] text-[0.88rem] text-[#555] border-b border-white/20 bg-[rgba(255,255,255,0.55)] text-center">
                                    Sin permisos
                                </td>
                            </tr>
                        ) : (
                            list.map((perm) => (
                                <tr key={perm.permission_id}>
                                    <td className="p-[10px_16px] text-[0.88rem] text-[#111] border-b border-white/20 bg-[rgba(255,255,255,0.55)]">
                                        <div>
                                            <span>{perm.permission_name}</span>
                                            <div className="text-[0.74rem] text-[#666] mt-[1px]">{perm.permission_module}</div>
                                        </div>
                                    </td>
                                    <td className="p-[10px_16px] text-[0.82rem] border-b border-white/20 bg-[rgba(255,255,255,0.55)]">
                                        <span className="bg-[rgba(112,13,124,0.12)] text-[#700D7C] px-2 py-[2px] rounded-full font-mono text-[0.78rem] break-all">
                                            {perm.permission_codename}
                                        </span>
                                    </td>
                                    <td className="p-[10px_16px] border-b border-white/20 bg-[rgba(255,255,255,0.55)] text-center">
                                        <button
                                            onClick={() => navigate(`/dashboard/config/permissions/edit/${perm.permission_id}`)}
                                            className="bg-transparent border-0 cursor-pointer text-[#700D7C] text-[0.82rem] font-semibold hover:underline"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full max-w-[1000px] relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config" />
                </div>

                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-5">
                    Listar Permisos
                </h2>

                {/* Buscador */}
                <div className="mb-5 max-w-[400px] mx-auto">
                    <Input
                        placeholder="Buscar por nombre, codename o módulo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p className="text-white text-center py-8">Cargando permisos...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {renderTable(leftPerms)}
                        {renderTable(rightPerms)}
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-7">
                    <Button variant="primary" onClick={() => navigate("/dashboard/config/permissions/create")}>
                        Crear permiso
                    </Button>
                </div>

            </div>
        </div>
    );
}
