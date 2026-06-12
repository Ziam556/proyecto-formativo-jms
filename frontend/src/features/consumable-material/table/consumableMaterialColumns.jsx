import ConsumableMaterialRowActions from "../components/ConsumableMaterialRowActions";

const stateColors = {
  Disponible: "bg-green-500",
  "No Disponible": "bg-amber-500",
  Prestamo: "bg-blue-500",
  Baja: "bg-red-500",
  Traslado: "bg-purple-500",
  Mantenimiento: "bg-gray-500",
};

function StateChip({ value }) {
  const colorClass =
    stateColors[value] || "bg-gray-500";

  return (
    <span
      className={`${colorClass} text-white rounded-full px-[10px] py-[2px] text-[0.78rem] font-semibold whitespace-nowrap`}
    >
      {value}
    </span>
  );
}

export const consumableMaterialColumns = [
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

  {
    accessorKey: "id",
    header: "ID",
  },

  {
    accessorKey: "plateSena",
    header: "Placa Sena",
  },

  {
    accessorKey: "elementName",
    header: "Nombre del elemento",
  },

  {
    accessorKey: "brand",
    header: "Marca",
  },

  {
    accessorKey: "model",
    header: "Modelo",
  },

  {
    accessorKey: "serial",
    header: "Serial",
  },

  {
    accessorKey: "purchaseDate",
    header: "Fecha de compra",
  },

  {
    accessorKey: "amount",
    header: "Cantidad",
  },

  {
    accessorKey: "unitValue",

    header: "Valor unitario",

    cell: ({ getValue }) =>
      getValue().toLocaleString(
        "es-CO",
        {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }
      ),
  },

  {
    accessorKey: "totalValue",

    header: "Valor total",

    cell: ({ getValue }) =>
      getValue().toLocaleString(
        "es-CO",
        {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }
      ),
  },

  {
    accessorKey: "state",

    header: "Estado",

    cell: ({ getValue }) => (
      <StateChip value={getValue()} />
    ),
  },

  {
    accessorKey: "accountHolder",
    header: "Cuentadante",
  },

  {
    accessorKey: "location",
    header: "Ubicación",
  },

  {
    id: "actions",

    cell: ({ row }) => (
      <ConsumableMaterialRowActions
        material={row.original}
      />
    ),
  },
];