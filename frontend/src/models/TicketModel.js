import { validateTicketFields, validateStatus } from "../utils/validators.js";
export function createTicketModel(store, context) {
  const { read, write } = store;
  const { actor, ticketAccess } = context;
  return {
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
      const fields = validateTicketFields(input);
      const status =
        user.role === "admin"
          ? input.status || "Pendiente"
          : existing?.status || "Pendiente";
      validateStatus(status);
      const saved = {
        id: id || `SOL-${crypto.randomUUID()}`,
        ...fields,
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
