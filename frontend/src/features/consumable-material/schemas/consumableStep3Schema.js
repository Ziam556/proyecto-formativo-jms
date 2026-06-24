import { z } from "zod";

// Paso 3 — Estado, Descripción, Fecha de compra, Ubicación.
export const consumableStep3Schema = z.object({

    materialState: z
        .string()
        .min(1, "El estado es requerido"),

    materialDescription: z
        .string()
        .trim()
        .min(5, "La descripción debe tener mínimo 5 caracteres"),

    purchaseDate: z
        .string()
        .min(1, "La fecha es requerida"),

    materialLocation: z
        .string()
        .trim()
        .min(1, "La ubicación es requerida"),

});
