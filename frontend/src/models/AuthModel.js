import { hashPassword, publicUser, fail } from "./modelUtils.js";
import { clean } from "../utils/validators.js";
export function createAuthModel(store, context) {
  const { read } = store;
  const { userFields } = context;
  return {
    async initialize() {
      return store.initialize();
    },
    async currentUser() {
      if (!store.getSession()) return null;
      const user = await store.get("users", store.getSession());
      if (!user?.active) {
        store.clearSession();
        return null;
      }
      return publicUser(user);
    },
    async login(email, password) {
      const db = await read();
      const hash = await hashPassword(password);
      const user = db.users.find(
        (u) =>
          u.email === clean(email).toLowerCase() &&
          u.passwordHash === hash &&
          u.active,
      );
      if (!user) fail("Correo o contraseña incorrectos, o cuenta inactiva.");
      store.setSession(user.id);
      return publicUser(user);
    },
    async logout() {
      store.clearSession();
    },
    async register(input) {
      const db = await read();
      const fields = await userFields(input, db);
      const user = {
        ...fields,
        id: `USR-${crypto.randomUUID()}`,
        role: "student",
        active: true,
      };
      return publicUser(await store.save("users", user));
    },
  };
}
