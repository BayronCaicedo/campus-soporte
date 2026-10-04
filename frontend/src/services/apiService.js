import { SESSION_KEY } from "../config/constants.js";
import { createHttpService } from "./httpService.js";

export function createApiService(baseUrl, session, fetcher = fetch) {
  const request = createHttpService(baseUrl, fetcher);
  async function read() {
    const [users, tickets] = await Promise.all([
      request("/users"),
      request("/tickets"),
    ]);
    if (!Array.isArray(users) || !Array.isArray(tickets))
      throw new Error("La API debe contener las colecciones users y tickets.");
    return { users, tickets };
  }
  return {
    initialize: read,
    read,
    async get(collection, id) {
      try {
        return await request(`/${collection}/${encodeURIComponent(id)}`);
      } catch (error) {
        if (error.status === 404) return null;
        throw error;
      }
    },
    save: (collection, value, id) =>
      request(`/${collection}${id ? `/${encodeURIComponent(id)}` : ""}`, {
        method: id ? "PATCH" : "POST",
        body: value,
      }),
    remove: (collection, id) =>
      request(`/${collection}/${encodeURIComponent(id)}`, { method: "DELETE" }),
    getSession: () => session.getItem(SESSION_KEY),
    setSession: (id) => session.setItem(SESSION_KEY, id),
    clearSession: () => session.removeItem(SESSION_KEY),
  };
}
