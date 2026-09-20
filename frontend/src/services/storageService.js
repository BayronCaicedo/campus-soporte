import { DATA_KEY, SESSION_KEY } from "../config/constants.js";
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
    read,
    write,
    isEmpty: () => storage.getItem(DATA_KEY) === null,
    getSession: () => sessionStorage.getItem(SESSION_KEY),
    setSession: (id) => sessionStorage.setItem(SESSION_KEY, id),
    clearSession: () => sessionStorage.removeItem(SESSION_KEY),
  };
}
