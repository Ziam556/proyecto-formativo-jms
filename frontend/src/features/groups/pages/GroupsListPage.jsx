import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Save } from "lucide-react";
import { Switch } from "@/shared";
import { getGroups } from "../services/groupService";

export default function GroupsListPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getGroups()
            .then((data) => setGroups(data.map((g) => ({ ...g, isEditing: false }))))
            .catch(console.error);
    }, []);

    const toggleEdit = (id) => {
        setGroups(groups.map((g) =>
            g.group_id === id ? { ...g, isEditing: !g.isEditing } : g
        ));
    };

    const handleNameChange = (id, value) => {
        setGroups(groups.map((g) =>
            g.group_id === id ? { ...g, group_name: value } : g
        ));
    };

    const handleSave = (id) => {
        setGroups(groups.map((g) =>
            g.group_id === id ? { ...g, isEditing: false } : g
        ));
    };

    // Divide la lista en dos columnas
    const mid = Math.ceil(groups.length / 2);
    const leftGroups  = groups.slice(0, mid);
    const rightGroups = groups.slice(mid);

    const renderTable = (list) => (
        <div className="bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-[10px_16px] text-left text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Grupos registrados
                        </th>
                        <th className="p-[10px_16px] text-center text-[0.85rem] font-semibold text-white bg-[rgba(0,0,0,0.15)]">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr>
                            <td colSpan={2} className="p-[10px_16px] text-[0.88rem] text-[#555] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle text-center">
                                Sin grupos
                            </td>
                        </tr>
                    ) : (
                        list.map((group) => (
                            <tr key={group.group_id}>
                                <td className="p-[10px_16px] text-[0.88rem] text-[#111] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle">
                                    <div className="flex items-center gap-2">
                                        {group.isEditing ? (
                                            <input
                                                value={group.group_name}
                                                onChange={(e) => handleNameChange(group.group_id, e.target.value)}
                                                className="border border-[#aaa] rounded-md py-[2px] px-2 text-[0.88rem] w-full max-w-[120px]"
                                                autoFocus
                                            />
                                        ) : (
                                            <span>{group.group_name}</span>
                                        )}
                                        <button
                                            className="bg-transparent border-0 cursor-pointer p-1 flex items-center text-[#444]"
                                            onClick={() =>
                                                group.isEditing
                                                    ? handleSave(group.group_id)
                                                    : toggleEdit(group.group_id)
                                            }
                                            title={group.isEditing ? "Guardar" : "Editar"}
                                        >
                                            {group.isEditing
                                                ? <Save size={16} />
                                                : <Pencil size={16} />
                                            }
                                        </button>
                                    </div>
                                </td>
                                <td className="p-[10px_16px] text-[0.88rem] text-[#111] border-b border-white/20 bg-[rgba(255,255,255,0.55)] align-middle text-center">
                                    —
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-9 px-5 sm:px-10 w-full max-w-[900px] relative">

                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/config")}
                    className="absolute top-5 left-5 bg-transparent border-0 cursor-pointer text-white"
                    title="Regresar"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                {/* Título */}
                <h2 className="text-center text-white text-[1.1rem] sm:text-[1.3rem] font-bold mb-7">
                    Listar Grupos
                </h2>

                {/* Dos columnas en desktop, una en móvil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderTable(leftGroups)}
                    {renderTable(rightGroups)}
                </div>

                {/* Botones inferiores */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-7">
                    <button className="py-3 px-6 sm:px-8 rounded-[30px] bg-[#50E5F9] border-0 font-semibold text-[0.95rem] cursor-pointer text-[#111]">
                        Editar Grupos
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/config/groups/create")}
                        className="py-3 px-6 sm:px-8 rounded-[30px] bg-[#700D7C] border-0 font-semibold text-[0.95rem] cursor-pointer text-white"
                    >
                        Crear grupo
                    </button>
                </div>

            </div>
        </div>
    );
}
