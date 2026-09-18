import test from "node:test";
import assert from "node:assert/strict";
import { createRepository } from "../src/services/repository.js";
import { DATA_KEY } from "../src/config/constants.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}
async function setup(role = "admin") {
  const storage = memoryStorage();
  const session = memoryStorage();
  const repo = createRepository(storage, session);
  await repo.initialize();
  if (role)
    await repo.login(
      role === "admin" ? "admin@campus.demo" : "estudiante@campus.demo",
      "Campus123!",
    );
  return { repo, storage, session };
}
const userInput = {
  name: "Persona de prueba",
  email: "prueba@campus.demo",
  password: "Prueba123!",
  role: "student",
  active: true,
};
const ticketInput = {
  title: "Problema con la plataforma",
  description: "No se puede abrir el contenido del curso desde la biblioteca.",
  category: "Plataformas",
  priority: "Media",
};

test("inicio, contraseña incorrecta y cierre de sesión", async () => {
  const { repo } = await setup(null);
  assert.equal(await repo.currentUser(), null);
  await assert.rejects(
    repo.login("admin@campus.demo", "incorrecta"),
    /incorrectos/,
  );
  assert.equal(
    (await repo.login("admin@campus.demo", "Campus123!")).role,
    "admin",
  );
  await repo.logout();
  assert.equal(await repo.currentUser(), null);
  await assert.rejects(repo.listTickets(), /sesión/);
});
test("autorregistro fuerza estudiante y permite iniciar sesión", async () => {
  const { repo } = await setup(null);
  const saved = await repo.register({
    ...userInput,
    role: "admin",
    active: false,
  });
  assert.equal(saved.role, "student");
  assert.equal(saved.active, true);
  assert.equal(
    (await repo.login(userInput.email, userInput.password)).id,
    saved.id,
  );
});
test("rechaza correo duplicado normalizado y datos inválidos", async () => {
  const { repo } = await setup();
  await assert.rejects(
    repo.register({ ...userInput, email: " ADMIN@CAMPUS.DEMO " }),
    /ya está/,
  );
  await assert.rejects(
    repo.register({ ...userInput, email: "sin-correo" }),
    /correo válido/,
  );
  await assert.rejects(
    repo.register({ ...userInput, password: "123" }),
    /contraseña/,
  );
  await assert.rejects(repo.register({ ...userInput, name: "  " }), /Nombre/);
});
test("administrador completa creación, listado, detalle, edición y eliminación de usuario", async () => {
  const { repo } = await setup();
  const saved = await repo.saveUser(userInput);
  assert.ok((await repo.listUsers()).some((u) => u.id === saved.id));
  assert.equal((await repo.getUser(saved.id)).email, userInput.email);
  await repo.saveUser(
    { ...userInput, name: "Nombre actualizado", password: "" },
    saved.id,
  );
  assert.equal((await repo.getUser(saved.id)).name, "Nombre actualizado");
  await repo.deleteUser(saved.id);
  await assert.rejects(repo.getUser(saved.id), /no encontrado/);
});
test("estudiante no consulta cuentas ajenas ni administra usuarios", async () => {
  const { repo } = await setup("student");
  await assert.rejects(repo.listUsers(), /administrador/);
  await assert.rejects(repo.getUser("USR-001"), /permiso/);
  await assert.rejects(repo.saveUser(userInput), /administrador/);
  await assert.rejects(repo.saveUser(userInput, "USR-003"), /administrador/);
  await assert.rejects(repo.deleteUser("USR-003"), /administrador/);
});
test("estudiante actualiza sus datos sin escalar privilegios", async () => {
  const { repo } = await setup("student");
  const saved = await repo.saveUser(
    {
      name: "Laura Actualizada",
      email: "laura@campus.demo",
      role: "admin",
      active: false,
    },
    "USR-002",
  );
  assert.equal(saved.role, "student");
  assert.equal(saved.active, true);
  await repo.logout();
  assert.equal(
    (await repo.login("laura@campus.demo", "Campus123!")).name,
    "Laura Actualizada",
  );
});
test("protege cuenta propia y usuarios con solicitudes asociadas", async () => {
  const { repo } = await setup();
  await assert.rejects(repo.deleteUser("USR-001"), /propia cuenta/);
  await assert.rejects(repo.deleteUser("USR-002"), /solicitudes asociadas/);
  await assert.rejects(
    repo.saveUser(
      {
        name: "Administrador",
        email: "admin@campus.demo",
        role: "student",
        active: true,
      },
      "USR-001",
    ),
    /propio perfil/,
  );
});
test("estudiante completa CRUD de su solicitud pendiente", async () => {
  const { repo } = await setup("student");
  const ticket = await repo.saveTicket({
    ...ticketInput,
    userId: "USR-003",
    status: "Resuelta",
  });
  assert.equal(ticket.userId, "USR-002");
  assert.equal(ticket.status, "Pendiente");
  assert.ok((await repo.listTickets()).some((t) => t.id === ticket.id));
  assert.equal((await repo.getTicket(ticket.id)).title, ticketInput.title);
  await repo.saveTicket(
    { ...ticketInput, title: "Asunto actualizado" },
    ticket.id,
  );
  assert.equal((await repo.getTicket(ticket.id)).title, "Asunto actualizado");
  await repo.deleteTicket(ticket.id);
  await assert.rejects(repo.getTicket(ticket.id), /no encontrada/);
});
test("estudiante no accede a solicitudes ajenas por ID", async () => {
  const { repo } = await setup("student");
  assert.ok((await repo.listTickets()).every((t) => t.userId === "USR-002"));
  await assert.rejects(repo.getTicket("SOL-002"), /sin permiso/);
  await assert.rejects(repo.saveTicket(ticketInput, "SOL-002"), /sin permiso/);
  await assert.rejects(repo.deleteTicket("SOL-002"), /sin permiso/);
});
test("estudiante no edita ni elimina solicitudes en proceso", async () => {
  const { repo } = await setup("student");
  await assert.rejects(repo.saveTicket(ticketInput, "SOL-003"), /pendientes/);
  await assert.rejects(repo.deleteTicket("SOL-003"), /pendientes/);
});
test("administrador modifica estados sin cambiar propietario o fecha", async () => {
  const { repo } = await setup();
  const previous = await repo.getTicket("SOL-001");
  const saved = await repo.saveTicket(
    { ...previous, status: "Resuelta", userId: "USR-001" },
    previous.id,
  );
  assert.equal(saved.status, "Resuelta");
  assert.equal(saved.userId, previous.userId);
  assert.equal(saved.createdAt, previous.createdAt);
  await repo.deleteTicket("SOL-001");
  assert.equal((await repo.listTickets()).length, 3);
});
test("validación de solicitud e identificadores inexistentes", async () => {
  const { repo } = await setup();
  await assert.rejects(
    repo.saveTicket({ ...ticketInput, title: " " }),
    /Asunto/,
  );
  await assert.rejects(
    repo.saveTicket({ ...ticketInput, description: "corta" }),
    /Descripción/,
  );
  await assert.rejects(
    repo.saveTicket({ ...ticketInput, category: "No válida" }),
    /categoría/,
  );
  await assert.rejects(
    repo.saveTicket({ ...ticketInput, status: "No válido" }),
    /Estado/,
  );
  await assert.rejects(repo.getTicket("inexistente"), /no encontrada/);
});
test("datos persisten con una nueva instancia; sesión termina al cerrar sesión", async () => {
  const { repo, storage, session } = await setup();
  const saved = await repo.saveTicket(ticketInput);
  const other = createRepository(storage, session);
  await other.initialize();
  assert.equal((await other.getTicket(saved.id)).title, ticketInput.title);
  await other.logout();
  await assert.rejects(repo.listTickets(), /sesión/);
});
test("cuenta inactiva no inicia sesión y se revoca su acceso previo", async () => {
  const { repo, storage } = await setup("student");
  const adminRepo = createRepository(storage, memoryStorage());
  await adminRepo.login("admin@campus.demo", "Campus123!");
  const student = await adminRepo.getUser("USR-002");
  await adminRepo.saveUser({ ...student, active: false }, student.id);
  assert.equal(await repo.currentUser(), null);
  await assert.rejects(repo.listTickets(), /sesión/);
  await assert.rejects(repo.login(student.email, "Campus123!"), /inactiva/);
});
test("errores de almacenamiento se reportan sin sobrescribir datos", async () => {
  const { repo, storage } = await setup();
  storage.setItem(DATA_KEY, "contenido inválido");
  await assert.rejects(repo.initialize(), /leer los datos/);
  assert.equal(storage.getItem(DATA_KEY), "contenido inválido");
  const blocked = createRepository(
    {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    },
    memoryStorage(),
  );
  await assert.rejects(blocked.initialize(), /guardar/);
});
