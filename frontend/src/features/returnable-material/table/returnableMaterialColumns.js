// Definición de columnas para la tabla de material devolutivo.
// Se usa con el componente DataTable.
// format: 'currency' | 'state' | 'link'
// accessor: clave del objeto de datos

import { createElement } from "react";
import ReturnableMaterialRowActions from "../components/ReturnableMaterialRowActions";

const baseColumns = [
  { id: "id",             label: "SN",                  accessor: "id" },
  { id: "plateSena",      label: "Placa Sena",          accessor: "plateSena" },
  { id: "category",       label: "Categoría",           accessor: "category" },
  { id: "elementName",    label: "Nombre del elemento", accessor: "elementName" },
  { id: "brand",          label: "Marca",               accessor: "brand" },
  { id: "model",          label: "Modelo",              accessor: "model" },
  { id: "serial",         label: "Serial",              accessor: "serial" },
  { id: "amount",         label: "Cantidad",            accessor: "amount" },
  { id: "unitValue",      label: "Valor unitario",      accessor: "unitValue",    format: "currency" },
  { id: "totalValue",     label: "Valor total",         accessor: "totalValue",   format: "currency" },
  { id: "state",          label: "Estado",              accessor: "state",        format: "state" },
  { id: "technicalSheet", label: "Ficha Técnica",       accessor: "technicalSheet", renderCell: (m) => m.technicalSheet
      ? createElement("a", { href: `http://localhost:4000/${m.technicalSheet}`, target: "_blank", rel: "noopener noreferrer", className: "text-[#93c5fd] underline text-[0.82rem]" }, "Ver ficha")
      : "—" },
  { id: "accountHolder",  label: "Cuentadante",         accessor: "accountHolder" },
  { id: "location",       label: "Ubicación",           accessor: "location" },
  { id: "dimensions",     label: "Dimensiones",         accessor: "dimensions" },
];

export const returnableMaterialColumns = baseColumns;

export function getReturnableMaterialColumns(onToggle) {
  return [
    ...baseColumns,
    {
      id: "actions", label: "Acciones", accessor: null, noToggle: true,
      renderCell: (material) => createElement(ReturnableMaterialRowActions, { material, onToggle }),
    },
  ];
}
