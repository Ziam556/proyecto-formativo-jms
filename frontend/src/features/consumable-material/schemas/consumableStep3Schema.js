import { z } from "zod";

// Paso 3 — Estado, Descripción, Fecha de compra, Ubicación.
export const consumableStep3Schema = z.object({

    materialState: z
        .string()
        .min(1, "El estado es requerido"),

    materialDescription: z
        .string()
        .trim()
        .min(5, "La descripción debe tener mínimo 5 caracteres")
        .max(500, "La descripción no puede superar 500 caracteres"),

    purchaseDate: z
        .string()
        .min(1, "La fecha es requerida")
        .refine((v) => !isNaN(Date.parse(v)), "La fecha no es válida")
        .refine((v) => new Date(v) <= new Date(), "La fecha de compra no puede ser futura"),

    materialLocation: z
        .string()
        .trim()
        .min(1, "La ubicación es requerida")
        .max(150, "La ubicación no puede superar 150 caracteres"),

    entryDate: z
        .string()
        .min(1, "La fecha de ingreso es requerida")
        .refine((v) => !isNaN(Date.parse(v)), "La fecha de ingreso no es válida")
        .refine((v) => new Date(v) <= new Date(), "La fecha de ingreso no puede ser futura"),

});
