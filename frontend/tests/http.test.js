import test from "node:test";
import assert from "node:assert/strict";
import { createHttpService } from "../src/services/httpService.js";

test("HTTP: informa desconexión, errores del servidor y respuesta inválida", async () => {
  await assert.rejects(
    createHttpService("http://api", async () => {
      throw new TypeError("fetch failed");
    })("/users"),
    /JSON Server/,
  );
  await assert.rejects(
    createHttpService(
      "http://api",
      async () => new Response("error", { status: 500 }),
    )("/users"),
    /HTTP 500/,
  );
  await assert.rejects(
    createHttpService("http://api", async () => new Response("html"))("/users"),
    /JSON inválida/,
  );
});

test("HTTP: cancela una petición que supera el tiempo de espera", async () => {
  const request = createHttpService(
    "http://api",
    (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () =>
          reject(new DOMException("Timeout", "AbortError")),
        );
      }),
    20,
  );
  await assert.rejects(request("/users"), /tardando demasiado/);
});
