import { z } from "zod";

// Paso 2 — Imagen, Cuentadante, Cantidad, Valor unitario, Valor total.
// Cuentadante: SOLO nombre de persona (letras y espacios, sin números). Este es el campo
// que antes aceptaba cualquier valor no vacío, incluidos números.
export const consumableStep2Schema = z.object({

    materialImage: z
        .array(z.any())
        .optional(),

    materialStoryTeller: z
        .array(
            z.object({
                name:     z.string().min(1),
                document: z.string().min(1),
            })
        )
        .min(1, "Selecciona al menos un cuentadante"),

    materialAmount: z
        .string()
        .trim()
        .min(1, "La cantidad es requerida")
        .regex(/^\d+$/, "La cantidad debe ser un número entero positivo")
        .refine((v) => Number(v) > 0, "La cantidad debe ser mayor a 0"),

    materialUnitValue: z
        .string()
        .trim()
        .min(1, "El valor unitario es requerido")
        .regex(/^\d+(\.\d+)?$/, "El valor unitario debe ser un número válido")
        .refine((v) => Number(v) > 0, "El valor unitario debe ser mayor a 0"),

    materialTotalValue: z
        .string()
        .trim()
        .min(1, "El valor total es requerido")
        .regex(/^\d+(\.\d+)?$/, "El valor total debe ser un número válido")
        .refine((v) => Number(v) > 0, "El valor total debe ser mayor a 0"),

});
