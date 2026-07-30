import { z } from "zod";

// Paso 1 — ID, Placa SENA, Categoría, Nombre del elemento.
// IDs y placas: alfanuméricos (pueden incluir guiones). Nombre: solo texto, sin números sueltos.
export const returnableStep1Schema = z.object({

    returnableMaterialId: z
        .string()
        .trim()
        .min(1, "El código es requerido")
        .regex(/^[A-Za-z0-9-]+$/, "El código solo puede contener letras, números y guiones"),

    materialPlate: z
        .string()
        .trim()
        .min(1, "La placa es requerida")
        .regex(/^[A-Za-z0-9-]+$/, "La placa solo puede contener letras, números y guiones"),

    materialCategory: z
        .string()
        .min(1, "La categoría es requerida"),

    materialElementName: z
        .string()
        .trim()
        .min(2, "El nombre del elemento debe tener mínimo 2 caracteres")
        .max(100, "El nombre del elemento es demasiado largo")
        .regex(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.\-()]+$/,
            "El nombre solo puede contener letras, números, espacios y puntuación básica"
        ),

    // Cuentadante: SOLO nombre de persona (letras y espacios, sin números).
    materialStoryTeller: z
        .string()
        .trim()
        .min(3, "El cuentadante debe tener mínimo 3 caracteres")
        .max(80, "El nombre del cuentadante es demasiado largo")
        .regex(
            /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s.\-']+$/,
            "El cuentadante debe ser un nombre válido, sin números"
        ),

});
