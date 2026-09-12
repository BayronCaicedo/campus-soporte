import { createSeed, DEMO_PASSWORD } from "../data/seed.js";

export const DATA_KEY = "campus-soporte-v1";
export const SESSION_KEY = "campus-soporte-session";
export const CATEGORIES = [
  "Plataformas",
  "Equipos",
  "Conectividad",
  "Cuentas",
  "Otros",
];
export const STATUSES = ["Pendiente", "En proceso", "Resuelta"];
export const PRIORITIES = ["Baja", "Media", "Alta"];

// Demostración académica: el almacenamiento del navegador NO es una frontera de seguridad.
// En el corte 3, el servidor validará la sesión, los permisos y las contraseñas.
async function hashPassword(password) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
const publicUser = ({ passwordHash, ...user }) => user;
const fail = (message) => {
  throw new Error(message);
};
const clean = (value) => String(value ?? "").trim();
const validateText = (value, label, min, max) => {
  const text = clean(value);
  if (text.length < min || text.length > max)
    fail(`${label}: escribe entre ${min} y ${max} caracteres.`);
  return text;
};

export function createRepository(storage, sessionStorage) {
  function read() {
    try {
      const db = JSON.parse(storage.getItem(DATA_KEY));
      if (
        db?.version !== 1 ||
        !Array.isArray(db.users) ||
        !Array.isArray(db.tickets)
      )
        throw new Error();
      return db;
    } catch {
      fail(
        "No se pudieron leer los datos de demostración. Revisa el almacenamiento del navegador.",
      );
    }
  }
  function write(db) {
    try {
      storage.setItem(DATA_KEY, JSON.stringify(db));
    } catch {
      fail(
        "No se pudieron guardar los cambios. El almacenamiento puede estar lleno o bloqueado.",
      );
    }
  }
  function actor(db) {
    const user = db.users.find(
      (u) => u.id === sessionStorage.getItem(SESSION_KEY) && u.active,
    );
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
    const name = validateText(input.name, "Nombre", 3, 80);
    const email = clean(input.email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120)
      fail("Escribe un correo válido.");
    if (db.users.some((u) => u.email === email && u.id !== id))
      fail("Este correo ya está registrado.");
    const fields = { name, email };
    if (!id || input.password) {
      if (
        String(input.password ?? "").length < 8 ||
        String(input.password).length > 128
      )
        fail("La contraseña debe tener entre 8 y 128 caracteres.");
      fields.passwordHash = await hashPassword(input.password);
    }
    return fields;
  }
  return {
    async initialize() {
      if (storage.getItem(DATA_KEY) === null)
        write(createSeed(await hashPassword(DEMO_PASSWORD)));
      return read();
    },
    async currentUser() {
      const db = read();
      const user = db.users.find(
        (u) => u.id === sessionStorage.getItem(SESSION_KEY) && u.active,
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
      sessionStorage.setItem(SESSION_KEY, user.id);
      return publicUser(user);
    },
    async logout() {
      sessionStorage.removeItem(SESSION_KEY);
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
      if (!["admin", "student"].includes(role) || typeof active !== "boolean")
        fail("Perfil o estado inválido.");
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
    async listTickets() {
      const db = read();
      const user = actor(db);
      return db.tickets
        .filter((t) => user.role === "admin" || t.userId === user.id)
        .map((t) => ({
          ...t,
          userName: db.users.find((u) => u.id === t.userId)?.name || "Usuario",
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async getTicket(id) {
      const db = read();
      const { ticket } = ticketAccess(db, id);
      return {
        ...ticket,
        userName:
          db.users.find((u) => u.id === ticket.userId)?.name || "Usuario",
      };
    },
    async saveTicket(input, id) {
      const db = read();
      const user = actor(db);
      const existing = id ? ticketAccess(db, id, true).ticket : null;
      const title = validateText(input.title, "Asunto", 5, 100);
      const description = validateText(
        input.description,
        "Descripción",
        15,
        2000,
      );
      if (
        !CATEGORIES.includes(input.category) ||
        !PRIORITIES.includes(input.priority)
      )
        fail("Selecciona una categoría y una prioridad válidas.");
      const status =
        user.role === "admin"
          ? input.status || "Pendiente"
          : existing?.status || "Pendiente";
      if (!STATUSES.includes(status)) fail("Estado inválido.");
      const saved = {
        id: id || `SOL-${crypto.randomUUID()}`,
        title,
        description,
        category: input.category,
        priority: input.priority,
        status,
        userId: existing?.userId || user.id,
        createdAt: existing?.createdAt || new Date().toISOString(),
      };
      if (id) db.tickets = db.tickets.map((t) => (t.id === id ? saved : t));
      else db.tickets.push(saved);
      write(db);
      return saved;
    },
    async deleteTicket(id) {
      const db = read();
      ticketAccess(db, id, true);
      db.tickets = db.tickets.filter((t) => t.id !== id);
      write(db);
    },
  };
}
