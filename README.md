# Campus Soporte

Aplicación de soporte universitario para **Ingeniería Web II · Primer corte**.
Front-end en React con dos módulos (usuarios y solicitudes), dos perfiles (administrador y estudiante) y las 13 funcionalidades solicitadas.

## Ejecutar el proyecto

Requisito: Node.js 22.12 o superior. Abre una terminal en esta carpeta.

La instalación verificada utiliza pnpm y el archivo de versiones `pnpm-lock.yaml`:

```sh
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm dev
```

Abre la dirección que muestre la terminal; normalmente es `http://127.0.0.1:5173`.

Si prefieres usar npm, también puedes ejecutar `npm install` y `npm run dev`. Esta alternativa no utiliza el archivo de versiones de pnpm. Conviene elegir un solo gestor de paquetes para el trabajo en equipo.

No abras `index.html` con doble clic: React necesita el servidor local.

## Cuentas de demostración

| Perfil | Correo | Contraseña de prueba |
| --- | --- | --- |
| Administrador | admin@campus.demo | Campus123! |
| Estudiante | estudiante@campus.demo | Campus123! |

Todos los nombres, cuentas y casos iniciales son ficticios. El dominio de los correos solo identifica cuentas de demostración; no se envían correos.

## Comprobar y preparar la entrega

```sh
pnpm lint
pnpm test
pnpm build
pnpm preview
```

- `lint`: analiza JavaScript, componentes y hooks con ESLint; debe terminar sin errores ni advertencias.
- `test`: ejecuta 19 pruebas (15 del repositorio y 4 de los validadores separados).
- `build`: genera la aplicación compilada en `dist/`.
- `preview`: sirve la versión compilada; abre la dirección que indique la terminal.
- `format:check`: comprueba el formato con Prettier; `format` aplica el formato.

Con npm, los comandos equivalentes son `npm run lint`, `npm test`, `npm run build` y `npm run preview`.

En el entorno restringido utilizado para preparar la entrega, la compilación y la vista previa funcionan. El servidor de desarrollo encontró una restricción de lectura durante la optimización de dependencias. Si ocurre en ese mismo entorno, utiliza `pnpm build` y `pnpm preview`; después de cambiar código, vuelve a compilar y recarga la página.

## Qué incluye este corte

- Inicio y cierre de sesión simulados; autorregistro de estudiantes.
- Registro, listado, detalle por ID, actualización y eliminación de usuarios.
- Registro, listado, detalle por ID, actualización y eliminación de solicitudes.
- Vista general con conteos calculados a partir de las solicitudes visibles.
- Rutas protegidas para la demostración, menú según perfil y pantalla de ruta inexistente.
- Búsqueda, filtro de estado, formularios validados y confirmación de eliminación.
- Diseño adaptable, etiquetas de formulario, foco visible y diálogo accesible.
- Persistencia local, estados de carga, errores y mensajes de confirmación.

## Cómo estudiar el código

1. `src/main.jsx`: monta React, el enrutador y el proveedor del contexto. No contiene pantallas ni declaraciones de rutas.
2. `src/App.jsx`: muestra la carga inicial, los errores de arranque y las rutas de la aplicación.
3. `src/routes/AppRoutes.jsx` y `ProtectedRoute.jsx`: mapa de rutas y control de acceso simulado. `HashRouter` permite servir la aplicación como archivos estáticos sin configurar redirecciones en el servidor.
4. `src/components/Layout.jsx` y `Brand.jsx`: estructura compartida y marca reutilizada también en el acceso.
5. `src/pages/tickets/`: `TicketList`, `TicketDetail`, `TicketEditor` y `TicketForm`, cada uno en su propio archivo. El formulario sirve para crear y editar.
6. `src/pages/users/`: la misma separación para usuarios; `src/pages/Auth.jsx` contiene acceso y autorregistro, y `Dashboard.jsx` la vista general.
7. `src/components/ui.jsx`: campos, encabezados, etiquetas, estados y confirmación reutilizables.
8. `src/context/AppContext.jsx`, `src/context/appContext.js` y `src/hooks/useApp.js`: proveedor, definición del contexto y hook para consumirlo. Comparten la sesión y las notificaciones.
9. `src/hooks/useResource.js`: carga con `useEffect`, estado de petición actual y limpieza al abandonar la pantalla.
10. `src/utils/validators.js`: validaciones puras de campos; `formatters.js`: presentación de fechas y perfiles. `src/config/constants.js` define categorías, estados y claves de almacenamiento.
11. `src/services/repository.js`: operaciones, permisos y acceso al almacenamiento; utiliza los validadores compartidos. `src/data/seed.js` contiene los datos iniciales.
12. `src/styles/index.css`: importa, en orden, `base`, `layout`, `dashboard`, `components`, `auth` y `responsive`. La separación conserva el diseño.

La estructura separa responsabilidades para este corte; no pretende implementar todavía el MVC completo de la referencia del profesor.

Las funciones del repositorio devuelven promesas desde este corte. Esto facilita sustituir su implementación por peticiones HTTP conservando la forma en que las pantallas solicitan datos.

## Reglas de la demostración

- El estudiante solo consulta sus propios casos. Puede editar y eliminar únicamente los pendientes.
- El estudiante actualiza sus datos personales, pero no su rol ni el estado de su cuenta.
- El administrador ve todos los casos y puede cambiar su estado.
- La cuenta actual no puede eliminarse, desactivarse ni cambiar su propio rol.
- No se elimina un usuario con solicitudes asociadas; puede desactivarse.
- El correo es único sin distinguir mayúsculas y minúsculas.
- Registrar un usuario como administrador y autorregistrarse son operaciones diferentes.

## Límites del prototipo

Los datos viven en `localStorage` bajo la clave `campus-soporte-v1`. La sesión simulada vive en `sessionStorage` bajo `campus-soporte-session`: permanece al recargar y termina al cerrar sesión; el navegador puede restaurar sesiones de pestañas según su configuración.

**No existe autenticación segura, API ni base de datos remota en este corte.** Se usa SHA-256 para no guardar la contraseña literal, pero ese mecanismo local, sin sal ni derivación de contraseñas, no sustituye autenticación del servidor. Quien controla el navegador puede modificar datos y permisos. Usa solo información ficticia.

Los datos pertenecen a este navegador y origen (dirección y puerto). Abrir otro navegador o puerto muestra otra copia. No hay sincronización multiusuario ni edición concurrente. La eliminación local no tiene papelera.

Las fuentes visuales se cargan desde Google Fonts. Si no hay conexión se usa Arial y la aplicación conserva su funcionalidad.

## Documentación de entrega

- `docs/PRIMER_CORTE.md`: problema, objetivos, alcance, requisitos y relación con la rúbrica.
- `docs/SUSTENTACION.md`: recorrido de demostración y conceptos para estudiar.
- `docs/VERIFICACION.md`: comprobaciones ejecutadas y lista de comprobación manual.

## GitHub

El proyecto puede versionarse completo, excepto `node_modules/`, `dist/` y archivos de entorno, excluidos mediante `.gitignore`. El archivo de versiones y la documentación sí deben guardarse.

Repositorio del proyecto: [BayronCaicedo/campus-soporte](https://github.com/BayronCaicedo/campus-soporte).

La rama principal es `main`. No incluyas contraseñas reales ni tokens dentro del código. Las credenciales que aparecen en esta documentación corresponden únicamente a la demostración local.

## Continuidad

**Segundo corte:** implementar un repositorio que consuma JSON Server o Supabase. Añadir tratamiento de errores de red y ajustar el modelo a la API elegida.

**Tercer corte:** construir un backend propio y una base de datos. Validar los datos, autenticar las cuentas y autorizar cada operación en el servidor. Sustituir por completo el mecanismo de acceso de demostración.

## Referencias técnicas

- [React: construir una aplicación desde cero](https://react.dev/learn/build-a-react-app-from-scratch).
- [Vite: guía de inicio](https://vite.dev/guide/).

La selección de React responde a la experiencia del estudiante y a los frameworks permitidos por el profesor. Vite permite trabajar explícitamente con componentes, rutas y estilos, acordes con el enfoque de aprendizaje de este corte.
