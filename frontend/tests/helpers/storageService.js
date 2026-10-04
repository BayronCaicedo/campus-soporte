import { SESSION_KEY } from "../../src/config/constants.js";
import { createSeed, DEMO_PASSWORD } from "../../src/data/seed.js";
import { hashPassword } from "../../src/models/modelUtils.js";
export const DATA_KEY = "campus-soporte-test";
const storageError = (message) => {
  throw new Error(message);
};
// Solo persistencia: no decide permisos ni reglas de usuarios o solicitudes.
export function createStorageService(storage, sessionStorage) {
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
      storageError(
        "No se pudieron leer los datos de demostración. Revisa el almacenamiento del navegador.",
      );
    }
  }
  function write(db) {
    try {
      storage.setItem(DATA_KEY, JSON.stringify(db));
    } catch {
      storageError(
        "No se pudieron guardar los cambios. El almacenamiento puede estar lleno o bloqueado.",
      );
    }
  }

  return {
    async initialize() {
      if (storage.getItem(DATA_KEY) === null)
        write(createSeed(await hashPassword(DEMO_PASSWORD)));
      return read();
    },
    get: (collection, id) => read()[collection].find((item) => item.id === id),
    save(collection, value, id) {
      const db = read();
      if (id)
        db[collection] = db[collection].map((item) =>
          item.id === id ? value : item,
        );
      else db[collection].push(value);
      write(db);
      return value;
    },
    remove(collection, id) {
      const db = read();
      db[collection] = db[collection].filter((item) => item.id !== id);
      write(db);
    },
    read,
    write,
    isEmpty: () => storage.getItem(DATA_KEY) === null,
    getSession: () => sessionStorage.getItem(SESSION_KEY),
    setSession: (id) => sessionStorage.setItem(SESSION_KEY, id),
    clearSession: () => sessionStorage.removeItem(SESSION_KEY),
  };
}
