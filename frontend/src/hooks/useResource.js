import { useEffect, useState } from "react";
import { useApp } from "./useApp.js";

// La limpieza evita actualizar una pantalla que el usuario ya abandonó.
export function useResource(method, id) {
  const { controllers, revision } = useApp();
  const [state, setState] = useState(null);
  useEffect(() => {
    let active = true;
    controllers[method](id)
      .then((data) => {
        if (active)
          setState({ method, id, revision, data, error: "", loading: false });
      })
      .catch((error) => {
        if (active)
          setState({
            method,
            id,
            revision,
            data: null,
            error: error.message,
            loading: false,
          });
      });
    return () => {
      active = false;
    };
  }, [method, id, controllers, revision]);
  // Al cambiar de ruta o refrescar, los resultados anteriores no se muestran.
  // La carga se deriva de la petición actual, sin encadenar renders en el efecto.
  if (
    !state ||
    state.method !== method ||
    state.id !== id ||
    state.revision !== revision
  ) {
    return { data: null, error: "", loading: true };
  }
  return state;
}
