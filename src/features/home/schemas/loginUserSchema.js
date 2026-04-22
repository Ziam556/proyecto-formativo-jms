import { z } from "zod";

export const loginUserSchema = z.object({

    loginUserEmail: z
        .string()
        .min(1, "El correo es requerido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),

    loginUserPassword: z
        .string()
        .min(1, "La contraseña es requerida"),

})