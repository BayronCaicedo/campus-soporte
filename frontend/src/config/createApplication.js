import { createStorageService } from "../services/storageService.js";
import { createModelContext } from "../models/modelContext.js";
import { createAuthModel } from "../models/AuthModel.js";
import { createUserModel } from "../models/UserModel.js";
import { createTicketModel } from "../models/TicketModel.js";
import { createAuthController } from "../controllers/AuthController.js";
import { createUserController } from "../controllers/UserController.js";
import { createTicketController } from "../controllers/TicketController.js";
// Punto de composición: una misma persistencia y sesión para todas las capas.
export function createApplication(storage, sessionStorage) {
  const store = createStorageService(storage, sessionStorage);
  const context = createModelContext(store);
  const models = {
    auth: createAuthModel(store, context),
    users: createUserModel(store, context),
    tickets: createTicketModel(store, context),
  };
  const controllers = {
    ...createAuthController(models.auth),
    ...createUserController(models.users),
    ...createTicketController(models.tickets),
  };
  return { models, controllers };
}
