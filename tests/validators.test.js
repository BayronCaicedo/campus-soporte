import test from "node:test";
import assert from "node:assert/strict";
import {
  validateUserFields,
  validateTicketFields,
  validatePasswordConfirmation,
} from "../src/utils/validators.js";

const account = {
  name: "Estudiante Prueba",
  email: "prueba@campus.demo",
  password: "Prueba123!",
};
test("validadores normalizan espacios y correo sin modificar la entrada", () => {
  const input = {
    ...account,
    name: "  Estudiante Prueba  ",
    email: " PRUEBA@CAMPUS.DEMO ",
  };
  const snapshot = { ...input };
  assert.deepEqual(validateUserFields(input), {
    name: account.name,
    email: account.email,
  });
  assert.deepEqual(input, snapshot);
});
test("edición admite contraseña vacía; creación no, y mantiene los límites", () => {
  assert.doesNotThrow(() =>
    validateUserFields(
      { ...account, password: "" },
      { requirePassword: false },
    ),
  );
  assert.throws(
    () => validateUserFields({ ...account, password: "" }),
    /contraseña/,
  );
  for (const length of [8, 128])
    assert.doesNotThrow(() =>
      validateUserFields({ ...account, password: "a".repeat(length) }),
    );
  for (const length of [7, 129])
    assert.throws(
      () => validateUserFields({ ...account, password: "a".repeat(length) }),
      /contraseña/,
    );
});
test("confirmación rechaza contraseñas diferentes", () => {
  assert.doesNotThrow(() =>
    validatePasswordConfirmation("Prueba123!", "Prueba123!"),
  );
  assert.throws(
    () => validatePasswordConfirmation("Prueba123!", "Diferente123!"),
    /no coinciden/,
  );
});
test("solicitudes respetan límites y no aceptan opciones desconocidas", () => {
  const input = {
    title: "a".repeat(100),
    description: "d".repeat(2000),
    category: "Equipos",
    priority: "Media",
  };
  assert.doesNotThrow(() => validateTicketFields(input));
  assert.throws(
    () => validateTicketFields({ ...input, title: input.title + "a" }),
    /Asunto/,
  );
  assert.throws(
    () =>
      validateTicketFields({ ...input, description: input.description + "d" }),
    /Descripción/,
  );
  assert.throws(
    () => validateTicketFields({ ...input, priority: "Urgente" }),
    /prioridad/,
  );
});
