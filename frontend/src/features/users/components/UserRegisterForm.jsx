import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

const TODAY = new Date().toISOString().split("T")[0];

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
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
        getGroups()
            .then((data) => setGroups(data.map((g) => ({ id: g.group_name, name: g.group_name, enabled: true }))))
            .catch(() => setGroups([]));
    }, []);

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

        if (Object.keys(emptyErrors).length > 0) {
            setErrors(emptyErrors);
            alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de guardar.");
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
                <AvatarUpload
                    value={formData.userImage?.[0] ?? null}
                    onChange={handleImageChange}
                />

                {/* ── Formulario ── */}
                {/* FIX: onSubmit en el form llama handleSubmit */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <Input labelVariant="dark" label="Nombre" name="userName" placeholder="Ingresar su nombre" value={formData.userName} onChange={handleChange} error={errors.userName} />

                        <Select labelVariant="dark" label="Tipo de documento" name="userDocumentType" value={formData.userDocumentType} options={documentTypes} onChange={handleChange} error={errors.userDocumentType} placeholder="Tipo de documento" />
                        <Input labelVariant="dark" label="Correo electrónico" name="userEmail" type="email" placeholder="Ingrese su correo" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} />
                        <Input labelVariant="dark" label="Confirmación de correo electrónico" name="userEmailVerification" type="email" placeholder="Confirme su correo" value={formData.userEmailVerification} onChange={handleChange} error={errors.userEmailVerification} />
                        <div className="relative">
                            <Input labelVariant="dark" label="Número telefónico de contacto" name="userPhone" type="tel" placeholder="Ingrese su teléfono" value={formData.userPhone} onChange={handleChange} error={errors.userPhone} />
                            <button
                                type="button"
                                title={formData.userSecondaryPhone ? `Secundario: ${formData.userSecondaryPhone}` : "Agregar número secundario"}
                                onClick={() => setShowPhoneModal(true)}
                                className={`absolute right-[10px] ${errors.userPhone ? "bottom-[26px]" : "bottom-[13px]"} w-[22px] h-[22px] rounded border-0 cursor-pointer flex items-center justify-center z-[2] ${formData.userSecondaryPhone ? "bg-[#50E5F9]" : "bg-[rgba(80,80,180,0.25)]"}`}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <Input labelVariant="dark" label="Número de documento" name="userDocumentNumber" placeholder="Ingrese su número de documento" value={formData.userDocumentNumber} onChange={handleChange} error={errors.userDocumentNumber} />
                        <Input labelVariant="dark" label="Dirección" name="userAddress" placeholder="Ingrese su dirección" value={formData.userAddress} onChange={handleChange} error={errors.userAddress} />

                        <Input labelVariant="dark" label="Correo institucional (opcional)" name="userEmailInstitutional" type="email" placeholder="Ingrese su correo institucional" value={formData.userEmailInstitutional} onChange={handleChange} error={errors.userEmailInstitutional} />

                        <DatePicker labelVariant="dark" label="Fecha inicio (automática)" name="startDate" value={formData.startDate} onChange={() => {}} disabled />
                        <Input labelVariant="dark" label="Contraseña" name="userPassword" type="password" placeholder="Ingrese su contraseña" value={formData.userPassword} onChange={handleChange} error={errors.userPassword} />

                        <DatePicker labelVariant="dark" label="Fecha finalización" name="endDate" placeholder="Fecha finalización" value={formData.endDate} onChange={handleChange} error={errors.endDate} />

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