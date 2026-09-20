import { useApp } from "./useApp.js";
// Conecta los casos de uso MVC con la sesión y las notificaciones de React.
export function useActions() {
  const { controllers, refresh } = useApp();
  async function run(method, ...args) {
    const result = await controllers[method](...args);
    await refresh(result.message);
    return result.data;
  }
  return {
    login: (...args) => run("login", ...args),
    register: (values) => run("register", values),
    logout: () => run("logout"),
    saveUser: (...args) => run("saveUser", ...args),
    deleteUser: (id) => run("deleteUser", id),
    saveTicket: (...args) => run("saveTicket", ...args),
    deleteTicket: (id) => run("deleteTicket", id),
  };
}
