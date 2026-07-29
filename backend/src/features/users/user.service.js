// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";
import  bcrypt  from "bcrypt";


// Exportamos el servicio de usuarios.
// El service representa la capa de lógica de negocio de la aplicación.
export const userService = {


  // Método encargado de crear un usuario
  // Recibe datos provenientes del controller,
  // idealmente ya validados a nivel estructural (DTO / schema)
  async createUser(data) {
    // Validar que el correo no esté ya registrado
    const existing = await userRepository.findByEmail(data.userEmail);
    if (existing) throw new Error(`El correo ${data.userEmail} ya está registrado`);

    const hashedPassword = await bcrypt.hash(data.userPassword, 10);
    const userData = { ...data, userPassword: hashedPassword };
    const user = await userRepository.create(userData);

    // Registrar en user_groups y copiar permisos del grupo al usuario
    if (data.userGroup) {
      await userRepository.assignGroup(user.user_id, data.userGroup);
      await userRepository.assignGroupPermissionsToUser(user.user_id, data.userGroup);
    }

    return user;
  },

  async getMe(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  },

  async getAll() {
    return await userRepository.findAll();
  },

  async getUserPermissions(documentNumber) {
    const userId = await userRepository.findUserIdByDocument(documentNumber);
    if (!userId) throw new Error("Usuario no encontrado");
    return userRepository.getPermissionsByUserId(userId);
  },

  async assignPermissions(documentNumber, codenames) {
    const userId = await userRepository.findUserIdByDocument(documentNumber);
    if (!userId) throw new Error("Usuario no encontrado");

    const permissionIds = await userRepository.getPermissionIdsByCodenames(codenames);
    await userRepository.assignPermissions(userId, permissionIds);
    return { userId, assigned: permissionIds.length };
  },

  async deleteUser(documentNumber) {
    const deleted = await userRepository.delete(documentNumber);
    if (!deleted) throw new Error("Usuario no encontrado");
    return deleted;
  },

  async updateUser(documentNumber, data) {
    // Hash de contraseña solo si viene una nueva
    let hashedPassword = null;
    if (data.userPassword && data.userPassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(data.userPassword, 10);
    }

    const updateData = {
      ...data,
      userPassword: hashedPassword, // null si no cambia
    };

    const updated = await userRepository.update(documentNumber, updateData);
    if (!updated) throw new Error("Usuario no encontrado");

    // Actualizar user_groups y permisos del grupo
    const userId = await userRepository.findUserIdByDocument(documentNumber);
    if (userId) {
      const newGroup = data.userGroup || null;
      await userRepository.assignGroup(userId, newGroup);
      if (newGroup) {
        await userRepository.assignGroupPermissionsToUser(userId, newGroup);
      } else {
        // Si se quitó el grupo, limpiar también los permisos individuales
        await userRepository.clearUserPermissions(userId);
      }
    }

    return updated;
  },

  async toggleUser(id) {
    const result = await userRepository.toggleUser(id);
    if (!result) throw new Error("Usuario no encontrado");
    return result;
  },
};
