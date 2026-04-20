// editLoanSchema.js
import { z } from "zod";

export const loanSchema = z.object({
    loanMaterialName: 
        z.string()
        .min(1, "La placa/nombre del material es requerida"),
    loanGroup: 
        z.string()
        .min(1, "El grupo es requerido"),
    loanStartDate: 
        z.string()
        .min(1, "La fecha de salida es requerida"),
    loanEstimatedDate: 
        z.string()
        .min(1, "La fecha estimada es requerida"),
    loanMaterials: 
        z.string()
        .min(1, "El material es requerido"),
    loanRequestingUser: 
        z.string()
        .min(1, "El usuario solicitante es requerido"),
});