import ReturnableMaterialRowActions from "../components/ReturnableMaterialRowActions";

// Formato personalizado que espera el componente DataTable:
// { id, label, accessor, format?, renderCell?, noToggle? }

const baseColumns = [
  { id: "id",            label: "SN",                  accessor: "id"            },
  { id: "plateSena",     label: "Placa SENA",           accessor: "plateSena"     },
  { id: "category",      label: "Categoría",            accessor: "category"      },
  { id: "elementName",   label: "Nombre del elemento",  accessor: "elementName"   },
  { id: "brand",         label: "Marca",                accessor: "brand"         },
  { id: "model",         label: "Modelo",               accessor: "model"         },
  { id: "serial",        label: "Serial",               accessor: "serial"        },
  { id: "state",         label: "Estado",               accessor: "state",        format: "state"    },
  { id: "technicalSheet",label: "Ficha Técnica",        accessor: "technicalSheet", format: "link" },
  { id: "accountHolder", label: "Cuentadante",          accessor: "accountHolder" },
  { id: "location",      label: "Ubicación",            accessor: "location"      },
  { id: "dimensions",    label: "Dimensiones",          accessor: "dimensions"    },
  { id: "inventory",    label: "Inventario",           accessor: "inventory"     },
];

export const returnableMaterialColumns = [
  ...baseColumns,
  {
    id:         "actions",
    label:      "Acciones",
    noToggle:   true,
    renderCell: (material) => <ReturnableMaterialRowActions material={material} />,
  },
];

export function getReturnableMaterialColumns(onToggle) {
  return [
    ...baseColumns,
    {
      id:       "actions",
      label:    "Acciones",
      noToggle: true,
      renderCell: (material) => (
        <ReturnableMaterialRowActions material={material} onToggle={onToggle} />
      ),
    },
  ];
}
