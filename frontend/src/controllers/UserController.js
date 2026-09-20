// Coordina cada caso de uso y produce el mensaje que consumirá el hook.
// Los errores del modelo se propagan para que la vista los muestre.
export function createUserController(model) {
  return {
    listUsers: () => model.listUsers(),
    getUser: (id) => model.getUser(id),
    async saveUser(values, id) {
      const data = await model.saveUser(values, id);
      return {
        data,
        message: id ? "Usuario actualizado." : "Usuario registrado.",
      };
    },
    async deleteUser(id) {
      await model.deleteUser(id);
      return { message: "Usuario eliminado." };
    },
  };
}
