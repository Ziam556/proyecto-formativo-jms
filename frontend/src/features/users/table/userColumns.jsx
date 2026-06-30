import UserRowActions from "../components/UserRowActions";

// Columnas en el formato que espera el componente DataTable:
// { id, label, accessor, format?, renderCell? }

export const userColumns = [
    {
        id:       "name",
        label:    "Nombre",
        accessor: "name",
    },
    {
        id:       "email",
        label:    "Correo electrónico",
        accessor: "email",
    },
    {
        id:       "documentType",
        label:    "Tipo doc.",
        accessor: "documentType",
    },
    {
        id:       "document",
        label:    "Documento",
        accessor: "document",
    },
    {
        id:       "phone",
        label:    "Teléfono",
        accessor: "phone",
    },
    {
        id:       "address",
        label:    "Dirección",
        accessor: "address",
    },
    {
        id:       "userType",
        label:    "Tipo de usuario",
        accessor: "userType",
    },
    {
        id:       "startDate",
        label:    "Fecha de inicio",
        accessor: "startDate",
        format:   "date",
    },
    {
        id:       "endDate",
        label:    "Fecha de finalizacion",
        accessor: "endDate",
        format:   "date",
    },
    {
        id:         "actions",
        label:      "Acciones",
        noToggle:   true,
        renderCell: (user) => <UserRowActions user={user} />,
    },
];
