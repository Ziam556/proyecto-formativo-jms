import LoansRowActions from "../components/LoansRowActions";

const stateColors = {
  Disponible: "bg-green-500",
  "No Disponible": "bg-amber-500",
  Prestamo: "bg-blue-500",
  Baja: "bg-red-500",
  Traslado: "bg-purple-500",
  Mantenimiento: "bg-gray-500",
};

function StateChip({ value }) {
  const colorClass = stateColors[value] || "bg-gray-500";

  return (
    <span
      className={`${colorClass} text-white rounded-full px-3 py-[2px] text-xs font-semibold whitespace-nowrap`}
    >
      {value}
    </span>
  );
}

export const LoansColumns = [
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

  { accessorKey: "material", header: "Material" },
  { accessorKey: "materialtype", header: "Tipo" },
  { accessorKey: "amount", header: "Cantidad" },

  {
    id: "state",
    header: "Estado",
    cell: ({ row }) => <StateChip value={row.original.state} />,
  },

  {
    id: "actions",
    cell: ({ row }) => <LoansRowActions material={row.original} />,
  },
];