import { z } from "zod";

// ── Validación de contraseña ───────────────────────────────────────────────
const passwordSchema = z
    .string()
    .min(10, "La contraseña debe tener mínimo 10 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial");

// ── Campos comunes (sin password) ─────────────────────────────────────────
const commonFields = {
    userName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(60, "El nombre es demasiado largo")
        .regex(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.\-']+$/,
            "El nombre solo puede contener letras, espacios, puntos y guiones"
        ),

    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),

    userEmailVerification: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar el email correctamente"),

    userEmailInstitutional: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email institucional válido")
        .optional()
        .or(z.literal("")),

    userSecondaryPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El teléfono secundario debe tener 10 dígitos")
        .optional()
        .or(z.literal("")),

    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userType: z
        .string()
        .min(1, "Debe seleccionar un tipo de usuario"),

    userDocumentNumber: z
        .string()
        .regex(/^[0-9]+$/, "El número de documento solo puede contener dígitos")
        .min(5, "El número de documento debe tener mínimo 5 dígitos")
        .max(15, "El número de documento no puede superar 15 dígitos"),

    startDate: z.string().optional().or(z.literal("")),
    endDate:   z.string().optional().or(z.literal("")),

    userAddress: z
        .string()
        .min(5, "La dirección debe tener mínimo 5 caracteres")
        .max(100, "La dirección es demasiado larga"),
};

// Tipos que NO requieren fechas
const TIPOS_SIN_FECHAS = ["Admin", "Inst"];

// ── Helper: aplica refinements comunes ────────────────────────────────────
const applyRefinements = (schema) =>
    schema
        .superRefine((data, ctx) => {
            const requiereFechas = !TIPOS_SIN_FECHAS.includes(data.userType);
            if (requiereFechas) {
                if (!data.startDate) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe seleccionar una fecha de inicio", path: ["startDate"] });
                }
                if (!data.endDate) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe seleccionar una fecha de finalización", path: ["endDate"] });
                }
            }
            if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La fecha de finalización debe ser mayor a la fecha de inicio", path: ["endDate"] });
            }
        })
        .refine(
            (data) => data.userEmail === data.userEmailVerification,
            {
                message: "Los correos electrónicos no coinciden",
                path: ["userEmailVerification"],
            }
        );

// ── Esquema creación: password requerido ──────────────────────────────────
export const userSchema = applyRefinements(
    z.object({ ...commonFields, userPassword: passwordSchema })
);

// ── Esquema edición: password vacío = sin cambio, o validación completa ───
export const userEditSchema = applyRefinements(
    z.object({
        ...commonFields,
        userPassword: z.union([z.literal(""), passwordSchema]),
    })
);
