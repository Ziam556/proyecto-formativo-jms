import ReturnableMaterialRowActions from "../components/ReturnableMaterialRowActions";

// Formato personalizado que espera el componente DataTable:
// { id, label, accessor, format?, renderCell?, noToggle? }

export const returnableMaterialColumns = [
  { id: "id",            label: "ID",                  accessor: "id"            },
  { id: "plateSena",     label: "Placa Sena",           accessor: "plateSena"     },
  { id: "category",      label: "Categoría",            accessor: "category"      },
  { id: "elementName",   label: "Nombre del elemento",  accessor: "elementName"   },
  { id: "brand",         label: "Marca",                accessor: "brand"         },
  { id: "model",         label: "Modelo",               accessor: "model"         },
  { id: "serial",        label: "Serial",               accessor: "serial"        },
  { id: "amount",        label: "Cantidad",             accessor: "amount"        },
  { id: "unitValue",     label: "Valor unitario",       accessor: "unitValue",    format: "currency" },
  { id: "totalValue",    label: "Valor total",          accessor: "totalValue",   format: "currency" },
  { id: "state",         label: "Estado",               accessor: "state",        format: "state"    },
  { id: "technicalSheet",label: "Ficha Técnica",        format: "link"            },
  { id: "accountHolder", label: "Cuentadante",          accessor: "accountHolder" },
  { id: "location",      label: "Ubicación",            accessor: "location"      },
  { id: "dimensions",    label: "Dimensiones",          accessor: "dimensions"    },
  {
    id:         "actions",
    label:      "Acciones",
    noToggle:   true,
    renderCell: (material) => <ReturnableMaterialRowActions material={material} />,
  },
];
