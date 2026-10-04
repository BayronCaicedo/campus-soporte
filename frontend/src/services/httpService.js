// Cliente HTTP compartido: errores comprensibles y tiempo de espera limitado.
export function createHttpService(baseUrl, fetcher = fetch, timeout = 10000) {
  return async function request(path, { method = "GET", body } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetcher(`${baseUrl.replace(/\/$/, "")}${path}`, {
        method,
        signal: controller.signal,
        headers:
          body === undefined ? {} : { "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      if (!response.ok) {
        const error = new Error(
          response.status === 404
            ? "Registro no encontrado en la API."
            : `La API no pudo completar la operación (HTTP ${response.status}).`,
        );
        error.status = response.status;
        throw error;
      }
      if (response.status === 204) return null;
      try {
        return await response.json();
      } catch {
        throw new Error("La API devolvió una respuesta JSON inválida.");
      }
    } catch (error) {
      if (error.name === "AbortError")
        throw new Error("La API está tardando demasiado. Intenta nuevamente.");
      if (error instanceof TypeError)
        throw new Error(
          "No se pudo conectar con la API. Comprueba que JSON Server esté encendido.",
        );
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };
}
