import { z } from "zod";

export const loginSchema = z.object({


    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Debe ingresar un email"),
        

    userPassword: z    
        .string()
        .min(8, "Contraseña debe tener minimo 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayuscula")
        .regex(/[a-z]/, "Debe contener al menos una minuscula")
        .regex(/[0-9]/, "Debe contener al menos un numero")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un caracteres especial")

})