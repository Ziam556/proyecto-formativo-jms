import { StateChip } from "@/shared";
import ReturnableMaterialRowActions from "../components/ReturnableMaterialRowActions";



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
    cell: ({ getValue }) => <StateChip value={getValue()} customClasses={
  Disponible:      "bg-green-500 text-white",
  "No Disponible": "bg-amber-500 text-white",
  Prestamo:        "bg-blue-500 text-white",
  Baja:            "bg-red-500 text-white",
  Traslado:        "bg-purple-500 text-white",
  Mantenimiento:   "bg-gray-500 text-white",
} />,
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
    header: "Acciones",
    cell: ({ row }) => <ReturnableMaterialRowActions material={row.original} />,
  },
];
