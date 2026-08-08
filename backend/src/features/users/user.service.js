// Importamos el repositorio de usuarios.
// El service depende del repository para acceder a la persistencia,
// pero el repository NO debe conocer el service.
import { userRepository } from "./user.repository.js";
import  bcrypt  from "bcrypt";
import { transporter, MAIL_USER } from "../../config/mailer.js";


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

    const plainPassword = data.userPassword; // guardar antes de hashear para el correo
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const userData = { ...data, userPassword: hashedPassword };
    const user = await userRepository.create(userData);

    // ── Sincronizar teléfonos ──────────────────────────────────────────────
    const phones = [
      ...(data.userPhone          ? [{ phoneNumber: data.userPhone,          isPrimary: true  }] : []),
      ...(data.userSecondaryPhone ? [{ phoneNumber: data.userSecondaryPhone, isPrimary: false }] : []),
    ];
    if (phones.length) await userRepository.syncPhones(user.user_id, phones);

    // Registrar en user_groups y copiar permisos del grupo al usuario
    if (data.userGroup) {
      await userRepository.assignGroup(user.user_id, data.userGroup);
      await userRepository.assignGroupPermissionsToUser(user.user_id, data.userGroup);
    }

    // ── Enviar correo de bienvenida con credenciales ──────────────────────────
    const recipients = [data.userEmail];
    if (data.userEmailInstitutional) recipients.push(data.userEmailInstitutional);

    const welcomeHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0e123e;border-radius:16px;color:#fff;">
        <h2 style="color:#50E5F9;margin-top:0;">¡Bienvenido al Sistema de Inventario SENA!</h2>
        <p>Hola <strong>${data.userName}</strong>, tu cuenta ha sido creada exitosamente.</p>
        <p>Tus credenciales de acceso son:</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.07);border-radius:8px 8px 0 0;color:rgba(255,255,255,0.6);font-size:0.8rem;">Correo</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.12);border-radius:0;font-weight:bold;font-size:1rem;">${data.userEmail}</td>
          </tr>
          ${data.userEmailInstitutional ? `
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.6);font-size:0.8rem;margin-top:4px;">Correo institucional</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.12);font-weight:bold;font-size:1rem;">${data.userEmailInstitutional}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.6);font-size:0.8rem;margin-top:4px;">Contraseña temporal</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;background:rgba(255,255,255,0.12);border-radius:0 0 8px 8px;font-weight:bold;font-size:1.2rem;letter-spacing:2px;">${plainPassword}</td>
          </tr>
        </table>
        <p style="color:#fbbf24;font-size:0.85rem;">
          ⚠️ Al iniciar sesión por primera vez se te pedirá cambiar tu contraseña.
        </p>
        <p style="color:rgba(255,255,255,0.5);font-size:0.8rem;">
          Si tienes dudas, contáctanos en <a href="mailto:${MAIL_USER}" style="color:#50E5F9;">${MAIL_USER}</a>
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
        to:      recipients.join(", "),
        subject: "Tus credenciales de acceso — Sistema de Inventario SENA",
        html:    welcomeHtml,
      });
    } catch (mailErr) {
      // El usuario ya fue creado; el fallo del correo no revierte la creación
      console.error("⚠️  No se pudo enviar el correo de bienvenida:", mailErr.message);
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

    const userId = await userRepository.findUserIdByDocument(documentNumber);
    if (userId) {
      // ── Sincronizar teléfonos ────────────────────────────────────────────
      const phones = [
        ...(data.userPhone          ? [{ phoneNumber: data.userPhone,          isPrimary: true  }] : []),
        ...(data.userSecondaryPhone ? [{ phoneNumber: data.userSecondaryPhone, isPrimary: false }] : []),
      ];
      await userRepository.syncPhones(userId, phones);

      // ── Actualizar user_groups y permisos ────────────────────────────────
      const newGroup = data.userGroup || null;
      await userRepository.assignGroup(userId, newGroup);
      if (newGroup) {
        await userRepository.assignGroupPermissionsToUser(userId, newGroup);
      } else {
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
