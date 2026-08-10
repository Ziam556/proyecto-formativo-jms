import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { BackButton, Field, Input, Button } from "@/shared";
import { formatDate } from "@/shared/utils/formatDate";
import { getUsers } from "../services/userService";
import { normalizeUser } from "../utils/normalizeUser";

const API_BASE = "http://localhost:4000";

function ProfileAvatar({ src, size = 72 }) {
    const iconSize = Math.round(size * 0.46);
    return (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-[rgba(255,255,255,0.4)] border-2 border-white overflow-hidden flex items-center justify-center flex-shrink-0"
        >
            {src ? (
                <img src={src} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
                <User size={iconSize} className="text-[#6b6b9a]" />
            )}
        </div>
    );
}

function SectionHeader({ number, title, color = "#7c3aed" }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[0.7rem] font-bold flex-shrink-0"
                style={{ backgroundColor: color }}
            >
                {number}
            </div>
            <span className="text-[0.75rem] font-semibold tracking-widest text-white uppercase">
                {title}
            </span>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ViewUserPage() {
    const navigate      = useNavigate();
    const { state }     = useLocation();

    const [searchQuery, setSearchQuery]     = useState("");
    const [user, setUser]                   = useState(state?.user ?? null);
    const [allUsers, setAllUsers]           = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef                        = useRef(null);

    // Cargar todos los usuarios
    useEffect(() => {
        getUsers()
            .then((rows) => setAllUsers(rows.map(normalizeUser)))
            .catch(() => {});
    }, []);

    // Cerrar dropdown al clic fuera
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target))
                setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Sugerencias en tiempo real
    const suggestions = searchQuery.trim()
        ? allUsers.filter((u) =>
            u.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            u.document?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            u.email?.toLowerCase().includes(searchQuery.trim().toLowerCase())
          ).slice(0, 8)
        : [];

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(true);
        if (!e.target.value.trim()) setUser(null);
    };

    const handleSelect = (u) => {
        setUser(u);
        setSearchQuery(u.name);
        setShowSuggestions(false);
    };

    return (
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-2xl p-6 mt-4">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
                <BackButton to="/dashboard/userpage" />
                <h1 className="text-white text-2xl font-bold">Visualizar Usuario</h1>
            </div>

            {/* BUSCADOR */}
            <div ref={wrapperRef} className="relative w-full sm:w-[320px] mb-6">
                <Input
                    label="Buscar por nombre, documento o correo"
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Escribe para buscar..."
                    autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1e1230] border border-white/20 rounded-xl overflow-hidden shadow-xl max-h-56 overflow-y-auto">
                        {suggestions.map((u) => (
                            <li
                                key={u.id}
                                onMouseDown={() => handleSelect(u)}
                                className="flex flex-col px-4 py-2 cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-0"
                            >
                                <span className="text-white text-xs font-semibold">{u.name}</span>
                                <span className="text-white/50 text-[10px]">{u.document} · {u.email}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1e1230] border border-white/20 rounded-xl px-4 py-3 text-white/50 text-xs shadow-xl">
                        Sin resultados
                    </div>
                )}
            </div>

            {/* DATOS DEL USUARIO */}
            {user ? (
                <>
                    {/* Perfil */}
                    <div className="flex items-center gap-4 mb-5">
                        <ProfileAvatar src={user.image ? `${API_BASE}/${user.image}` : null} />
                        <div className="flex flex-col gap-1">
                            <span className="text-white font-extrabold text-[1rem]">@{user.name}</span>
                            <span className="text-white/70 text-[0.82rem]">{user.documentType} {user.document}</span>
                            <span className="text-white/70 text-[0.82rem]">{user.email}</span>
                            {user.group && (
                                <span className="bg-purple-500/20 text-purple-200 text-[0.72rem] font-extrabold px-3 py-0.5 rounded-full w-fit">
                                    {user.group}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/20 mb-5" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                      {/* Sección 1 — Identidad */}
                      <div className="mb-5">
                          <SectionHeader number={1} title="Identidad" color="#7c3aed" />
                          <div className="flex flex-wrap gap-3">
                              <Field label="Nombre"              value={user.name}         />
                              <Field label="Tipo de documento"   value={user.documentType} />
                              <Field label="Número de documento" value={user.document}     />
                          </div>
                      </div>

                      {/* Sección 2 — Contacto */}
                      <div className="mb-5">
                          <SectionHeader number={2} title="Contacto" color="#0891b2" />
                          <div className="flex flex-wrap gap-3">
                              <Field label="Correo electrónico"     value={user.email}              />
                              <Field label="Teléfono"               value={user.phone}              />
                              <Field label="Dirección"              value={user.address}            />
                              <Field label="Correo institucional"   value={user.emailInstitutional} />
                          </div>
                      </div>
                    </div>

                    {/* Sección 3 — Cuenta y vigencia (ancho completo) */}
                    <div className="mb-5">
                        <SectionHeader number={3} title="Cuenta y vigencia" color="#059669" />
                        <div className="flex flex-wrap gap-3">
                            <Field label="Fecha inicio"       value={formatDate(user.startDate)} />
                            <Field label="Fecha finalización" value={formatDate(user.endDate)}   />
                            <Field label="Grupo asignado"     value={user.group}                 />
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/20 mb-5" />

                    {/* Botón editar */}
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/dashboard/userpage/edit", { state: { user } })}
                        >
                            Editar perfil
                        </Button>
                    </div>
                </>
            ) : (
                <p className="text-white/60 text-sm text-center mt-8">
                    Busca un usuario por nombre, documento o correo.
                </p>
            )}
        </div>
    );
}
