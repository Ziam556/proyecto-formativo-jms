import { z } from "zod";

// Paso 2 — Marca, Modelo, Serial, Imagen, Fecha de compra.
// Marca: texto y números permitidos (ej: "3M", "HP"). Modelo/Serial son opcionales, sin formato estricto.
export const returnableStep2Schema = z.object({

    materialBrand: z
        .string()
        .trim()
        .min(1, "La marca es requerida")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]+$/, "La marca tiene caracteres no válidos"),

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


});
