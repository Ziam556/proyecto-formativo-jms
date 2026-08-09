import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups, toggleGroup } from "../services/groupService";
import { Input, Button, BackButton, Switch, alertError } from "@/shared";

export default function GroupsListPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [search, setSearch]  = useState("");

    useEffect(() => {
        getGroups()
            .then(setGroups)
            .catch(console.error);
    }, []);

    const handleToggle = async (groupId) => {
        try {
            const updated = await toggleGroup(groupId);
            setGroups((prev) =>
                prev.map((g) => g.group_id === updated.group_id ? { ...g, enabled: updated.enabled } : g)
            );
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    // Filtrar y dividir en dos columnas
    const filtered    = groups.filter((g) => g.group_name.toLowerCase().includes(search.toLowerCase()));
    const mid         = Math.ceil(filtered.length / 2);
    const leftGroups  = filtered.slice(0, mid);
    const rightGroups = filtered.slice(mid);

    const renderTable = (list) => (
        <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] rounded-xl overflow-hidden">
            <table className="w-full border-collapse table-fixed">
                <colgroup>
                    <col style={{ width: "65%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="p-[10px_16px] text-left text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Grupos registrados
                        </th>
                        <th className="p-[10px_16px] text-center text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Activo
                        </th>
                        <th className="p-[10px_16px] text-center text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Acción
                        </th>
                    </tr>
                </thead>
            </table>
            <div style={{ maxHeight: "420px", overflowY: "auto" }}>
                <table className="w-full border-collapse table-fixed">
                    <colgroup>
                        <col style={{ width: "65%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-[10px_16px] text-[0.88rem] text-[#555] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle text-center">
                                    Sin grupos
                                </td>
                            </tr>
                        ) : (
                            list.map((group) => (
                                <tr key={group.group_id}>
                                    <td className="p-[10px_16px] text-[0.88rem] text-[#111] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle">
                                        {group.group_name}
                                    </td>
                                    <td className="p-[10px_16px] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle text-center">
                                        <Switch
                                            checked={group.enabled !== false}
                                            onChange={() => handleToggle(group.group_id)}
                                            size="sm"
                                        />
                                    </td>
                                    <td className="p-[10px_16px] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle text-center">
                                        <button
                                            onClick={() => navigate(`/dashboard/config/groups/edit/${group.group_id}`)}
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
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full max-w-[900px] relative">

                {/* Flecha regresar */}
                <div className="absolute top-5 left-5">
                    <BackButton to="/dashboard/config" />
                </div>

                {/* Título */}
                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-5">
                    Listar grupos
                </h2>

                {/* Buscador */}
                <div className="mb-5 max-w-[400px] mx-auto">
                    <Input
                        placeholder="Buscar grupo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Dos columnas en desktop, una en móvil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderTable(leftGroups)}
                    {renderTable(rightGroups)}
                </div>

                {/* Botones inferiores */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-7">
                    <Button variant="primary" onClick={() => navigate("/dashboard/config/groups/create")}>
                        Crear grupo
                    </Button>
                </div>

            </div>
        </div>
    );
}
