import { z } from "zod";

export const materialSchema = z.object({

    materialPlate: 
        z.string()
        .min(1, "La placa es requerida"),

    materialCategory: 
        z.string()
        .min(1, "La categoría es requerida"),

    materialElementName: 
        z.string()
        .min(1, "El nombre del elemento es requerido"),

    materialBrand: 
        z.string()
        .min(1, "La marca es requerida"),

    materialModel: 
        z.string()
        .min(1, "El modelo es requerido"),

    MaterialPurchaseDate: 
        z.string()
        .min(1, "Debe seleccionar una fecha de compra"),    

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

    returnableMaterialId: 
        z.string()
        .min(1, "El ID es requerido"),

    returnableMaterialBrand: 
        z.string()
        .min(1, "La marca es requerida"),

    returnableMaterialPlate: 
        z.string()
        .min(1, "La placa es requerida"),

    returnableMaterialModel: 
        z.string()
        .min(1, "El modelo es requerido"),

    returnableMaterialAccountHolder: 
        z.string()
        .min(1, "El cuentadante es requerido"),

    returnableMaterialState: 
        z.string()
        .min(1, "El estado es requerido"),

    returnableMaterialAmount: 
        z.string()
        .min(1, "La cantidad es requerida"),

    returnableMaterialTechnicalSheet: 
        z.string()
        .min(1, "La ficha técnica es requerida"),

    returnableMaterialElementName: 
        z.string()
        .min(1, "El nombre del elemento es requerido"),

    returnableMaterialSerial: 
        z.string()
        .min(1, "El serial es requerido"),

    returnableMaterialCategory: 
        z.string()
        .min(1, "La categoría es requerida"),

    returnableMaterialUnitValue: 
        z.string()
        .min(1, "El valor unitario es requerido"),

    returnableMaterialTotalValue: 
        z.string()
        .min(1, "El valor total es requerido"),

    returnableMaterialDescription: 
        z.string()
        .min(1, "La descripción es requerida"),

    returnableMaterialLocation: 
        z.string()
        .min(1, "La ubicación es requerida"),

    returnableMaterialDimensions: 
        z.string()
        .min(1, "Las dimensiones son requeridas"),


});