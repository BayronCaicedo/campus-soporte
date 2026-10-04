import { validateTicketFields, validateStatus } from "../utils/validators.js";
export function createTicketModel(store, context) {
  const { read } = store;
  const { actor, ticketAccess } = context;
  return {
    async listTickets() {
      const db = await read();
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
      const db = await read();
      const target = await store.get("tickets", id);
      const { ticket } = ticketAccess(
        { ...db, tickets: target ? [target] : [] },
        id,
      );
      return {
        ...ticket,
        userName:
          db.users.find((u) => u.id === ticket.userId)?.name || "Usuario",
      };
    },
    async saveTicket(input, id) {
      const db = await read();
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
      return store.save("tickets", saved, id);
    },
    async deleteTicket(id) {
      const db = await read();
      ticketAccess(db, id, true);
      await store.remove("tickets", id);
    },
  };
}
