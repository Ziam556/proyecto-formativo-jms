import { z } from "zod";

export const userSchema = z.object({

    userName : z
        .string()
        .min(3, "El nombre debe tener minimo 3 caracteres")
        .max(60, "El nombre es demasiado largo"),

    userEmail: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Debe ingresar un email"),
    
    userEmailVerification: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Debe ingresar el email correctamente"),    
    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El telefono debe tener 10 digitos"),
        
    userDocumentType: z
        .string()
        .min(1, "Debe seleccionar un tipo de documento"),

    userType: z
        .string()
        .min(1, "Debe seleccionar un tipo de usuario"),    
        
    userDocumentNumber: z
        .string()
        .min(5, "Numero de documento invalido")
        .max(20, "Numero de documento demasiado largo"),
        
    userPassword: z    
        .string()
        .min(8, "Contraseña debe tener minimo 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayuscula")
        .regex(/[a-z]/, "Debe contener al menos una minuscula")
        .regex(/[0-9]/, "Debe contener al menos un numero")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un caracteres especial"),

    startDate: z
        .string()
        .min(1, "Debe seleccionar una fecha de inicio"),

    endDate: z
        .string()
        .min(1, "Debe seleccionar una fecha de finalización"),
        
    userAddress: z
        .string()
        .min(5, "La dirección debe tener mínimo 5 caracteres")
        .max(100, "La dirección es demasiado larga"),    

})

.refine(
    (data) => new Date(data.fechaFinalizacion) > new Date(data.fechaInicio),
    {
        message: "La fecha de finalización debe ser mayor a la fecha de inicio",
        path: ["fechaFinalizacion"],
    }
);