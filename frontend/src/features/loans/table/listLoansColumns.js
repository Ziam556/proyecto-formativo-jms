  // Definición de columnas para la tabla de material devolutivo.
// Se usa con el componente DataTable.
// format: 'currency' | 'state' | 'link'
// accessor: clave del objeto de datos

export const listLoansColumns = [
  { id: "id",     label: "ID",     accessor: "id",     width: "50%" },
  { id: "user", label: "Usuario",     accessor: "user", width: "25%" },
  { id: "materiales",       label: "materiales",     accessor: "materiales",       width: "25%" },
  { id: "departureDate",       label: "Fecha salida",     accessor: "departureDate",       width: "25%" },
  { id: "deliveryDate",       label: "Fecha entrega",     accessor: "deliveryDate",       width: "25%" },
   {
    id: "accion",
    label: "Acción",
    accessor: "accion",
    width: "10%",
    format: "action",
    action: {
      label: "↩ Devolver",
      onClick: (row) => console.log("Devolver préstamo:", row.id),
    },
  },
];