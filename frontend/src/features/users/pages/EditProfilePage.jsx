import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User } from "lucide-react";
import {
    Input, Button, Select, AvatarUpload, BackButton,
    alertSuccess, alertError, alertWarning, alertConfirm,
} from "@/shared";
import { SecondaryPhoneOverlay } from "../components/UserOverlays";
import { getDocumentTypes } from "@/features/users/services/selectService";
import { getMyProfile, updateUser } from "../services/userService";

const API_BASE = "http://localhost:4000";

// ─── Normaliza los datos de /me al formato que necesita el formulario ─────────
function profileToForm(p) {
    if (!p) return null;
    const phones      = Array.isArray(p.phones) ? p.phones : [];
    const primary     = phones.find((ph) => ph.is_primary)   ?? phones[0]   ?? null;
    const secondary   = phones.find((ph) => !ph.is_primary)  ?? null;
    return {
        userName:               p.user_name                || "",
        userEmail:              p.user_email               || "",
        userEmailVerification:  p.user_email               || "",
        userEmailInstitutional: p.user_email_institutional || "",
        userPhone:              primary?.phone_number       || "",
        userSecondaryPhone:     secondary?.phone_number    || "",
        userDocumentType:       p.user_document_type       || "",
        userDocumentNumber:     String(p.user_document_number ?? ""),
        userAddress:            p.user_address             || "",
    };
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function EditProfilePage() {
    const navigate = useNavigate();

    const [profile,      setProfile]      = useState(null);
    const [formData,     setFormData]     = useState(null);
    const [errors,       setErrors]       = useState({});
    const [imageFile,    setImageFile]    = useState(null);
    const [docTypes,     setDocTypes]     = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPhoneMod, setShowPhoneMod] = useState(false);

    // Cargar perfil propio y tipos de documento
    useEffect(() => {
        Promise.all([getMyProfile(), getDocumentTypes()])
            .then(([prof, types]) => {
                setProfile(prof);
                setFormData(profileToForm(prof));
                setDocTypes(types);
            })
            .catch(() => alertError("Error", "No se pudo cargar tu perfil."))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const cleaned = name === "userName"
            ? value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "")
            : value;
        setFormData((prev) => ({ ...prev, [name]: cleaned }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handlePhoneConfirm = (phone) => {
        setFormData((prev) => ({ ...prev, userSecondaryPhone: phone }));
        setShowPhoneMod(false);
    };

    const handleSubmit = async () => {
        // ── Validación básica ─────────────────────────────────────────────────
        const required = {
            userName:              "El nombre es requerido",
            userEmail:             "El correo es requerido",
            userEmailVerification: "La confirmación de correo es requerida",
            userPhone:             "El teléfono es requerido",
            userAddress:           "La dirección es requerida",
        };
        const errs = {};
        for (const [field, msg] of Object.entries(required)) {
            const v = formData[field];
            if (!v || String(v).trim() === "") errs[field] = msg;
        }
        if (formData.userEmail !== formData.userEmailVerification) {
            errs.userEmailVerification = "Los correos no coinciden";
        }
        // Imagen: nueva o ya tenía una
        const tieneImagen = !!imageFile || !!profile?.user_image;
        if (!tieneImagen) errs.userImage = "La foto de perfil es requerida";

        if (Object.keys(errs).length) {
            setErrors(errs);
            alertWarning("Campos incompletos", "Por favor completa todos los campos requeridos.");
            return;
        }

        const confirmed = await alertConfirm("¿Guardar cambios?", "Se actualizará tu información de perfil.");
        if (!confirmed.isConfirmed) return;

        try {
            setIsSubmitting(true);
            setErrors({});

            // Mantenemos los campos que el usuario NO puede cambiar desde aquí
            const payload = {
                userName:               formData.userName.trim(),
                userEmail:              formData.userEmail.trim(),
                userEmailVerification:  formData.userEmailVerification.trim(),
                userEmailInstitutional: formData.userEmailInstitutional.trim() || null,
                userPhone:              formData.userPhone.trim(),
                userSecondaryPhone:     formData.userSecondaryPhone?.trim() || null,
                userDocumentType:       formData.userDocumentType,
                userDocumentNumber:     formData.userDocumentNumber,
                userAddress:            formData.userAddress.trim(),
                userGroup:              profile?.user_group ?? null,
                startDate:              profile?.start_date
                    ? new Date(profile.start_date).toISOString().split("T")[0]
                    : null,
                endDate:                profile?.end_date
                    ? new Date(profile.end_date).toISOString().split("T")[0]
                    : null,
                isEnabled:              true,   // el usuario nunca se desactiva a sí mismo
                userPassword:           "",     // sin cambio de contraseña desde aquí
            };

            await updateUser(formData.userDocumentNumber, payload, imageFile ?? null);
            await alertSuccess("¡Perfil actualizado!", "Tus datos se guardaron correctamente.");
            navigate("/dashboard/userpage/profile");
        } catch (err) {
            alertError("Error al guardar", err.message || "Ocurrió un error inesperado.");
            setErrors({ general: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <p className="text-white/60 text-sm">Cargando perfil...</p>
            </div>
        );
    }
    if (!formData) return null;

    return (
        <div className="min-h-full flex flex-col box-border py-3 px-4 sm:px-10 gap-3 items-center justify-center">

            {/* ── Contenedor exterior (mismo estilo que UserProfilePage) ── */}
            <div className="w-full max-w-[860px] rounded-2xl bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] shadow-[0_8px_40px_rgba(0,0,0,0.3)] relative pt-7 px-6 sm:px-10 pb-6">

                <BackButton variant="light" />

                <h1 className="text-white font-bold text-[1.2rem] mb-5 text-center">
                    Editar mi perfil
                </h1>

                {/* ── Contenedor interior ── */}
                <div className="w-full rounded-xl bg-[rgba(255,255,255,0.31)] py-6 px-5 sm:px-8">

                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <AvatarUpload
                            value={imageFile}
                            onChange={setImageFile}
                            size={110}
                            previewUrl={
                                imageFile
                                    ? URL.createObjectURL(imageFile)
                                    : profile?.user_image
                                        ? `${API_BASE}/${profile.user_image}`
                                        : null
                            }
                        />
                        {errors.userImage && (
                            <p className="text-red-600 text-xs mt-1">{errors.userImage}</p>
                        )}
                        <p className="text-black/50 text-[0.73rem] mt-1">
                            Haz clic en la imagen para cambiarla
                        </p>
                    </div>

                    {/* Formulario */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                        {/* Nombre */}
                        <Input
                            labelVariant="dark" label="Nombre completo" name="userName"
                            placeholder="Ingrese su nombre" value={formData.userName}
                            onChange={handleChange} error={errors.userName} required
                        />

                        {/* Correo electrónico */}
                        <Input
                            labelVariant="dark" label="Correo electrónico" name="userEmail"
                            type="email" placeholder="correo@ejemplo.com" value={formData.userEmail}
                            onChange={handleChange} error={errors.userEmail} required
                        />

                        {/* Confirmación de correo */}
                        <Input
                            labelVariant="dark" label="Confirmar correo" name="userEmailVerification"
                            type="email" placeholder="Confirme su correo" value={formData.userEmailVerification}
                            onChange={handleChange} error={errors.userEmailVerification} required
                        />

                        {/* Correo institucional */}
                        <Input
                            labelVariant="dark" label="Correo institucional (opcional)"
                            name="userEmailInstitutional" type="email"
                            placeholder="correo@sena.edu.co" value={formData.userEmailInstitutional}
                            onChange={handleChange} error={errors.userEmailInstitutional}
                        />

                        {/* Teléfono + botón secundario */}
                        <div className="relative">
                            <Input
                                labelVariant="dark" label="Teléfono principal" name="userPhone"
                                type="tel" placeholder="Ej: 3001234567" value={formData.userPhone}
                                onChange={handleChange} error={errors.userPhone} required
                            />
                            <button
                                type="button"
                                title={formData.userSecondaryPhone
                                    ? `Secundario: ${formData.userSecondaryPhone}`
                                    : "Agregar teléfono secundario"}
                                onClick={() => setShowPhoneMod(true)}
                                className={`absolute right-[10px] ${errors.userPhone ? "bottom-[26px]" : "bottom-[13px]"} w-[22px] h-[22px] rounded border-0 cursor-pointer flex items-center justify-center z-[2] ${formData.userSecondaryPhone ? "bg-[#50E5F9]" : "bg-[rgba(80,80,180,0.25)]"}`}
                            >
                                <Plus size={14} color="#fff" />
                            </button>
                        </div>

                        {/* Dirección */}
                        <Input
                            labelVariant="dark" label="Dirección" name="userAddress"
                            placeholder="Calle, carrera, barrio…" value={formData.userAddress}
                            onChange={handleChange} error={errors.userAddress} required
                        />

                        {/* Tipo y número de documento (solo lectura) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-black/70 text-[0.78rem] font-semibold">
                                Tipo de documento <span className="text-black/40 font-normal">(no editable)</span>
                            </label>
                            <div className="bg-black/10 border border-black/20 rounded-[10px] px-3 py-[10px] text-black/60 text-[0.88rem]">
                                {formData.userDocumentType || "—"}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-black/70 text-[0.78rem] font-semibold">
                                Número de documento <span className="text-black/40 font-normal">(no editable)</span>
                            </label>
                            <div className="bg-black/10 border border-black/20 rounded-[10px] px-3 py-[10px] text-black/60 text-[0.88rem]">
                                {formData.userDocumentNumber || "—"}
                            </div>
                        </div>

                        {/* Error general */}
                        {errors.general && (
                            <div className="sm:col-span-2 text-red-700 text-sm bg-red-100/70 border border-red-400/40 rounded-lg p-3">
                                {errors.general}
                            </div>
                        )}

                        {/* Botones */}
                        <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                            <Button
                                type="button" variant="secondary"
                                onClick={() => navigate("/dashboard/userpage/profile")}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal teléfono secundario */}
            {showPhoneMod && (
                <SecondaryPhoneOverlay
                    current={formData.userSecondaryPhone}
                    onConfirm={handlePhoneConfirm}
                    onClose={() => setShowPhoneMod(false)}
                />
            )}
        </div>
    );
}
