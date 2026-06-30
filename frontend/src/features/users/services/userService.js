const API_URL = "http://localhost:4000/api/users";

function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function getMyProfile() {
  const response = await fetch(`${API_URL}/me`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener el perfil");
  return response.json();
}

export async function getUsers() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener los usuarios");
  return response.json();
}

export async function createUser(userData, imageFile) {
  // FormData permite enviar el archivo junto con los campos de texto
  const formData = new FormData();

  const fields = [
    "userName", "userEmail", "userEmailVerification", "userEmailInstitutional",
    "userPhone", "userSecondaryPhone", "userDocumentType", "userDocumentNumber",
    "userType", "userAddress", "userPassword", "startDate", "endDate", "userGroup",
  ];

  fields.forEach((key) => {
    if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  // Adjuntar imagen solo si existe
  if (imageFile) {
    formData.append("userImage", imageFile);
  }

  // Sin Content-Type: el navegador lo pone automáticamente con el boundary correcto
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear el usuario");
  }

  return data;
}

export async function getUserPermissions(documentNumber) {
  const response = await fetch(`${API_URL}/${documentNumber}/permissions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al obtener permisos del usuario");
  return response.json(); // string[] de codenames
}

export async function assignUserPermissions(documentNumber, codenames) {
  const response = await fetch(`${API_URL}/${documentNumber}/permissions`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ codenames }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al asignar permisos");
  return data;
}

export async function updateUser(id, userData, imageFile) {
  const formData = new FormData();

  const fields = [
    "userName", "userEmail", "userEmailVerification", "userEmailInstitutional",
    "userPhone", "userSecondaryPhone", "userDocumentType", "userDocumentNumber",
    "userType", "userAddress", "userPassword", "startDate", "endDate",
    "userGroup", "isEnabled",
  ];

  fields.forEach((key) => {
    if (userData[key] !== null && userData[key] !== undefined) {
      formData.append(key, userData[key]);
    }
  });

  if (imageFile) {
    formData.append("userImage", imageFile);
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar el usuario");
  }

  return data;
}
