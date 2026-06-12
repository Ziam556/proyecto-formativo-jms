// editConsumableMaterialSchema.js
import { z } from "zod";

export const consumableMaterialSchema = z.object({

    consumableMaterialBrand: 
        z.string()
        .min(1, "La marca es requerida"),

    consumableMaterialImage: 
        z.string()
        .min(1, "La imagen es requerida"),

    consumableMaterialTechnicalSheet: 
        z.string()
        .min(1, "La imagen es requerida"),

    consumableMaterialPlate: 
        z.string()
        .min(1, "La placa SENA es requerida"),

    consumableMaterialSerial:
        z.string()
        .min(1, "El serial es requerido"),

    consumableMaterialElementName: 
        z.string()
        .min(1, "El nombre del elemento es requerido"),


    consumableMaterialPurchaseDate: 
        z.string()
        .min(1, "Debe seleccionar una fecha de compra"),

    consumableMaterialLocation: 
        z.string()
        .min(1, "La ubicación es requerida"),

    consumableMaterialUnitValue: 
        z.string()
        .min(1, "El valor unitario es requerido"),

    consumableMaterialTotalValue: 
        z.string()
        .min(1, "El valor total es requerido"),

    consumableMaterialAccountHolder: 
        z.string()
        .min(1, "El cuentadante es requerido"),

    consumableMaterialDescription: 
        z.string()
        .min(1, "La descripción es requerida"),

    consumableMaterialAmount: 
        z.string()
        .min(1, "La cantidad es requerida"),

    consumableMaterialState: 
        z.string()
        .min(1, "El estado es requerido"),
});

