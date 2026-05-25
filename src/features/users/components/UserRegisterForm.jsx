import { useState, useEffect } from "react";
import { Camera, Plus, X, User } from "lucide-react";
import { Input, Button, Select, DatePicker, FileInput } from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/features/users/services/selectService";
import { userSchema } from "../schemas/userSchema";
import { initialGroups } from "@/features/groups/data/groups";
import { useNavigate } from "react-router-dom";

// ─── Overlay: Asignar Grupo ────────────────────────────────────────────────
function GroupOverlay({ groups, selectedId, onConfirm, onClose }) {
    const [tempId, setTempId] = useState(selectedId);
    const enabled = groups.filter((g) => g.enabled);

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: "linear-gradient(135deg, #700D7C 0%, #88A3C7 50%, #50E5F9 100%)",
                borderRadius: "16px", padding: "32px",
                minWidth: "320px", maxWidth: "420px", width: "90%",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ color: "#fff", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Seleccionar grupo
                    </h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de grupos */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", maxHeight: "280px", overflowY: "auto" }}>
                    {enabled.map((group) => (
                        <label
                            key={group.id}
                            style={{
                                display: "flex", alignItems: "center", gap: "12px",
                                padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                                background: tempId === group.id ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
                                color: "#fff", fontSize: "0.9rem",
                                transition: "background 0.2s",
                            }}
                        >
                            <input
                                type="radio"
                                name="groupSelect"
                                value={group.id}
                                checked={tempId === group.id}
                                onChange={() => setTempId(group.id)}
                                style={{ accentColor: "#50E5F9", width: "16px", height: "16px" }}
                            />
                            {group.name}
                        </label>
                    ))}
                </div>

                {/* Acciones */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 24px", borderRadius: "999px",
                            background: "rgba(255,255,255,0.2)", border: "none",
                            color: "#fff", cursor: "pointer", fontWeight: 500,
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(tempId)}
                        disabled={!tempId}
                        style={{
                            padding: "10px 24px", borderRadius: "999px",
                            background: tempId ? "#50E5F9" : "rgba(255,255,255,0.2)",
                            border: "none",
                            color: tempId ? "#111" : "#fff",
                            cursor: tempId ? "pointer" : "not-allowed",
                            fontWeight: 600,
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Overlay: Teléfono secundario ─────────────────────────────────────────
function SecondaryPhoneOverlay({ current, onConfirm, onClose }) {
    const [phone, setPhone] = useState(current || "");

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: "linear-gradient(135deg, #700D7C 0%, #88A3C7 50%, #50E5F9 100%)",
                borderRadius: "16px", padding: "32px",
                minWidth: "320px", maxWidth: "420px", width: "90%",
                boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ color: "#fff", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                        Número secundario
                    </h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
                        <X size={20} />
                    </button>
                </div>

                {current && (
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", marginBottom: "12px" }}>
                        Actual: <strong>{current}</strong>
                    </p>
                )}

                <Input
                    label="Número telefónico secundario"
                    name="secondaryPhone"
                    type="tel"
                    placeholder="Ingrese el número secundario"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {/* Acciones */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 24px", borderRadius: "999px",
                            background: "rgba(255,255,255,0.2)", border: "none",
                            color: "#fff", cursor: "pointer", fontWeight: 500,
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(phone)}
                        style={{
                            padding: "10px 24px", borderRadius: "999px",
                            background: "#50E5F9", border: "none",
                            color: "#111", cursor: "pointer", fontWeight: 600,
                        }}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function UserRegisterForm({ onCancel }) {
    const navigate = useNavigate();
    const [documentTypes, setDocumentTypes] = useState([]);
    const [userTypes, setUserTypes]         = useState([]);
    const [groups, setGroups]               = useState([]);

    const [formData, setFormData] = useState({
        userName:              "",
        userEmail:             "",
        userEmailVerification: "",
        userEmailInstitutional:"",
        userPhone:             "",
        userSecondaryPhone:    "",
        userDocumentType:      "",
        userDocumentNumber:    "",
        userType:              "",
        userAddress:           "",
        userPassword:          "",
        startDate:             "",
        endDate:               "",
        userGroup:             null,
        userImage:             [],
    });

    const [errors, setErrors]               = useState({});
    const [photoPreview, setPhotoPreview]   = useState(null);
    const [showGroupModal, setShowGroupModal]   = useState(false);
    const [showPhoneModal, setShowPhoneModal]   = useState(false);

    // Cargar selects y grupos al montar
    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
        getUserTypes().then(setUserTypes);
        const saved = localStorage.getItem("grupos_list");
        setGroups(saved ? JSON.parse(saved) : initialGroups);
    }, []);

    // Handler genérico para inputs / selects / datepickers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler para FileInput (imagen de perfil)
    const handleImageChange = (files) => {
        setFormData((prev) => ({ ...prev, userImage: files }));
        if (files.length > 0) {
            setPhotoPreview(URL.createObjectURL(files[0]));
        } else {
            setPhotoPreview(null);
        }
    };

    // Confirmar grupo seleccionado
    const handleGroupConfirm = (groupId) => {
        setFormData((prev) => ({ ...prev, userGroup: groupId }));
        setShowGroupModal(false);
    };

    // Confirmar teléfono secundario
    const handlePhoneConfirm = (phone) => {
        setFormData((prev) => ({ ...prev, userSecondaryPhone: phone }));
        setShowPhoneModal(false);
    };

    // Submit: primero verifica campos vacíos, luego valida formatos con Zod
    const handleSubmit = () => {

        // ── 1. Verificación de campos requeridos vacíos ──────────────────────
        const requiredFields = {
            userName:              "El nombre es requerido",
            userEmail:             "El correo es requerido",
            userEmailVerification: "La confirmación de correo es requerida",
            userPhone:             "El teléfono es requerido",
            userDocumentType:      "Debe seleccionar un tipo de documento",
            userDocumentNumber:    "El número de documento es requerido",
            userType:              "Debe seleccionar un tipo de usuario",
            userAddress:           "La dirección es requerida",
            userPassword:          "La contraseña es requerida",
            startDate:             "La fecha de inicio es requerida",
            endDate:               "La fecha de finalización es requerida",
        };

        const emptyErrors = {};
        for (const [field, msg] of Object.entries(requiredFields)) {
            const val = formData[field];
            if (!val || (typeof val === "string" && val.trim() === "")) {
                emptyErrors[field] = msg;
            }
        }

        if (Object.keys(emptyErrors).length > 0) {
            setErrors(emptyErrors);
            return;
        }

        // ── 2. Validación de formatos con Zod ────────────────────────────────
        const result = userSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            const issues = result.error?.issues ?? result.error?.errors ?? [];
            issues.forEach((issue) => {
                const field = issue.path?.[0];
                if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        // ── 3. Todo OK → registrar y navegar ─────────────────────────────────
        setErrors({});
        console.log("Usuario registrado:", result.data);
        navigate("/dashboard/userpage");
    };

    const selectedGroup = groups.find((g) => g.id === formData.userGroup);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row", gap: "48px", alignItems: "flex-start", width: "100%" }}>

                {/* ── Foto de perfil (izquierda) ── */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", minWidth: "160px" }}>

                    {/* Círculo con preview */}
                    <div style={{ position: "relative", width: "140px", height: "140px" }}>
                        <div style={{
                            width: "140px", height: "140px", borderRadius: "50%",
                            background: "rgba(200,200,220,0.45)",
                            border: "2px solid rgba(255,255,255,0.6)",
                            overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {photoPreview
                                ? <img src={photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Foto de perfil" />
                                : <User size={64} color="rgba(90,90,120,0.7)" />
                            }
                        </div>
                        {/* Icono de cámara */}
                        <div style={{
                            position: "absolute", bottom: "4px", right: "4px",
                            width: "34px", height: "34px", borderRadius: "50%",
                            background: "#71277A",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "2px solid #fff",
                            pointerEvents: "none",
                        }}>
                            <Camera size={16} color="#fff" />
                        </div>
                    </div>

                    {/* FileInput — patrón returnable material */}
                    <div className="flex flex-col gap-1" style={{ alignItems: "center" }}>
                        <label style={{ color: "#fff", fontSize: "0.75rem", textAlign: "center" }}>
                            Foto de perfil
                        </label>
                        <FileInput
                            value={formData.userImage}
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple={false}
                        />
                    </div>
                </div>

                {/* ── Formulario (derecha) ── */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div style={{ display: "grid", gridTemplateColumns: "320px 320px", gap: "20px" }}>

                        {/* Fila 1 */}
                        <Input
                            label="Nombre"
                            name="userName"
                            placeholder="Ingresar su nombre"
                            value={formData.userName}
                            onChange={handleChange}
                            error={errors.userName}
                        />
                        <Input
                            label="Confirmación de correo electrónico"
                            name="userEmailVerification"
                            type="email"
                            placeholder="Confirme su correo"
                            value={formData.userEmailVerification}
                            onChange={handleChange}
                            error={errors.userEmailVerification}
                        />

                        {/* Fila 2 */}
                        <Select
                            label="Tipo de documento"
                            name="userDocumentType"
                            value={formData.userDocumentType}
                            options={documentTypes}
                            onChange={handleChange}
                            error={errors.userDocumentType}
                            placeholder="Tipo de documento"
                        />

                        {/* Teléfono + botón "+" para número secundario */}
                        <div style={{ position: "relative" }}>
                            <Input
                                label="Número telefónico de contacto"
                                name="userPhone"
                                type="tel"
                                placeholder="Ingrese su teléfono"
                                value={formData.userPhone}
                                onChange={handleChange}
                                error={errors.userPhone}
                            />
                            <button
                                type="button"
                                title={formData.userSecondaryPhone
                                    ? `Secundario: ${formData.userSecondaryPhone}`
                                    : "Agregar número secundario"}
                                onClick={() => setShowPhoneModal(true)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    bottom: errors.userPhone ? "26px" : "13px",
                                    width: "22px", height: "22px",
                                    borderRadius: "4px",
                                    background: formData.userSecondaryPhone
                                        ? "#50E5F9"
                                        : "rgba(80,80,180,0.25)",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    zIndex: 2,
                                }}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Fila 3 */}
                        <Input
                            label="Número de documento"
                            name="userDocumentNumber"
                            placeholder="Ingrese su número de documento"
                            value={formData.userDocumentNumber}
                            onChange={handleChange}
                            error={errors.userDocumentNumber}
                        />
                        <Input
                            label="Dirección"
                            name="userAddress"
                            placeholder="Ingrese su dirección"
                            value={formData.userAddress}
                            onChange={handleChange}
                            error={errors.userAddress}
                        />

                        {/* Fila 4 */}
                        <Select
                            label="Tipo de usuario"
                            name="userType"
                            value={formData.userType}
                            options={userTypes}
                            onChange={handleChange}
                            error={errors.userType}
                            placeholder="Tipo de usuario"
                        />
                        <Input
                            label="Correo institucional (opcional)"
                            name="userEmailInstitutional"
                            type="email"
                            placeholder="Ingrese su correo institucional"
                            value={formData.userEmailInstitutional}
                            onChange={handleChange}
                            error={errors.userEmailInstitutional}
                        />

                        {/* Fila 5 */}
                        <DatePicker
                            label="Fecha inicio"
                            name="startDate"
                            placeholder="Fecha inicio"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={errors.startDate}
                        />
                        <Input
                            label="Contraseña"
                            name="userPassword"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={formData.userPassword}
                            onChange={handleChange}
                            error={errors.userPassword}
                        />

                        {/* Fila 6 */}
                        <DatePicker
                            label="Fecha finalización"
                            name="endDate"
                            placeholder="Fecha finalización"
                            value={formData.endDate}
                            onChange={handleChange}
                            error={errors.endDate}
                        />

                        {/* Botón Asignar Grupo */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", justifyContent: "flex-end" }}>
                            {selectedGroup && (
                                <span style={{ fontSize: "0.75rem", color: "#fff" }}>
                                    Grupo: <strong>{selectedGroup.name}</strong>
                                </span>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowGroupModal(true)}
                            >
                                Asignar Grupo
                            </Button>
                        </div>

                        {/* Fila 7 */}
                        <Input
                            label="Correo electrónico"
                            name="userEmail"
                            type="email"
                            placeholder="Ingrese su correo"
                            value={formData.userEmail}
                            onChange={handleChange}
                            error={errors.userEmail}
                        />

                        {/* Botón Registrar */}
                        <Button onClick={handleSubmit} variant="primary" size="md" type="button">
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>

            {/* ── Modal: Asignar Grupo ── */}
            {showGroupModal && (
                <GroupOverlay
                    groups={groups}
                    selectedId={formData.userGroup}
                    onConfirm={handleGroupConfirm}
                    onClose={() => setShowGroupModal(false)}
                />
            )}

            {/* ── Modal: Teléfono secundario ── */}
            {showPhoneModal && (
                <SecondaryPhoneOverlay
                    current={formData.userSecondaryPhone}
                    onConfirm={handlePhoneConfirm}
                    onClose={() => setShowPhoneModal(false)}
                />
            )}
        </>
    );
}
