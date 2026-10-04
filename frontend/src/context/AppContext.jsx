import { useEffect, useState } from "react";
import { createApplication } from "../config/createApplication.js";
import { createApiService } from "../services/apiService.js";

import { AppContext } from "./appContext.js";
const { controllers } = createApplication(
  createApiService(
    import.meta.env.VITE_API_URL || "http://127.0.0.1:3001",
    window.sessionStorage,
  ),
);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let mounted = true;
    controllers
      .initialize()
      .then(() => controllers.currentUser())
      .then((value) => {
        if (mounted) setUser(value);
      })
      .catch((error) => {
        if (mounted) setFatalError(error.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  async function refresh(message, authenticatedUser) {
    try {
      setUser(authenticatedUser || (await controllers.currentUser()));
      if (message) setNotice(message);
    } catch (error) {
      // El guardado ya fue confirmado: no invitar a repetir un POST exitoso.
      setNotice(
        `${message || "Operación completada."} No se pudo refrescar la sesión: ${error.message}`,
      );
    }
    setRevision((value) => value + 1);
  }
  return (
    <AppContext.Provider
      value={{
        controllers,
        user,
        loading,
        fatalError,
        notice,
        setNotice,
        refresh,
        revision,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
