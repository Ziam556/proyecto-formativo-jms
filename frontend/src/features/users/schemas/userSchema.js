import { z } from "zod";

export const userSchema = z.object({

    userName: z
        .string()
        .min(3, "El nombre debe tener minimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),

    userEmailVerification: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar el email correctamente"),

    // ── Opcionales ──────────────────────────────────────────────────────────
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
        .min(5, "Número de documento inválido")
        .max(20, "Número de documento demasiado largo"),

    userPassword: z
        .string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[a-z]/, "Debe contener al menos una minúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),

    startDate: z
        .string()
        .min(1, "Debe seleccionar una fecha de inicio"),

    endDate: z
        .string()
        .min(1, "Debe seleccionar una fecha de finalización"),

    userAddress: z
        .string()
        .min(5, "La dirección debe tener mínimo 5 caracteres")
        .max(100, "La dirección es demasiado larga"),

})
.refine(
    (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) > new Date(data.startDate);
    },
    {
        message: "La fecha de finalización debe ser mayor a la fecha de inicio",
        path: ["endDate"],
    }
)
.refine(
    (data) => data.userEmail === data.userEmailVerification,
    {
        message: "Los correos electrónicos no coinciden",
        path: ["userEmailVerification"],
    }
);