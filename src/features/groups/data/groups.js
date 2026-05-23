// Datos iniciales de grupos.
// Se cargan en GroupsListPage si localStorage está vacío.

export const initialGroups = [
  { id: 1,  name: "Administradores",    enabled: true,  isEditing: false },
  { id: 2,  name: "Instructores",       enabled: true,  isEditing: false },
  { id: 3,  name: "Aprendices",         enabled: true,  isEditing: false },
  { id: 4,  name: "Coordinadores",      enabled: true,  isEditing: false },
  { id: 5,  name: "Soporte Técnico",    enabled: false, isEditing: false },
  { id: 6,  name: "Almacén",            enabled: true,  isEditing: false },
  { id: 7,  name: "Visitantes",         enabled: false, isEditing: false },
];
