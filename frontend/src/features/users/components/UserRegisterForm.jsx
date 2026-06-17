import { useState, useEffect } from "react";
import { Camera, Plus, X, User } from "lucide-react";
import { Input, Button, Select, DatePicker, FileInput } from "@/shared";
import { getDocumentTypes, getUserTypes } from "@/features/users/services/selectService";
import { userSchema } from "../schemas/userSchema";
import { initialGroups } from "@/features/groups/data/groups";
import { createUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

// ─── Overlay: Asignar Grupo ────────────────────────────────────────────────
function GroupOverlay({ groups, selectedId, onConfirm, onClose }) {

    const [tempId, setTempId] = useState(selectedId);
    const enabled = groups.filter((g) => g.enabled);

    return (
        <div
            className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.55)] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-2xl p-8 min-w-[320px] max-w-[420px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white m-0 text-[1.1rem] font-semibold">
                        Seleccionar grupo
                    </h3>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de grupos */}
                <div className="flex flex-col gap-2 mb-6 max-h-[280px] overflow-y-auto">
                    {enabled.map((group) => (
                        <label
                            key={group.id}
                            className={`flex items-center gap-3 p-[10px_14px] rounded-lg cursor-pointer text-white text-[0.9rem] transition-colors duration-200 ${tempId === group.id ? "bg-[rgba(255,255,255,0.4)]" : "bg-[rgba(255,255,255,0.15)]"}`}
                        >
                            <input
                                type="radio"
                                name="groupSelect"
                                value={group.id}
                                checked={tempId === group.id}
                                onChange={() => setTempId(group.id)}
                                className="accent-[#50E5F9] w-4 h-4"
                            />
                            {group.name}
                        </label>
                    ))}
                </div>

                {/* Acciones */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="py-[10px] px-6 rounded-full bg-[rgba(255,255,255,0.2)] border-0 text-white cursor-pointer font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(tempId)}
                        disabled={!tempId}
                        className={`py-[10px] px-6 rounded-full border-0 font-semibold ${tempId ? "bg-[#50E5F9] text-[#111] cursor-pointer" : "bg-[rgba(255,255,255,0.2)] text-white cursor-not-allowed"}`}
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
            className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.55)] flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[linear-gradient(135deg,#700D7C_0%,#88A3C7_50%,#50E5F9_100%)] rounded-2xl p-8 min-w-[320px] max-w-[420px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-white m-0 text-[1.1rem] font-semibold">
                        Número secundario
                    </h3>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-white">
                        <X size={20} />
                    </button>
                </div>

                {current && (
                    <p className="text-[rgba(255,255,255,0.75)] text-[0.8rem] mb-3">
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
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="py-[10px] px-6 rounded-full bg-[rgba(255,255,255,0.2)] border-0 text-white cursor-pointer font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(phone)}
                        className="py-[10px] px-6 rounded-full bg-[#50E5F9] border-0 text-[#111] cursor-pointer font-semibold"
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
    const [IsSubmitting, setIsSubmitting] = useState(false)

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

    // Submit: primero verifica campos vacíos, luego valida formatos con Zod, luego llama al backend
    const handleSubmit = async () => {

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

        // ── 3. Llamada al backend ─────────────────────────────────────────────
        try {
            setIsSubmitting(true);
            setErrors({});

            // Combinamos los datos validados por Zod con los campos opcionales
            // que Zod no valida. userImage se excluye porque son File objects.
            const payload = {
                ...result.data,
                userEmailInstitutional: formData.userEmailInstitutional || null,
                userSecondaryPhone:     formData.userSecondaryPhone     || null,
                userGroup:              formData.userGroup               || null,
                userImage:              null,
            };

            // Pasamos el archivo de imagen (primer elemento del array) como segundo argumento
            const imageFile = formData.userImage?.[0] ?? null;
            await createUser(payload, imageFile);

            setFormData({
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
            setErrors({});
            setPhotoPreview(null);

        } catch (err) {
            console.error("Error al registrar usuario:", err);
            setErrors({ general: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGroup = groups.find((g) => g.id === formData.userGroup);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start w-full mx-auto">

                {/* ── Foto de perfil (izquierda) ── */}
                <div className="flex flex-col items-center gap-4 min-w-[160px]">

                    {/* Círculo con preview */}
                    <div className="relative w-[140px] h-[140px]">
                        <div className="w-[140px] h-[140px] rounded-full bg-[rgba(200,200,220,0.45)] border-2 border-[rgba(255,255,255,0.6)] overflow-hidden flex items-center justify-center">
                            {photoPreview
                                ? <img src={photoPreview} className="w-full h-full object-cover" alt="Foto de perfil" />
                                : <User size={64} color="rgba(90,90,120,0.7)" />
                            }
                        </div>
                        {/* Icono de cámara */}
                        <div className="absolute bottom-1 right-1 w-[34px] h-[34px] rounded-full bg-[#71277A] flex items-center justify-center border-2 border-white pointer-events-none">
                            <Camera size={16} color="#fff" />
                        </div>
                    </div>

                    {/* FileInput — patrón returnable material */}
                    <div className="flex flex-col gap-1 items-center">
                        <label className="text-white text-[0.75rem] text-center">
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
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

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
                        <div className="relative">
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
                                className={`absolute right-[10px] ${errors.userPhone ? "bottom-[26px]" : "bottom-[13px]"} w-[22px] h-[22px] rounded border-0 cursor-pointer flex items-center justify-center z-[2] ${formData.userSecondaryPhone ? "bg-[#50E5F9]" : "bg-[rgba(80,80,180,0.25)]"}`}
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
                        <div className="flex flex-col gap-1 justify-end">
                            {selectedGroup && (
                                <span className="text-[0.75rem] text-white">
                                    Grupo: <strong>{selectedGroup.name}</strong>
                                </span>
                            )}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="w-full"
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

                        {/* Error general del backend */}
                        {errors.general && (
                            <div className="col-span-2 text-red-400 text-sm bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                                {errors.general}
                            </div>
                        )}

                        {/* Botón Registrar */}
                        <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            className="w-full"
                            disabled={IsSubmitting}
                        >
                            {IsSubmitting ? "Guardando..." : "Guardar"}
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
