import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { GroupOverlay, SecondaryPhoneOverlay } from "./UserOverlays";
import {
    Input, Button, Select, DatePicker,
    alertSuccess, alertError, alertWarning, alertConfirm,
} from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/features/users/services/selectService";
import { userEditSchema } from "../schemas/userSchema";
import { getGroups } from "@/features/groups/services/groupService";
import { updateUser } from "../services/userService";


// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
    userName:               "",
    userEmail:              "",
    userEmailVerification:  "",
    userEmailInstitutional: "",
    userPhone:              "",
    userSecondaryPhone:     "",
    userDocumentType:       "",
    userDocumentNumber:     "",
    userType:               "",
    userAddress:            "",
    userPassword:           "",
    startDate:              "",
    endDate:                "",
    userGroup:              null,
};

function buildForm(u) {
    if (!u) return { ...EMPTY_FORM };
    return {
        userName:               u.name               ?? "",
        userEmail:              u.email              ?? "",
        userEmailVerification:  u.email              ?? "",
        userEmailInstitutional: u.emailInstitutional ?? "",
        userPhone:              String(u.phone        ?? ""),
        userSecondaryPhone:     u.secondaryPhone     ?? "",
        userDocumentType:       u.documentType       ?? "",
        userDocumentNumber:     String(u.document    ?? ""),
        userType:               u.userType           ?? "",
        userAddress:            u.address            ?? "",
        userPassword:           "",
        startDate:              u.startDate          ?? "",
        endDate:                u.endDate            ?? "",
        userGroup:              u.group              ?? null,
    };
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function UserEditForm({ initialUser, userImage, isEnabled, onCancel }) {
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [documentTypes, setDocumentTypes]   = useState([]);
    const [userTypes, setUserTypes]           = useState([]);
    const [groups, setGroups]                 = useState([]);
    const [formData, setFormData]             = useState(buildForm(initialUser));
    const [errors, setErrors]                 = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    useEffect(() => {
        getDocumentTypes().then(setDocumentTypes);
        getUserTypes().then(setUserTypes);
        getGroups()
            .then((data) => setGroups(data.map((g) => ({ id: g.group_name, name: g.group_name, enabled: true }))))
            .catch(() => setGroups([]));
    }, []);

    useEffect(() => {
        setFormData(buildForm(initialUser));
        setErrors({});
    }, [initialUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGroupConfirm = (groupId) => {
        setFormData((prev) => ({ ...prev, userGroup: groupId }));
        setShowGroupModal(false);
    };

    const handlePhoneConfirm = (phone) => {
        setFormData((prev) => ({ ...prev, userSecondaryPhone: phone }));
        setShowPhoneModal(false);
    };

    const handleSubmit = async () => {
        // ── 1. Campos requeridos ──────────────────────────────────────────────
        const requiredFields = {
            userName:              "El nombre es requerido",
            userEmail:             "El correo es requerido",
            userEmailVerification: "La confirmación de correo es requerida",
            userPhone:             "El teléfono es requerido",
            userDocumentType:      "Debe seleccionar un tipo de documento",
            userDocumentNumber:    "El número de documento es requerido",
            userType:              "Debe seleccionar un tipo de usuario",
            userAddress:           "La dirección es requerida",
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
            // FIX: alerta de campos vacíos
            alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos antes de confirmar.");
            return;
        }

        // ── 2. Validación Zod ────────────────────────────────────────────────
        // userEditSchema acepta password vacío (sin cambio) o la validación completa
        const result = userEditSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            (result.error?.issues ?? []).forEach((issue) => {
                const field = issue.path?.[0];
                if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            // FIX: alerta de errores de formato
            alertError("Datos inválidos", "Revisa los campos marcados en rojo e intenta de nuevo.");
            return;
        }

        // ── 3. Confirmación antes de guardar ──────────────────────────────────
        // FIX: alertConfirm antes de llamar al backend
        const confirmed = await alertConfirm(
            "¿Confirmar cambios?",
            `Se actualizarán los datos de ${formData.userName}.`
        );
        if (!confirmed.isConfirmed) return;

        // ── 4. Llamada al backend ─────────────────────────────────────────────
        try {
            setIsSubmitting(true);
            setErrors({});

            const payload = {
                ...result.data,
                userEmailInstitutional: formData.userEmailInstitutional || null,
                userSecondaryPhone:     formData.userSecondaryPhone     || null,
                userGroup:              formData.userGroup              || null,
                isEnabled,
                userImage: null,
            };

            const imageFile = userImage?.[0] ?? null;
            await updateUser(initialUser.id, payload, imageFile);

            // FIX: alerta de éxito
            await alertSuccess("¡Usuario actualizado!", "Los datos se guardaron correctamente.");
            if (onCancel) onCancel();

        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            // FIX: alerta de error del backend
            alertError("Error al actualizar", err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
            setErrors({ general: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGroup = groups.find((g) => g.id === formData.userGroup);

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <Input labelVariant="light" label="Nombre" name="userName" placeholder="Ingresar nombre" value={formData.userName} onChange={handleChange} error={errors.userName} />
                    <Input labelVariant="light" label="Confirmación de correo electrónico" name="userEmailVerification" type="email" placeholder="Confirme su correo" value={formData.userEmailVerification} onChange={handleChange} error={errors.userEmailVerification} />

                    <Select labelVariant="light" label="Tipo de documento" name="userDocumentType" value={formData.userDocumentType} options={documentTypes} onChange={handleChange} error={errors.userDocumentType} placeholder="Tipo de documento" />

                    <div className="relative">
                        <Input labelVariant="light" label="Número telefónico de contacto" name="userPhone" type="tel" placeholder="Ingrese su teléfono" value={formData.userPhone} onChange={handleChange} error={errors.userPhone} />
                        <button
                            type="button"
                            title={formData.userSecondaryPhone ? `Secundario: ${formData.userSecondaryPhone}` : "Agregar número secundario"}
                            onClick={() => setShowPhoneModal(true)}
                            className={`absolute right-[10px] ${errors.userPhone ? "bottom-[26px]" : "bottom-[13px]"} w-[22px] h-[22px] rounded border-0 cursor-pointer flex items-center justify-center z-[2] ${formData.userSecondaryPhone ? "bg-[#50E5F9]" : "bg-[rgba(80,80,180,0.25)]"}`}
                        >
                            <Plus size={14} color="#fff" />
                        </button>
                    </div>

                    <Input labelVariant="light" label="Número de documento" name="userDocumentNumber" placeholder="Ingrese su número de documento" value={formData.userDocumentNumber} onChange={handleChange} error={errors.userDocumentNumber} />
                    <Input labelVariant="light" label="Dirección" name="userAddress" placeholder="Ingrese su dirección" value={formData.userAddress} onChange={handleChange} error={errors.userAddress} />

                    <Select labelVariant="light" label="Tipo de usuario" name="userType" value={formData.userType} options={userTypes} onChange={handleChange} error={errors.userType} placeholder="Tipo de usuario" />
                    <Input labelVariant="light" label="Correo institucional (opcional)" name="userEmailInstitutional" type="email" placeholder="Ingrese su correo institucional" value={formData.userEmailInstitutional} onChange={handleChange} error={errors.userEmailInstitutional} />

                    <DatePicker labelVariant="light" label="Fecha inicio" name="startDate" placeholder="Fecha inicio" value={formData.startDate} onChange={handleChange} error={errors.startDate} />
                    <Input labelVariant="light" label="Contraseña (dejar vacío para no cambiar)" name="userPassword" type="password" placeholder="••••••••••••" value={formData.userPassword} onChange={handleChange} error={errors.userPassword} />

                    <DatePicker labelVariant="light" label="Fecha finalización" name="endDate" placeholder="Fecha finalización" value={formData.endDate} onChange={handleChange} error={errors.endDate} />

                    <Input labelVariant="light" label="Correo electrónico" name="userEmail" type="email" placeholder="Ingrese su correo" value={formData.userEmail} onChange={handleChange} error={errors.userEmail} />

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



                    {errors.general && (
                        <div className="col-span-2 text-red-400 text-sm bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        {/* FIX: type="submit" para disparar el onSubmit del form */}
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Confirmar"}
                        </Button>
                    </div>

                </div>
            </form>

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