// Definición de columnas para la tabla de material devolutivo.
// Se usa con el componente DataTable.
// format: 'currency' | 'state' | 'link'
// accessor: clave del objeto de datos

import { createElement } from "react";
import ConsumableMaterialRowActions from "../components/ConsumableMaterialRowActions";

export const consumableMaterialColumns = [
  { id: "id",             label: "ID",                  accessor: "id" },
  { id: "plateSena",      label: "Placa Sena",          accessor: "plateSena" },
  { id: "elementName",    label: "Nombre del elemento", accessor: "elementName" },
  { id: "brand",          label: "Marca",               accessor: "brand" },
  { id: "model",          label: "Modelo",              accessor: "model" },
  { id: "serial",         label: "Serial",              accessor: "serial" },
  { id: "purchaseDate",   label: "Fecha de compra",     accessor: "purchaseDate" },
  { id: "amount",         label: "Cantidad",            accessor: "amount" },
  { id: "unitValue",      label: "Valor unitario",      accessor: "unitValue",    format: "currency" },
  { id: "totalValue",     label: "Valor total",         accessor: "totalValue",   format: "currency" },
  { id: "state",          label: "Estado",              accessor: "state",        format: "state" },
  { id: "accountHolder",  label: "Cuentadante",         accessor: "accountHolder" },
  { id: "location",       label: "Ubicación",           accessor: "location" },
  { id: "actions",        label: "Acciones",            accessor: null,           noToggle: true, renderCell: (material) => createElement(ConsumableMaterialRowActions, { material }) },
];
