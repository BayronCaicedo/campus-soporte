import { CATEGORIES, PRIORITIES, STATUSES } from "../config/constants.js";

// Funciones puras: validan datos sin leer el navegador ni modificar cuentas.
export const clean = (value) => String(value ?? "").trim();

export function validateText(value, label, min, max) {
  const text = clean(value);
  if (text.length < min || text.length > max) {
    throw new Error(`${label}: escribe entre ${min} y ${max} caracteres.`);
  }
  return text;
}

export function validateUserFields(input, { requirePassword = true } = {}) {
  const name = validateText(input.name, "Nombre", 3, 80);
  const email = clean(input.email).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    throw new Error("Escribe un correo válido.");
  }
  if (requirePassword || input.password) {
    const length = String(input.password ?? "").length;
    if (length < 8 || length > 128) {
      throw new Error("La contraseña debe tener entre 8 y 128 caracteres.");
    }
  }
  return { name, email };
}

export function validatePasswordConfirmation(password, confirmation) {
  if (password !== confirmation)
    throw new Error("Las contraseñas no coinciden.");
}

export function validateAccessFields(role, active) {
  if (!["admin", "student"].includes(role) || typeof active !== "boolean") {
    throw new Error("Perfil o estado inválido.");
  }
}

export function validateTicketFields(input) {
  const title = validateText(input.title, "Asunto", 5, 100);
  const description = validateText(input.description, "Descripción", 15, 2000);
  if (
    !CATEGORIES.includes(input.category) ||
    !PRIORITIES.includes(input.priority)
  ) {
    throw new Error("Selecciona una categoría y una prioridad válidas.");
  }
  return {
    title,
    description,
    category: input.category,
    priority: input.priority,
  };
}

export function validateStatus(status) {
  if (!STATUSES.includes(status)) throw new Error("Estado inválido.");
}
