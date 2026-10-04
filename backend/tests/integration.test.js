import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, copyFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { once } from "node:events";
import { createServer } from "../server.js";
import { createApiService } from "../../frontend/src/services/apiService.js";
import { createApplication } from "../../frontend/src/config/createApplication.js";

test("MVC sobre HTTP: usuarios, solicitudes, persistencia y errores con JSON Server", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "campus-api-"));
  const database = join(directory, "db.json");
  await copyFile(new URL("../db.example.json", import.meta.url), database);
  const server = createServer(database).listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  const url = `http://127.0.0.1:${server.address().port}`;
  const requests = [];
  const fetcher = (url, options) => {
    requests.push(`${options.method} ${new URL(url).pathname}`);
    return fetch(url, options);
  };
  function client() {
    const session = new Map();
    return createApplication(
      createApiService(
        url,
        {
          getItem: (key) => session.get(key),
          setItem: (key, value) => session.set(key, value),
          removeItem: (key) => session.delete(key),
        },
        fetcher,
      ),
    ).controllers;
  }
  const admin = client();
  await admin.initialize();
  await assert.rejects(
    admin.login("admin@campus.demo", "incorrecta"),
    /incorrectos/,
  );
  await admin.login("admin@campus.demo", "Campus123!");
  const input = {
    name: "Usuario API",
    email: "api@campus.demo",
    password: "Campus123!",
    role: "student",
    active: true,
  };
  const { data: user } = await admin.saveUser(input);
  assert.ok((await admin.listUsers()).some((u) => u.id === user.id));
  await admin.saveUser(
    { ...input, name: "Nombre editado", password: "" },
    user.id,
  );
  assert.equal((await admin.getUser(user.id)).name, "Nombre editado");
  const student = client();
  await student.login(input.email, input.password);
  await assert.rejects(student.listUsers(), /administrador/);
  await assert.rejects(student.getTicket("SOL-001"), /sin permiso/);
  const ticketInput = {
    title: "Prueba HTTP",
    description: "Solicitud para comprobar la persistencia de la API.",
    category: "Equipos",
    priority: "Media",
  };
  const { data: ticket } = await student.saveTicket(ticketInput);
  assert.ok(
    (await student.listTickets()).every((item) => item.userId === user.id),
  );
  await student.saveTicket(
    { ...ticketInput, title: "Actualización HTTP" },
    ticket.id,
  );
  assert.equal(
    (await student.getTicket(ticket.id)).title,
    "Actualización HTTP",
  );
  const saved = JSON.parse(await readFile(database, "utf8"));
  assert.equal(
    saved.tickets.find((item) => item.id === ticket.id).title,
    "Actualización HTTP",
  );
  assert.equal((await admin.getTicket(ticket.id)).title, "Actualización HTTP");
  await assert.rejects(admin.deleteUser(user.id), /asociadas/);
  await admin.saveTicket({ ...ticket, status: "En proceso" }, ticket.id);
  await assert.rejects(student.deleteTicket(ticket.id), /pendientes/);
  await admin.deleteTicket(ticket.id);
  await assert.rejects(admin.getTicket(ticket.id), /no encontrada/);
  await student.logout();
  assert.equal(await student.currentUser(), null);
  await admin.deleteUser(user.id);
  await assert.rejects(admin.getUser(user.id), /no encontrado/);
  await student.register({
    ...input,
    email: "registro@campus.demo",
    role: "admin",
    confirmPassword: input.password,
  });
  await student.login("registro@campus.demo", input.password);
  assert.equal((await student.currentUser()).role, "student");
  for (const resource of ["users", "tickets"]) {
    for (const method of ["GET", "POST", "PATCH", "DELETE"])
      assert.ok(
        requests.some((item) => item.startsWith(`${method} /${resource}`)),
        `${method} /${resource}`,
      );
  }
  const restarted = createServer(database).listen(0, "127.0.0.1");
  await once(restarted, "listening");
  try {
    const response = await fetch(
      `http://127.0.0.1:${restarted.address().port}/users`,
    );
    assert.ok(
      (await response.json()).some((u) => u.email === "registro@campus.demo"),
    );
  } finally {
    restarted.closeAllConnections();
    await new Promise((resolve) => restarted.close(resolve));
  }
});
