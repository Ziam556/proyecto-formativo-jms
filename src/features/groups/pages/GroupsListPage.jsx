import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Save } from "lucide-react";
import { Switch } from "@/shared";
import { initialGroups } from "../data/groups";

const STORAGE_KEY = "grupos_list";

const cardStyle = {
    background: "linear-gradient(135deg, #700D7C 0%, #88A3C7 50%, #50E5F9 100%)",
    borderRadius: "20px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "900px",
    position: "relative",
};

const tableContainerStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: "12px",
    overflow: "hidden",
};

const thStyle = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#fff",
    background: "rgba(0,0,0,0.15)",
};

const tdStyle = {
    padding: "10px 16px",
    fontSize: "0.88rem",
    color: "#111",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.55)",
    verticalAlign: "middle",
};

const iconBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    color: "#444",
};

export default function GroupsListPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        setGroups(saved ? JSON.parse(saved) : initialGroups);
    }, []);

    const persist = (updated) => {
        setGroups(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const toggleEdit = (id) => {
        persist(groups.map((g) =>
            g.id === id ? { ...g, isEditing: !g.isEditing } : g
        ));
    };

    const handleNameChange = (id, value) => {
        setGroups(groups.map((g) =>
            g.id === id ? { ...g, name: value } : g
        ));
    };

    const handleSave = (id) => {
        persist(groups.map((g) =>
            g.id === id ? { ...g, isEditing: false } : g
        ));
    };

    const toggleEnabled = (id, value) => {
        persist(groups.map((g) =>
            g.id === id ? { ...g, enabled: value } : g
        ));
    };

    // Divide la lista en dos columnas
    const mid = Math.ceil(groups.length / 2);
    const leftGroups  = groups.slice(0, mid);
    const rightGroups = groups.slice(mid);

    const renderTable = (list) => (
        <div style={tableContainerStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Grupos registrados</th>
                        <th style={{ ...thStyle, textAlign: "center" }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr>
                            <td colSpan={2} style={{ ...tdStyle, textAlign: "center", color: "#555" }}>
                                Sin grupos
                            </td>
                        </tr>
                    ) : (
                        list.map((group) => (
                            <tr key={group.id}>
                                <td style={tdStyle}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {group.isEditing ? (
                                            <input
                                                value={group.name}
                                                onChange={(e) => handleNameChange(group.id, e.target.value)}
                                                style={{
                                                    border: "1px solid #aaa",
                                                    borderRadius: "6px",
                                                    padding: "2px 8px",
                                                    fontSize: "0.88rem",
                                                    width: "120px",
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span>{group.name}</span>
                                        )}
                                        <button
                                            style={iconBtnStyle}
                                            onClick={() =>
                                                group.isEditing
                                                    ? handleSave(group.id)
                                                    : toggleEdit(group.id)
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
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <Switch
                                        checked={group.enabled}
                                        onChange={(val) => toggleEnabled(group.id, val)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <div style={{
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
        }}>
            <div style={cardStyle}>

                {/* Flecha regresar */}
                <button
                    onClick={() => navigate("/dashboard/config")}
                    style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                    }}
                    title="Regresar"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                {/* Título */}
                <h2 style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    marginBottom: "28px",
                }}>
                    Listar Grupos
                </h2>

                {/* Dos columnas de tablas */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {renderTable(leftGroups)}
                    {renderTable(rightGroups)}
                </div>

                {/* Botones inferiores */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "24px",
                    marginTop: "28px",
                }}>
                    <button
                        style={{
                            padding: "12px 32px",
                            borderRadius: "30px",
                            background: "#50E5F9",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            color: "#111",
                        }}
                    >
                        Editar Grupos
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/config/groups/create")}
                        style={{
                            padding: "12px 32px",
                            borderRadius: "30px",
                            background: "#700D7C",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            color: "#fff",
                        }}
                    >
                        Crear grupo
                    </button>
                </div>
            </div>
        </div>
    );
}
