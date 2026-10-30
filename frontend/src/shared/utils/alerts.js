/**
 * @file alerts.js
 * @description Helper centralizado de SweetAlert2 con el tema del proyecto.
 * Exporta funciones listas para usar en cualquier componente.
 *
 * Ruta correcta: src/shared/utils/alerts.js
 *
 * Uso:
 *   import { alertSuccess, alertError, alertWarning, alertConfirm, alertDeleteConfirm } from "@/shared";
 */

import Swal from "sweetalert2";

// ─── Tema base del proyecto ────────────────────────────────────────────────────
const THEME = {
    background:          "#1e1230",
    color:               "#ffffff",
    confirmButtonColor:  "#71277A",
    cancelButtonColor:   "#4b5563",
    iconColor:           "#50E5F9",
};

// ─── Alerta de éxito ──────────────────────────────────────────────────────────
export const alertSuccess = (title, text, timer = 2000) =>
    Swal.fire({
        icon:              "success",
        title,
        text,
        confirmButtonText: "Aceptar",
        showCloseButton:   true,
        timer,
        timerProgressBar:  true,
        ...THEME,
    });

// ─── Alerta de error ──────────────────────────────────────────────────────────
export const alertError = (title, text) =>
    Swal.fire({
        icon:               "error",
        title,
        text,
        confirmButtonText:  "Cerrar",
        iconColor:          "#f87171",
        background:         THEME.background,
        color:              THEME.color,
        confirmButtonColor: THEME.confirmButtonColor,
    });

// ─── Alerta de advertencia ────────────────────────────────────────────────────
export const alertWarning = (title, text) =>
    Swal.fire({
        icon:               "warning",
        title,
        text,
        confirmButtonText:  "Entendido",
        iconColor:          "#fbbf24",
        background:         THEME.background,
        color:              THEME.color,
        confirmButtonColor: THEME.confirmButtonColor,
    });

// ─── Confirmación genérica (sí / cancelar) ────────────────────────────────────
export const alertConfirm = (title, text) =>
    Swal.fire({
        icon:              "question",
        title,
        text,
        showCancelButton:  true,
        confirmButtonText: "Sí, confirmar",
        cancelButtonText:  "Cancelar",
        ...THEME,
    });

// ─── Modal de contacto / soporte ─────────────────────────────────────────────
export const alertContact = (email = "sc876858@gmail.com") =>
    Swal.fire({
        title:             "¿Necesitas ayuda?",
        html:              `Escríbenos a <a href="https://mail.google.com/mail/?view=cm&to=${email}" target="_blank" rel="noopener noreferrer" style="color:#50E5F9;font-weight:600;">${email}</a>`,
        confirmButtonText: "Cerrar",
        showCloseButton:   true,
        background:        "#1e1230",
        color:             "#ffffff",
        confirmButtonColor:"#71277A",
        iconColor:         "#50E5F9",
    });

// ─── Modal de edición del correo de contacto (solo SuperAdministrador) ────────
export const alertEditContactEmail = async (currentEmail = "") => {
    const { value: newEmail, isConfirmed } = await Swal.fire({
        title:              "Editar correo de contacto",
        html:               `<p style="color:rgba(255,255,255,0.65);font-size:0.85rem;margin-bottom:12px;">
                                Este correo se muestra en la pantalla de inicio de sesión y en el menú de soporte.
                             </p>`,
        input:              "email",
        inputLabel:         "Nuevo correo de soporte",
        inputValue:         currentEmail,
        inputPlaceholder:   "correo@ejemplo.com",
        showCancelButton:   true,
        confirmButtonText:  "Guardar",
        cancelButtonText:   "Cancelar",
        confirmButtonColor: "#71277A",
        cancelButtonColor:  "#4b5563",
        background:         "#1e1230",
        color:              "#ffffff",
        inputAttributes:    { autocomplete: "email" },
        inputValidator:     (value) => {
            if (!value) return "El correo es requerido";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ingresa un correo válido";
        },
        customClass: {
            input: "swal2-input",
        },
    });
    return isConfirmed ? newEmail : null;
};

// ─── Confirmación de eliminación (botón rojo) ─────────────────────────────────
export const alertDeleteConfirm = (entityName) =>
    Swal.fire({
        icon:               "warning",
        title:              "¿Eliminar registro?",
        html:               `Esta acción eliminará <strong>${entityName}</strong> de forma permanente.<br/>No podrás deshacer este cambio.`,
        showCancelButton:   true,
        confirmButtonText:  "Sí, eliminar",
        cancelButtonText:   "Cancelar",
        confirmButtonColor: "#dc2626",
        cancelButtonColor:  THEME.cancelButtonColor,
        iconColor:          "#f87171",
        background:         THEME.background,
        color:              THEME.color,
    });
