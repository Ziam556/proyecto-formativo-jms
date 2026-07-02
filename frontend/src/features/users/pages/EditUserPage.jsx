import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { AvatarUpload, BackButton, SearchField, Switch } from "@/shared";
import UserEditForm from "../components/UserEditForm";
import { getUsers } from "../services/userService";
import { normalizeUsers } from "../utils/normalizeUser";

export default function EditUserPage() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const preloaded = location.state?.user ?? null;

    const [selectedUser, setSelectedUser] = useState(preloaded);
    const [isEnabled, setIsEnabled]       = useState(preloaded?.enabled ?? true);
    const [imageFile, setImageFile]       = useState(null);
    const [query, setQuery]               = useState("");
    const [users, setUsers]               = useState([]);
    const [loadError, setLoadError]       = useState(null);
    const [loading, setLoading]           = useState(true);

    const loadUsers = () => {
        setLoading(true);
        setLoadError(null);
        getUsers()
            .then((rows) => normalizeUsers(rows))
            .then((normalized) => { setUsers(normalized); setLoading(false); })
            .catch((err) => {
                console.error("Error al cargar usuarios:", err);
                setLoadError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => { loadUsers(); }, []);

    const handleSelectUser = (u) => {
        setSelectedUser(u);
        setIsEnabled(u.enabled ?? true);
        setImageFile(null);
        setQuery("");
    };

    const results = query.trim()
        ? users
            .filter((u) =>
                u.name?.toLowerCase().includes(query.toLowerCase()) ||
                String(u.document).includes(query) ||
                u.email?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10)
        : users.slice(0, 10);

    return (
        <div className="min-h-[calc(100vh-72px)] flex flex-col box-border py-5 px-3 sm:px-6 items-center justify-center">

            <div className="w-full max-w-[1280px] flex flex-col lg:flex-row gap-4 items-start">

                {/* ═══════════ PANEL IZQUIERDO: Avatar + Toggle ═══════════ */}
                <div className="w-full lg:w-[200px] flex-shrink-0 rounded-2xl bg-[rgba(217,217,217,0.15)] backdrop-blur-[16px] border border-white/20 py-6 px-4 flex flex-col items-center gap-6 relative min-h-[260px]">

                    <BackButton to="/dashboard/userpage" />

                    {/* Avatar */}
                    <AvatarUpload
                        value={imageFile}
                        onChange={setImageFile}
                        size={130}
                        previewUrl={selectedUser?.image
                            ? `http://localhost:4000/${selectedUser.image}`
                            : null
                        }
                    />

                    {/* Switch habilitado / deshabilitado */}
                    <div className="flex items-center gap-3">
                        <Switch checked={isEnabled} onChange={setIsEnabled} />
                        <span className="text-sm font-semibold text-white">
                            {isEnabled ? "Habilitado" : "Deshabilitado"}
                        </span>
                    </div>
                </div>

                {/* ═══════════ PANEL CENTRAL: Formulario ═══════════ */}
                <div className="flex-1 min-w-0 rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-[16px] border border-white/20 p-5 sm:p-7">
                    <UserEditForm
                        initialUser={selectedUser}
                        userImage={imageFile ? [imageFile] : []}
                        isEnabled={isEnabled}
                        onCancel={() => { setSelectedUser(null); setImageFile(null); loadUsers(); }}
                    />
                </div>

                {/* ═══════════ PANEL DERECHO: Buscador ═══════════ */}
                <div className="w-full lg:w-[280px] flex-shrink-0 rounded-2xl bg-[rgba(217,217,217,0.15)] backdrop-blur-[16px] border border-white/20 p-4 flex flex-col gap-3">

                    <SearchField
                        value={query}
                        onChange={setQuery}
                        onClear={() => setQuery("")}
                        placeholder="Buscar por nombre, documento o correo"
                        fullWidth
                        size="sm"
                    />

                    {loadError && (
                        <p className="text-red-300 text-[0.72rem] bg-red-900/30 border border-red-400/30 rounded-lg px-3 py-2">
                            Error al cargar usuarios: {loadError}
                        </p>
                    )}

                    <div className="bg-white/10 rounded-xl border border-white/20 flex flex-col overflow-hidden">
                        <p className="text-white text-xs px-3 py-2 border-b border-white/10 shrink-0 m-0 font-medium">
                            Resultados
                        </p>
                        <div className="flex flex-col overflow-y-auto max-h-[340px]">
                            {loading && (
                                <p className="text-white/40 text-[0.73rem] text-center py-6 px-3">
                                    Cargando usuarios...
                                </p>
                            )}
                            {!loading && !loadError && users.length === 0 && (
                                <p className="text-white/40 text-[0.73rem] text-center py-6 px-3">
                                    No hay usuarios registrados
                                </p>
                            )}
                            {!loading && query.trim() && results.length === 0 && (
                                <p className="text-white/50 text-[0.73rem] text-center py-6">
                                    Sin resultados
                                </p>
                            )}
                            {results.map((u) => (
                                <button
                                    key={u.id}
                                    type="button"
                                    onClick={() => handleSelectUser(u)}
                                    className={`flex items-center gap-2 px-3 py-[10px] text-left hover:bg-white/20 transition-colors border-b border-white/10 last:border-0 w-full ${
                                        selectedUser?.id === u.id ? "bg-white/25" : ""
                                    }`}
                                >
                                    <User size={14} className="text-white/60 shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white text-[0.76rem] font-medium truncate">
                                            {u.name || u.email}
                                        </span>
                                        <span className="text-white/50 text-[0.68rem] truncate">
                                            {u.document}{u.group ? ` · ${u.group}` : ""}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
