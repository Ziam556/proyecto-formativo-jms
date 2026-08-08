import { z } from "zod";

// Paso 1 — ID, Placa SENA, Nombre del elemento, Marca.
export const consumableStep1Schema = z.object({

    consumableMaterialId: z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9-]*$/, "El SN solo puede contener letras, números y guiones")
        .optional()
        .or(z.literal("")),

    materialPlate: z
        .string()
        .trim()
        .min(1, "La placa es requerida")
        .regex(/^[A-Za-z0-9-]+$/, "La placa solo puede contener letras, números y guiones"),

    materialElementName: z
        .string()
        .trim()
        .min(2, "El nombre del elemento debe tener mínimo 2 caracteres")
        .max(100, "El nombre del elemento es demasiado largo")
        .regex(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.\-()]+$/,
            "El nombre solo puede contener letras, números, espacios y puntuación básica"
        ),

    materialCategory: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    materialBrand: z
        .string()
        .trim()
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]*$/, "La marca tiene caracteres no válidos")
        .optional()
        .or(z.literal("")),

    materialInventory: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

});
