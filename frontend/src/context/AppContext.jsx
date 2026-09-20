import { useEffect, useState } from "react";
import { createApplication } from "../config/createApplication.js";

import { AppContext } from "./appContext.js";
const { controllers } = createApplication(
  window.localStorage,
  window.sessionStorage,
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
  async function refresh(message) {
    setUser(await controllers.currentUser());
    setRevision((value) => value + 1);
    if (message) setNotice(message);
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
