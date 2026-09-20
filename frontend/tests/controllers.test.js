import test from "node:test";
import assert from "node:assert/strict";
import { createApplication } from "../src/config/createApplication.js";

function memory() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}
async function setup() {
  const app = createApplication(memory(), memory());
  await app.controllers.initialize();
  return app.controllers;
}

test("MVC: registro valida confirmación antes de crear y fuerza estudiante", async () => {
  const controller = await setup();
  const values = {
    name: "Prueba MVC",
    email: "mvc@campus.demo",
    password: "Campus123!",
    confirmPassword: "distinta",
    role: "admin",
  };
  await assert.rejects(controller.register(values), /no coinciden/);
  await assert.rejects(
    controller.login(values.email, values.password),
    /incorrectos/,
  );
  const result = await controller.register({
    ...values,
    confirmPassword: values.password,
  });
  assert.equal(result.data.role, "student");
  assert.match(result.message, /Cuenta creada/);
  assert.equal(await controller.currentUser(), null);
  await controller.login(values.email, values.password);
  assert.equal((await controller.currentUser()).id, result.data.id);
  await controller.logout();
  assert.equal(await controller.currentUser(), null);
});

test("MVC: ciclo de solicitud y mensajes atraviesan controlador, modelo y almacenamiento", async () => {
  const controller = await setup();
  await controller.login("estudiante@campus.demo", "Campus123!");
  const values = {
    title: "Solicitud MVC",
    description: "Descripción para verificar todas las capas.",
    category: "Equipos",
    priority: "Media",
  };
  const created = await controller.saveTicket(values);
  assert.match(created.message, /registrada/);
  assert.equal(
    (await controller.getTicket(created.data.id)).title,
    values.title,
  );
  assert.ok(
    (await controller.listTickets()).some((t) => t.id === created.data.id),
  );
  const updated = await controller.saveTicket(
    { ...values, title: "Solicitud editada MVC" },
    created.data.id,
  );
  assert.match(updated.message, /actualizada/);
  assert.equal(
    (await controller.getTicket(created.data.id)).title,
    "Solicitud editada MVC",
  );
  assert.match(
    (await controller.deleteTicket(created.data.id)).message,
    /eliminada/,
  );
  await assert.rejects(controller.getTicket(created.data.id), /no encontrada/);
});

test("MVC: errores de permisos se propagan y administrador mantiene CRUD de usuarios", async () => {
  const controller = await setup();
  await controller.login("estudiante@campus.demo", "Campus123!");
  await assert.rejects(controller.listUsers(), /administrador/);
  await controller.logout();
  await controller.login("admin@campus.demo", "Campus123!");
  const values = {
    name: "Usuario MVC",
    email: "usuario@campus.demo",
    password: "Campus123!",
    role: "student",
    active: true,
  };
  const created = await controller.saveUser(values);
  assert.match(created.message, /registrado/);
  assert.ok(
    (await controller.listUsers()).some((u) => u.id === created.data.id),
  );
  await controller.saveUser(
    { ...values, name: "Usuario editado", password: "" },
    created.data.id,
  );
  assert.equal(
    (await controller.getUser(created.data.id)).name,
    "Usuario editado",
  );
  assert.match(
    (await controller.deleteUser(created.data.id)).message,
    /eliminado/,
  );
  await assert.rejects(controller.getUser(created.data.id), /no encontrado/);
});
