import { z } from "zod";

export const materialSchema = z.object({
    
    materialBrand: 
        z.string()
        .min(1, "La marca es requerida"),

    materialModel: 
        z.string()
        .min(1, "El modelo es requerido"),

    materialSerial: 
        z.string().
        min(1, "El serial es requerido"),

    materialImage: 
        z.string()
        .min(1, "La imagen es requerida"),

    materialStoryTeller: 
        z.string()
        .min(1, "El cuentadante es requerido"),

    materialAmount: 
        z.string()
        .min(1, "La cantidad es requerida"),

    materialUnitValue: 
        z.string()
        .min(1, "El valor unitario es requerido"),

    materialTotalValue: 
        z.string()
        .min(1, "El valor total es requerido"),
    
    materialState: 
        z.string()
        .min(1, "El estado es requerido"),

    materialTechnicalSheet: 
        z.string()
        .min(1, "La ficha técnica es requerida"),

    materialDescription: 
        z.string()
        .min(1, "La descripción es requerida"),

    materialLocation: 
        z.string()
        .min(1, "La ubicación es requerida"),

    materialDimensions: 
        z.string()
        .min(1, "Las dimensiones son requeridas"),

});