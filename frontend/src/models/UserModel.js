import { publicUser, fail } from "./modelUtils.js";
import { validateAccessFields } from "../utils/validators.js";
export function createUserModel(store, context) {
  const { read, write } = store;
  const { actor, admin, userFields } = context;
  return {
    async listUsers() {
      const db = read();
      admin(actor(db));
      return db.users.map(publicUser);
    },
    async getUser(id) {
      const db = read();
      const user = actor(db);
      if (user.role !== "admin" && user.id !== id)
        fail("No tienes permiso para consultar este usuario.");
      const target = db.users.find((u) => u.id === id);
      if (!target) fail("Usuario no encontrado.");
      return publicUser(target);
    },
    async saveUser(input, id) {
      const db = read();
      const user = actor(db);
      if (!id || id !== user.id) admin(user);
      const target = id ? db.users.find((u) => u.id === id) : null;
      if (id && !target) fail("Usuario no encontrado.");
      const fields = await userFields(input, db, id);
      const role = user.role === "admin" ? input.role : target.role;
      const active = user.role === "admin" ? input.active : target.active;
      validateAccessFields(role, active);
      if (id === user.id && (role !== user.role || active !== user.active))
        fail(
          "No puedes cambiar tu propio perfil de acceso ni desactivar tu cuenta.",
        );
      const saved = {
        ...target,
        ...fields,
        id: id || `USR-${crypto.randomUUID()}`,
        role,
        active,
      };
      if (id) db.users = db.users.map((u) => (u.id === id ? saved : u));
      else db.users.push(saved);
      write(db);
      return publicUser(saved);
    },
    async deleteUser(id) {
      const db = read();
      const user = actor(db);
      admin(user);
      if (id === user.id) fail("No puedes eliminar tu propia cuenta.");
      if (!db.users.some((u) => u.id === id)) fail("Usuario no encontrado.");
      if (db.tickets.some((t) => t.userId === id))
        fail(
          "Este usuario tiene solicitudes asociadas. Puedes desactivarlo o eliminar primero sus solicitudes.",
        );
      db.users = db.users.filter((u) => u.id !== id);
      write(db);
    },
  };
}
