import { createSeed, DEMO_PASSWORD } from "../data/seed.js";
import { hashPassword, publicUser, fail } from "./modelUtils.js";
import { clean } from "../utils/validators.js";
export function createAuthModel(store, context) {
  const { read, write } = store;
  const { userFields } = context;
  return {
    async initialize() {
      if (store.isEmpty()) write(createSeed(await hashPassword(DEMO_PASSWORD)));
      return read();
    },
    async currentUser() {
      const db = read();
      const user = db.users.find(
        (u) => u.id === store.getSession() && u.active,
      );
      return user ? publicUser(user) : null;
    },
    async login(email, password) {
      const db = read();
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
      const db = read();
      const fields = await userFields(input, db);
      const user = {
        ...fields,
        id: `USR-${crypto.randomUUID()}`,
        role: "student",
        active: true,
      };
      db.users.push(user);
      write(db);
      return publicUser(user);
    },
  };
}
