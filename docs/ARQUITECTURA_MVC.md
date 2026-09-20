# Campus Soporte

Aplicación de soporte universitario para **Ingeniería Web II · Primer corte**.
Front-end en React con dos módulos (usuarios y solicitudes), dos perfiles (administrador y estudiante) y las 13 funcionalidades solicitadas.

## Ejecutar el proyecto

Requisito: Node.js 22.12 o superior. Abre una terminal en la raíz del repositorio y entra primero a `frontend` con `cd frontend`. Todos los comandos de npm/pnpm de este documento se ejecutan allí.

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
- `test`: ejecuta 22 pruebas (15 de modelos, 4 de validadores y 3 de integración MVC).
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

## Organización MVC y orden de estudio

```text
campus-soporte/
├── docs/                   Informe, verificación y guion
└── frontend/
    ├── public/
    ├── tests/              Modelos, controladores y validadores
    ├── package.json
    └── src/
        ├── views/          auth, dashboard, users, tickets, common, layouts
        ├── hooks/          Estado y conexión de las vistas con controladores
        ├── controllers/    AuthController, UserController, TicketController
        ├── models/         AuthModel, UserModel, TicketModel y reglas comunes
        ├── services/       storageService: lectura, escritura y sesión local
        ├── config/         Constantes y composición de dependencias
        ├── context/        Sesión, avisos y actualización compartida
        ├── routes/         Navegación y acceso por perfil
        ├── data/           Datos ficticios iniciales
        ├── styles/         CSS modular y adaptable
        ├── utils/          Validadores y formato
        ├── App.jsx
        └── main.jsx
```

Recorrido de guardado: `TicketForm → useActions → TicketController → TicketModel → storageService`.

1. La vista recoge el formulario y controla carga, errores y navegación.
2. El hook llama al controlador y actualiza el contexto tras una operación correcta.
3. El controlador coordina el caso de uso y devuelve `{ data, message }`; los errores se propagan a la vista. En el registro comprueba además la confirmación de contraseña.
4. El modelo aplica validación, propiedad del registro, permisos y reglas del negocio.
5. El servicio solo lee y escribe datos y la referencia de sesión. No contiene reglas de perfiles.

Las consultas pasan por `useResource` y los controladores. `config/createApplication.js` conecta las capas mediante dependencias inyectadas; las pruebas utilizan almacenamiento en memoria.

Se sigue la separación MVC del ejemplo del profesor con funciones y promesas, en lugar de clases estáticas y callbacks. `routes` y `context` son apoyos de React; no sustituyen las capas MVC. El panel calcula resúmenes sobre solicitudes ya autorizadas, por lo que no necesita un modelo propio en esta entrega.

No se crean carpetas vacías de backend ni se incorpora HTTP o JWT simulado: el alcance sigue siendo el primer corte. En el segundo corte se adaptará el acceso a datos para consumir una API.

Guía para grabar: [Guion MVC de cuatro minutos](GUION_VIDEO_MVC.md). Comandos para este computador: [Ejecución local](EJECUCION_WINDOWS.md).

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
