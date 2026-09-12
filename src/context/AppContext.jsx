import { createContext, useContext, useEffect, useState } from "react";
import { createRepository } from "../services/repository.js";

const AppContext = createContext(null);
const repository = createRepository(window.localStorage, window.sessionStorage);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let mounted = true;
    repository
      .initialize()
      .then(() => repository.currentUser())
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
  async function refresh(message) {
    setUser(await repository.currentUser());
    setRevision((value) => value + 1);
    if (message) setNotice(message);
  }
  return (
    <AppContext.Provider
      value={{
        repository,
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
export function useApp() {
  return useContext(AppContext);
}
