import ReturnableMaterialRowActions from "../components/ReturnableMaterialRowActions";

const stateColors = {
  Disponible: "var(--color-success, #22c55e)",
  "No Disponible": "var(--color-warning, #f59e0b)",
  Prestamo: "var(--color-info, #3b82f6)",
  Baja: "var(--color-danger, #ef4444)",
  Traslado: "var(--color-purple, #a855f7)",
  Mantenimiento: "var(--color-secondary, #6b7280)",
};

function StateChip({ value }) {
  const color = stateColors[value] || "#6b7280";
  return (
    <span
      className="text-white rounded-full py-[2px] px-[10px] text-[0.78rem] font-semibold whitespace-nowrap"
      style={{ background: color }}
    >
      {value}
    </span>
  );
}

export const returnableMaterialColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "plateSena", header: "Placa Sena" },
  { accessorKey: "category", header: "Categoría" },
  { accessorKey: "elementName", header: "Nombre del elemento" },
  { accessorKey: "brand", header: "Marca" },
  { accessorKey: "model", header: "Modelo" },
  { accessorKey: "serial", header: "Serial" },
  { accessorKey: "purchaseDate", header: "Fecha de compra" },
  { accessorKey: "amount", header: "Cantidad" },
  {
    accessorKey: "unitValue",
    header: "Valor unitario",
    cell: ({ getValue }) =>
      getValue().toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),
  },
  {
    accessorKey: "totalValue",
    header: "Valor total",
    cell: ({ getValue }) =>
      getValue().toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }),
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ getValue }) => <StateChip value={getValue()} />,
  },
  {
    id: "technicalSheet",
    header: "Ficha Técnica",
    cell: () => (
      <a href="#" className="text-[#7c3aed] underline text-[0.85rem]">
        Ver ficha
      </a>
    ),
  },
  { accessorKey: "accountHolder", header: "Cuentadante" },
  { accessorKey: "location", header: "Ubicación" },
  { accessorKey: "dimensions", header: "Dimensiones" },
  {
    id: "actions",
    cell: ({ row }) => <ReturnableMaterialRowActions material={row.original} />,
  },
];
