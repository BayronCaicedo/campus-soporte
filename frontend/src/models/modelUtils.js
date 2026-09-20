// Utilidades del prototipo; SHA-256 local no es autenticación de producción.
export async function hashPassword(password) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export const publicUser = ({ passwordHash, ...user }) => user;
export const fail = (message) => {
  throw new Error(message);
};
