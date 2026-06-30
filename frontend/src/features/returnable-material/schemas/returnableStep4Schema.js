import { z } from "zod";

const dimensionField = (label) =>
    z
        .string()
        .trim()
        .min(1, `${label} es requerido`)
        .regex(/^\d+(\.\d+)?$/, `${label} debe ser un número válido`)
        .refine((v) => Number(v) > 0, `${label} debe ser mayor a 0`);

// Paso 4 — Estado, Ficha técnica, Descripción, Ubicación y (si aplica) Dimensiones.
// isMuebles controla si Ancho/Largo/Profundidad son obligatorios, igual que en el componente.
export const buildReturnableStep4Schema = (isMuebles) =>
    z.object({

        materialState: z
            .string()
            .min(1, "El estado es requerido"),

        materialTechnicalSheet: z
            .array(z.any())
            .min(1, "La ficha técnica es requerida"),

        materialDescription: z
            .string()
            .trim()
            .min(5, "La descripción debe tener mínimo 5 caracteres")
            .max(500, "La descripción no puede superar 500 caracteres"),

        materialLocation: z
            .string()
            .trim()
            .max(150, "La ubicación no puede superar 150 caracteres")
            .optional()
            .or(z.literal("")),

        materialWidth: isMuebles
            ? dimensionField("El ancho")
            : z.string().trim().optional().or(z.literal("")),

        materialLength: isMuebles
            ? dimensionField("El largo")
            : z.string().trim().optional().or(z.literal("")),

        materialDepth: isMuebles
            ? dimensionField("La profundidad")
            : z.string().trim().optional().or(z.literal("")),

    });
