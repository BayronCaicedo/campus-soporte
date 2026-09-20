import { hashPassword, fail } from "./modelUtils.js";
import { validateUserFields } from "../utils/validators.js";
// Reglas compartidas por los modelos, independientes de React.
export function createModelContext(store) {
  function actor(db) {
    const user = db.users.find((u) => u.id === store.getSession() && u.active);
    if (!user) fail("Tu sesión no está disponible. Vuelve a ingresar.");
    return user;
  }
  function admin(user) {
    if (user.role !== "admin")
      fail("Esta acción requiere el perfil administrador.");
  }
  function ticketAccess(db, id, edit = false) {
    const user = actor(db);
    const ticket = db.tickets.find((t) => t.id === id);
    if (!ticket || (user.role !== "admin" && ticket.userId !== user.id))
      fail("Solicitud no encontrada o sin permiso de acceso.");
    if (edit && user.role !== "admin" && ticket.status !== "Pendiente")
      fail("Solo puedes modificar solicitudes pendientes.");
    return { user, ticket };
  }
  async function userFields(input, db, id) {
    const fields = validateUserFields(input, { requirePassword: !id });
    if (db.users.some((u) => u.email === fields.email && u.id !== id))
      fail("Este correo ya está registrado.");
    if (!id || input.password) {
      fields.passwordHash = await hashPassword(input.password);
    }
    return fields;
  }

  return { actor, admin, ticketAccess, userFields };
}
