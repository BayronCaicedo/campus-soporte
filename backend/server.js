import jsonServer from "json-server";
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// JSON Server proporciona el CRUD. db.json se crea solo en el primer arranque.
export function createServer(database) {
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false }));
  app.use(jsonServer.bodyParser);
  app.use(jsonServer.router(database));
  return app;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const database = fileURLToPath(new URL("./db.json", import.meta.url));
  if (!existsSync(database))
    copyFileSync(new URL("./db.example.json", import.meta.url), database);
  const port = Number(process.env.PORT || 3001);
  const server = createServer(database).listen(port, "127.0.0.1", () => {
    console.log(`API simulada Campus Soporte: http://127.0.0.1:${port}`);
    console.log(
      "Recursos: /users y /tickets. Datos persistidos en backend/db.json.",
    );
  });
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `El puerto ${port} está ocupado. Cierra la otra API o cambia PORT.`
        : error.message,
    );
    process.exitCode = 1;
  });
}
