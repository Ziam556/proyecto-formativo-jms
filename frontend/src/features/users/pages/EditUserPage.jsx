import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";
import { AvatarUpload, BackButton } from "@/shared";
import UserEditForm from "../components/UserEditForm";
import { users } from "../data/users";

export default function EditUserPage() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const preloaded = location.state?.user ?? null;

    const [selectedUser, setSelectedUser] = useState(preloaded);
    const [isEnabled, setIsEnabled]       = useState(preloaded?.enabled ?? true);
    const [imageFile, setImageFile]       = useState(null);
    const [query, setQuery]               = useState("");

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
        : [];

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

                    {/* Toggle habilitado / deshabilitado */}
                    <button
                        type="button"
                        onClick={() => setIsEnabled((prev) => !prev)}
                        className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            isEnabled
                                ? "bg-emerald-400 hover:bg-emerald-500 text-white shadow-md shadow-emerald-400/40"
                                : "bg-gray-400 hover:bg-gray-500 text-white shadow-md shadow-gray-400/40"
                        }`}
                    >
                        {isEnabled ? "✓  Habilitado" : "✕  Deshabilitado"}
                    </button>
                </div>

                {/* ═══════════ PANEL CENTRAL: Formulario ═══════════ */}
                <div className="flex-1 min-w-0 rounded-2xl bg-[rgba(217,217,217,0.31)] backdrop-blur-[16px] border border-white/20 p-5 sm:p-7">
                    <UserEditForm
                        initialUser={selectedUser}
                        userImage={imageFile ? [imageFile] : []}
                        isEnabled={isEnabled}
                        onCancel={() => navigate("/dashboard/userpage")}
                    />
                </div>

                {/* ═══════════ PANEL DERECHO: Buscador ═══════════ */}
                <div className="w-full lg:w-[280px] flex-shrink-0 rounded-2xl bg-[rgba(217,217,217,0.15)] backdrop-blur-[16px] border border-white/20 p-4 flex flex-col gap-3">

                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar por nombre, documento o correo"
                            className="w-full bg-white/80 rounded-lg pl-8 pr-3 py-[10px] text-[0.78rem] text-gray-700 outline-none border border-white/30 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="bg-white/10 rounded-xl border border-white/20 flex flex-col overflow-hidden">
                        <p className="text-white text-xs px-3 py-2 border-b border-white/10 shrink-0 m-0 font-medium">
                            Resultados
                        </p>
                        <div className="flex flex-col overflow-y-auto max-h-[340px]">
                            {!query.trim() && (
                                <p className="text-white/40 text-[0.73rem] text-center py-6 px-3">
                                    Busca un usuario para editar
                                </p>
                            )}
                            {query.trim() && results.length === 0 && (
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
                                    <div className="w-8 h-8 rounded-full bg-[rgba(200,200,220,0.45)] flex items-center justify-center flex-shrink-0 border border-white/30">
                                        <User size={15} color="rgba(90,90,120,0.9)" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-white text-[0.75rem] font-semibold truncate leading-tight">
                                            {u.name}
                                        </span>
                                        <span className="text-white/55 text-[0.68rem] truncate leading-tight">
                                            {u.documentType} · {u.document}
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