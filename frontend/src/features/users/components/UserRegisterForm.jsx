import { useState, useEffect } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import { GroupOverlay, SecondaryPhoneOverlay } from "./UserOverlays";
import {
    Input, Button, Select, DatePicker, AvatarUpload,
    alertSuccess, alertError, alertWarning,
} from "@/shared";
import { getDocumentTypes } from "@/features/users/services/selectService";
import { userSchema } from "../schemas/userSchema";
import { getGroups } from "@/features/groups/services/groupService";
import { createUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const _d = new Date();
const TODAY = `${_d.getFullYear()}-${String(_d.getMonth() + 1).padStart(2, "0")}-${String(_d.getDate()).padStart(2, "0")}`;

// Genera contraseña automática: iniciales del nombre en mayúscula + número de documento + "*"
// Ej: "Sebastian Castaño Aguirre" + "1089602525" → "SCA1089602525*"
const generatePassword = (name = "", doc = "") => {
    const initials = name.trim().split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join("");
    if (!initials && !doc) return "";
    return `${initials}${doc}*`;
};

// ─── Estado vacío del formulario ──────────────────────────────────────────────
const EMPTY_FORM = {
    userName:               "",
    userEmail:              "",
    userEmailVerification:  "",
    userEmailInstitutional: "",
    userPhone:              "",
    userSecondaryPhone:     "",
    userDocumentType:       "",
    userDocumentNumber:     "",
    userAddress:            "",
    userPassword:           "",
    startDate:              TODAY,
    endDate:                "",
    userGroup:              null,
    userImage:              [],
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function UserRegisterForm({ onCancel }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [documentTypes, setDocumentTypes] = useState([]);
    const [groups, setGroups]               = useState([]);
    const [formData, setFormData]           = useState({ ...EMPTY_FORM });
    const [errors, setErrors]               = useState({});
    const [showGroupModal, setShowGroupModal]   = useState(false);
    const [showPhoneModal, setShowPhoneModal]   = useState(false);
    const [showPassword,   setShowPassword]     = useState(false);
    const [dataConsent,    setDataConsent]      = useState(false);

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
        getGroups()
            .then((data) => setGroups(data.map((g) => ({ id: g.group_name, name: g.group_name, enabled: true }))))
            .catch(() => setGroups([]));
    }, []);

    // Auto-genera la contraseña cada vez que cambia el nombre o el número de documento
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            userPassword: generatePassword(prev.userName, prev.userDocumentNumber),
        }));
    }, [formData.userName, formData.userDocumentNumber]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (file) => {
        setFormData((prev) => ({ ...prev, userImage: file ? [file] : [] }));
    };

    const handleGroupConfirm = (groupId) => {
        setFormData((prev) => ({ ...prev, userGroup: groupId }));
        setShowGroupModal(false);
    };

    const handlePhoneConfirm = (phone) => {
        setFormData((prev) => ({ ...prev, userSecondaryPhone: phone }));
        setShowPhoneModal(false);
    };

    const resetForm = () => {
        setFormData({ ...EMPTY_FORM });
        setErrors({});
    };

    const handleSubmit = async () => {
        // ── 1. Campos requeridos vacíos ───────────────────────────────────────
        const requieresFechas = formData.userGroup === "Invitado";
        const requiredFields = {
            userName:              "El nombre es requerido",
            userEmail:             "El correo es requerido",
            userEmailVerification: "La confirmación de correo es requerida",
            userPhone:             "El teléfono es requerido",
            userDocumentType:      "Debe seleccionar un tipo de documento",
            userDocumentNumber:    "El número de documento es requerido",
            userAddress:           "La dirección es requerida",
            userPassword:          "La contraseña es requerida",
            ...(requieresFechas && {
                startDate: "La fecha de inicio es requerida",
                endDate:   "La fecha de finalización es requerida",
            }),
        };

        const emptyErrors = {};
        for (const [field, msg] of Object.entries(requiredFields)) {
            const val = formData[field];
            if (!val || (typeof val === "string" && val.trim() === "")) {
                emptyErrors[field] = msg;
            }
        }

        // Validar imagen obligatoria
        if (!formData.userImage?.[0]) {
            emptyErrors.userImage = "La foto de perfil es requerida";
        }

        if (Object.keys(emptyErrors).length > 0) {
            setErrors(emptyErrors);
            alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de guardar.");
            return;
        }

        // ── Consentimiento de datos personales ───────────────────────────────
        if (!dataConsent) {
            alertWarning(
                "Autorización requerida",
                "Debes confirmar que el titular ha sido informado sobre el tratamiento de sus datos personales y ha dado su autorización."
            );
            return;
        }

        // ── 2. Validación Zod ─────────────────────────────────────────────────
        const result = userSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            const issues = result.error?.issues ?? result.error?.errors ?? [];
            issues.forEach((issue) => {
                const field = issue.path?.[0];
                if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            alertError("Datos inválidos", "Revisa los campos marcados en rojo e intenta de nuevo.");
            return;
        }

        // ── 3. Llamada al backend ─────────────────────────────────────────────
        try {
            setIsSubmitting(true);
            setErrors({});

            const payload = {
                ...result.data,
                userEmailInstitutional: formData.userEmailInstitutional || null,
                userSecondaryPhone:     formData.userSecondaryPhone     || null,
                userGroup:              formData.userGroup               || null,
                userImage:              null,
            };

            const imageFile = formData.userImage?.[0] ?? null;
            await createUser(payload, imageFile);

            await alertSuccess("¡Usuario creado!", "El usuario se registró correctamente.");
            resetForm();

        } catch (err) {
            console.error("Error al registrar usuario:", err);
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
            setErrors({ general: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGroup = groups.find((g) => g.id === formData.userGroup);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start w-full mx-auto">

                {/* ── Foto de perfil ── */}
                <div className="flex flex-col items-center gap-1">
                    <AvatarUpload
                        value={formData.userImage?.[0] ?? null}
                        onChange={handleImageChange}
                    />
                    {errors.userImage && (
                        <p className="text-red-500 text-[0.75rem] font-medium">{errors.userImage}</p>
                    )}
                </div>

                {/* ── Formulario ── */}
                {/* FIX: onSubmit en el form llama handleSubmit */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <Input labelVariant="dark" label="Nombre" name="userName" placeholder="Ingresar su nombre" value={formData.userName} onChange={handleChange} error={errors.userName} required />

                        <Select labelVariant="dark" label="Tipo de documento" name="userDocumentType" value={formData.userDocumentType} options={documentTypes} onChange={handleChange} error={errors.userDocumentType} placeholder="Tipo de documento" required />
                        <Input labelVariant="dark" label="Correo electrónico" name="userEmail" type="email" placeholder="Ingrese su correo" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} required />
                        <Input labelVariant="dark" label="Confirmación de correo electrónico" name="userEmailVerification" type="email" placeholder="Confirme su correo" value={formData.userEmailVerification} onChange={handleChange} error={errors.userEmailVerification} required />
                        <div className="relative">
                            <Input labelVariant="dark" label="Número telefónico de contacto" name="userPhone" type="tel" placeholder="Ingrese su teléfono" value={formData.userPhone} onChange={handleChange} error={errors.userPhone} required />
                            <button
                                type="button"
                                title={formData.userSecondaryPhone ? `Secundario: ${formData.userSecondaryPhone}` : "Agregar número secundario"}
                                onClick={() => setShowPhoneModal(true)}
                                className={`absolute right-[10px] ${errors.userPhone ? "bottom-[26px]" : "bottom-[13px]"} w-[22px] h-[22px] rounded border-0 cursor-pointer flex items-center justify-center z-[2] ${formData.userSecondaryPhone ? "bg-[#50E5F9]" : "bg-[rgba(80,80,180,0.25)]"}`}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <Input labelVariant="dark" label="Número de documento" name="userDocumentNumber" placeholder="Ingrese su número de documento" value={formData.userDocumentNumber} onChange={handleChange} error={errors.userDocumentNumber} required />
                        <Input labelVariant="dark" label="Dirección" name="userAddress" placeholder="Ingrese su dirección" value={formData.userAddress} onChange={handleChange} error={errors.userAddress} required />

                        <Input labelVariant="dark" label="Correo institucional (opcional)" name="userEmailInstitutional" type="email" placeholder="Ingrese su correo institucional" value={formData.userEmailInstitutional} onChange={handleChange} error={errors.userEmailInstitutional} />

                        <DatePicker labelVariant="dark" label="Fecha inicio (automática)" name="startDate" value={formData.startDate} onChange={() => {}} disabled />
                        {/* ── Contraseña auto-generada con ojo ── */}
                        <div className="relative">
                            <Input
                                labelVariant="dark"
                                label="Contraseña (auto-generada)"
                                name="userPassword"
                                type={showPassword ? "text" : "password"}
                                value={formData.userPassword}
                                onChange={() => {}}
                                readOnly
                                className="pr-10 cursor-default"
                                error={errors.userPassword}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className={`absolute right-[10px] ${errors.userPassword ? "bottom-[26px]" : "bottom-[13px]"} bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center z-[3]`}
                                tabIndex={-1}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword
                                    ? <EyeOff size={18} color="#444" strokeWidth={2.2} />
                                    : <Eye    size={18} color="#444" strokeWidth={2.2} />}
                            </button>
                        </div>

                        <DatePicker labelVariant="dark" label="Fecha finalización" name="endDate" placeholder="Fecha finalización" value={formData.endDate} onChange={handleChange} error={errors.endDate} />

                        {/* ── Autorización tratamiento de datos — ocupa toda la fila ── */}
                        <div className="sm:col-span-2 flex items-start gap-3 bg-black/10 border border-black/20 rounded-xl px-4 py-3 mt-1">
                            <input
                                id="dataConsent"
                                type="checkbox"
                                checked={dataConsent}
                                onChange={(e) => setDataConsent(e.target.checked)}
                                className="mt-[3px] w-4 h-4 shrink-0 accent-purple-700 cursor-pointer"
                            />
                            <label htmlFor="dataConsent" className="text-[0.78rem] text-black/80 leading-snug cursor-pointer select-none">
                                Confirmo que el titular de los datos ha sido <strong>informado</strong> sobre la recolección y tratamiento de su información personal
                                (nombre, documento, correo, teléfono, dirección) con fines de gestión de inventario del SENA,
                                y ha dado su <strong>autorización expresa</strong> de conformidad con la{" "}
                                <span className="font-semibold text-black">Ley 1581 de 2012</span> y el Decreto 1377 de 2013.
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                        </div>

                        {/* FIX: celda propia (misma fila/columna que un input) con ambos botones lado a lado */}
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                {selectedGroup && (
                                    <span className="text-[0.75rem] text-white block mb-1">
                                        Grupo: <strong>{selectedGroup.name}</strong>
                                    </span>
                                )}
                                {/* FIX: type="button" explícito para no disparar submit del form */}
                                <Button type="button" variant="secondary" onClick={() => setShowGroupModal(true)}>
                                    Asignar Grupo
                                </Button>
                            </div>

                            {/* FIX: type="submit" para que dispare el onSubmit del form */}
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>

                    </div>

                    {errors.general && (
                        <div className="mt-4 text-red-400 text-sm bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                            {errors.general}
                        </div>
                    )}
                </form>
            </div>

            {showGroupModal && (
                <GroupOverlay
                    groups={groups}
                    selectedId={formData.userGroup}
                    onConfirm={handleGroupConfirm}
                    onClose={() => setShowGroupModal(false)}
                />
            )}
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