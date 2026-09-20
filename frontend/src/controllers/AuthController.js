import { validatePasswordConfirmation } from "../utils/validators.js";
export function createAuthController(model) {
  return {
    initialize: () => model.initialize(),
    currentUser: () => model.currentUser(),
    async login(email, password) {
      const data = await model.login(email, password);
      return { data, message: "Sesión iniciada. Bienvenido a Campus Soporte." };
    },
    async register(values) {
      validatePasswordConfirmation(values.password, values.confirmPassword);
      const data = await model.register(values);
      return { data, message: "Cuenta creada. Ya puedes iniciar sesión." };
    },
    async logout() {
      await model.logout();
      return { message: "" };
    },
  };
}
