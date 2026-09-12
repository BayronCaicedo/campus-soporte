import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";

// La limpieza evita actualizar una pantalla que el usuario ya abandonó.
export function useResource(method, id) {
  const { repository, revision } = useApp();
  const [state, setState] = useState({ data: null, error: "", loading: true });
  useEffect(() => {
    let active = true;
    setState({ data: null, error: "", loading: true });
    repository[method](id)
      .then((data) => {
        if (active) setState({ data, error: "", loading: false });
      })
      .catch((error) => {
        if (active)
          setState({ data: null, error: error.message, loading: false });
      });
    return () => {
      active = false;
    };
  }, [method, id, repository, revision]);
  return state;
}
