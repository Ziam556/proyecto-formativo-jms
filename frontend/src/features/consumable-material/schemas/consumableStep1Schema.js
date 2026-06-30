import { z } from "zod";

// Paso 1 — ID, Placa SENA, Nombre del elemento, Marca.
export const consumableStep1Schema = z.object({

    consumableMaterialId: z
        .string()
        .trim()
        .min(1, "El ID es requerido")
        .regex(/^[A-Za-z0-9-]+$/, "El ID solo puede contener letras, números y guiones"),

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

    materialBrand: z
        .string()
        .trim()
        .min(1, "La marca es requerida")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]+$/, "La marca tiene caracteres no válidos"),

});
