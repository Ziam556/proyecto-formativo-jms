  // Definición de columnas para la tabla de material devolutivo.
// Se usa con el componente DataTable.
// format: 'currency' | 'state' | 'link'
// accessor: clave del objeto de datos

export const loansColumns = [
  { id: "material",     label: "Material",     accessor: "material",     width: "50%" },
  { id: "materialtype", label: "Tipo",         accessor: "materialtype", width: "25%" },
  { id: "amount",       label: "Cantidad",     accessor: "amount",       width: "25%" },
];