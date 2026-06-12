const API_URL = "http://localhost:4000/api/users";

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
