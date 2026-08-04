import ConsumableMaterialRowActions from "../components/ConsumableMaterialRowActions";

// Formato personalizado que espera el componente DataTable:
// { id, label, accessor, format?, renderCell?, noToggle? }

const baseColumns = [
  { id: "id",            label: "SN",                  accessor: "id"            },
  { id: "plateSena",     label: "Placa Sena",           accessor: "plateSena"     },
  { id: "elementName",   label: "Nombre del elemento",  accessor: "elementName"   },
  { id: "brand",         label: "Marca",                accessor: "brand"         },
  { id: "purchaseDate",  label: "Fecha de compra",      accessor: "purchaseDate",  format: "date" },
  { id: "amount",        label: "Cantidad",             accessor: "amount"        },
  { id: "unitValue",     label: "Valor unitario",       accessor: "unitValue",    format: "currency" },
  { id: "totalValue",    label: "Valor total",          accessor: "totalValue",   format: "currency" },
  { id: "state",         label: "Estado",               accessor: "state",        format: "state"    },
  { id: "accountHolder", label: "Cuentadante",          accessor: "accountHolder" },
  { id: "location",      label: "Ubicación",            accessor: "location"      },
];

// Columnas estáticas (sin callback de toggle)
export const consumableMaterialColumns = [
  ...baseColumns,
  {
    id:         "actions",
    label:      "Acciones",
    noToggle:   true,
    renderCell: (material) => <ConsumableMaterialRowActions material={material} />,
  },
];

// Factory que inyecta el callback onToggle para refrescar la lista
export function getConsumableMaterialColumns(onToggle, selectedMaterials = [], onBulkToggle) {
  return [
    ...baseColumns,
    {
      id:       "actions",
      label:    "Acciones",
      noToggle: true,
      renderCell: (material) => (
        <ConsumableMaterialRowActions
          material={material}
          onToggle={onToggle}
          selectedCount={selectedMaterials.length}
          isSelected={selectedMaterials.some((m) => m.id === material.id)}
          onBulkToggle={onBulkToggle}
        />
      ),
    },
  ];
}
