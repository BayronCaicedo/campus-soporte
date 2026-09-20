// Coordina cada caso de uso y produce el mensaje que consumirá el hook.
// Los errores del modelo se propagan para que la vista los muestre.
export function createTicketController(model) {
  return {
    listTickets: () => model.listTickets(),
    getTicket: (id) => model.getTicket(id),
    async saveTicket(values, id) {
      const data = await model.saveTicket(values, id);
      return {
        data,
        message: id ? "Solicitud actualizada." : "Solicitud registrada.",
      };
    },
    async deleteTicket(id) {
      await model.deleteTicket(id);
      return { message: "Solicitud eliminada." };
    },
  };
}
