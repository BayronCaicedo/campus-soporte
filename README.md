# Campus Soporte

Aplicación de soporte universitario para **Ingeniería Web II · Segundo corte**.
Frontend React organizado en MVC que consume una **API REST simulada con JSON Server**. Incluye dos módulos (usuarios y solicitudes), dos perfiles (administrador y estudiante) y las 13 funcionalidades solicitadas.

## Ejecutar

Requisito: Node.js 22.12 o superior. Desde la carpeta del repositorio, abre dos terminales:

**Terminal 1 — API**

```powershell
cd backend
npm install
npm start
```

**Terminal 2 — React**

```powershell
cd frontend
npm install
npm run dev
```

Abre la dirección que muestra Vite (normalmente http://127.0.0.1:5173). Mantén las dos terminales abiertas; `Ctrl+C` detiene cada proceso. Las instalaciones solo son necesarias la primera vez o al cambiar dependencias. También se incluyen archivos de bloqueo para instalar con `pnpm install --frozen-lockfile` en cada carpeta.

Para visualizar la versión compilada, desde `frontend` ejecuta `npm run build` y luego `npm run preview -- --port 5173`, manteniendo la API encendida. Después de cambiar código, vuelve a compilar si utilizas este modo.

La API escucha en http://127.0.0.1:3001. Si se cambia su puerto mediante `PORT`, configura `VITE_API_URL` en `frontend/.env` tomando `.env.example` como referencia y reinicia Vite.

## Datos y operaciones

Al arrancar por primera vez, la API copia `backend/db.example.json` a `backend/db.json`. Las modificaciones se conservan en este último archivo y no se sobrescriben al reiniciar. `db.json` está excluido de Git: el repositorio distribuye únicamente datos ficticios de ejemplo. Los datos del primer corte guardados en el navegador no se migran automáticamente.

| Operación | Usuarios | Solicitudes |
| --- | --- | --- |
| Consultar todos | `GET /users` | `GET /tickets` |
| Consultar por ID | `GET /users/:id` | `GET /tickets/:id` |
| Crear | `POST /users` | `POST /tickets` |
| Actualizar | `PATCH /users/:id` | `PATCH /tickets/:id` |
| Eliminar | `DELETE /users/:id` | `DELETE /tickets/:id` |

El módulo de usuarios incluye además inicio y cierre de sesión y autorregistro. El autorregistro asigna el perfil estudiante. La sesión es simulada: React consulta los usuarios de la API y conserva el identificador de la cuenta en `sessionStorage`.

**Alcance académico:** JSON Server no protege los endpoints ni proporciona autenticación segura. Las restricciones de perfiles y validaciones se aplican en el frontend; no son autorización de servidor. Las contraseñas de demostración se comparan mediante SHA-256, que no sustituye un sistema de autenticación. Usa solo datos ficticios. La API se inicia en la interfaz local del equipo.

## Cuentas de demostración

| Perfil | Correo | Contraseña de prueba |
| --- | --- | --- |
| Administrador | admin@campus.demo | Campus123! |
| Estudiante | estudiante@campus.demo | Campus123! |

## Verificación

En `frontend`: `npm test`, `npm run lint` y `npm run build`.
En `backend`: `npm test`. Esta prueba inicia JSON Server en un puerto temporal, ejecuta los casos de uso a través de HTTP y comprueba persistencia en un archivo aislado, sin modificar `db.json`.

Las pruebas del frontend verifican reglas MVC, validaciones y errores de red. Las pruebas de integración verifican el CRUD de ambos módulos, el registro, la sesión simulada y las restricciones dentro de la aplicación.

Consulta la [arquitectura MVC](docs/ARQUITECTURA_MVC.md) para conocer la organización del código.
