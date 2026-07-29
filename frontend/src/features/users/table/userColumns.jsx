import UserRowActions from "../components/UserRowActions";

// Columnas en el formato que espera el componente DataTable:
// { id, label, accessor, format?, renderCell? }

const baseColumns = [
    { id: "name",         label: "Nombre",              accessor: "name"         },
    { id: "email",        label: "Correo electrónico",  accessor: "email"        },
    { id: "documentType", label: "Tipo doc.",            accessor: "documentType" },
    { id: "document",     label: "Documento",            accessor: "document"     },
    { id: "phone",        label: "Teléfono",             accessor: "phone"        },
    { id: "address",      label: "Dirección",            accessor: "address"      },
    { id: "group",        label: "Grupo",                accessor: "group"        },
    { id: "startDate",    label: "Fecha de inicio",      accessor: "startDate",   format: "date" },
    { id: "endDate",      label: "Fecha de finalización",accessor: "endDate",     format: "date" },
];

export const userColumns = [
    ...baseColumns,
    { id: "actions", label: "Acciones", noToggle: true, renderCell: (user) => <UserRowActions user={user} /> },
];

export function getUserColumns(onRefresh, selectedUsers = [], onBulkToggle) {
    return [
        ...baseColumns,
        {
            id:         "actions",
            label:      "Acciones",
            noToggle:   true,
            renderCell: (user) => (
                <UserRowActions
                    user={user}
                    onRefresh={onRefresh}
                    selectedCount={selectedUsers.length}
                    isSelected={selectedUsers.some((u) => u.document === user.document)}
                    onBulkToggle={onBulkToggle}
                />
            ),
        },
    ];
}
