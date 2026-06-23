import { StateChip } from "@/shared";
import LoansRowActions from "../components/LoansRowActions";



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
    cell: ({ row }) => <StateChip value={row.original.state} customClasses={
  Disponible:      "bg-green-500 text-white",
  "No Disponible": "bg-amber-500 text-white",
  Prestamo:        "bg-blue-500 text-white",
  Baja:            "bg-red-500 text-white",
  Traslado:        "bg-purple-500 text-white",
  Mantenimiento:   "bg-gray-500 text-white",
} />,
  },

  {
    id: "actions",
    cell: ({ row }) => <LoansRowActions material={row.original} />,
  },
];