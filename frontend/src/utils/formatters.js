export const dateLabel = (value) =>
  new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
export const roleLabel = (role) =>
  role === "admin" ? "Administrador" : "Estudiante";
