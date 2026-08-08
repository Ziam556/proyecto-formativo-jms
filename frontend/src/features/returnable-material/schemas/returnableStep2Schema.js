import { z } from "zod";

// Paso 2 — Marca, Modelo, Serial, Imagen, Fecha de compra, Fecha de ingreso.
export const returnableStep2Schema = z.object({

    materialBrand: z
        .string()
        .trim()
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]*$/, "La marca tiene caracteres no válidos")
        .optional()
        .or(z.literal("")),

    materialModel: z
        .string()
        .trim()
        .max(50, "El modelo no puede superar 50 caracteres")
        .regex(
            /^[A-Za-z0-9\s.\-_/]+$/,
            "El modelo tiene caracteres no válidos"
        )
        .optional()
        .or(z.literal("")),

    materialSerial: z
        .string()
        .trim()
        .max(50, "El serial no puede superar 50 caracteres")
        .regex(
            /^[A-Za-z0-9\s.\-_/]+$/,
            "El serial tiene caracteres no válidos"
        )
        .optional()
        .or(z.literal("")),

    materialImage: z
        .array(z.any())
        .min(1, "La imagen es requerida"),

    materialPurchaseDate: z
        .string()
        .refine((v) => !v || !isNaN(Date.parse(v)), "La fecha de compra no es válida")
        .refine((v) => !v || new Date(v) <= new Date(), "La fecha de compra no puede ser futura")
        .optional()
        .or(z.literal("")),

    materialEntryDate: z
        .string()
        .min(1, "La fecha de ingreso es requerida")
        .refine((v) => !isNaN(Date.parse(v)), "La fecha de ingreso no es válida")
        .refine((v) => new Date(v) <= new Date(), "La fecha de ingreso no puede ser futura"),

});
