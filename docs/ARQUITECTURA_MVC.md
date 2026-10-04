# Arquitectura MVC de Campus Soporte

Aplicación React con módulos de usuarios y solicitudes, perfiles de administrador y estudiante y consumo de una API REST simulada con JSON Server 0.17.4 (versión fijada para reproducir el entorno).

## Organización MVC

```text
campus-soporte/
├── docs/                   Arquitectura MVC
├── backend/
│   ├── server.js           Arranque de JSON Server, sin backend de negocio propio
│   ├── db.example.json     Usuarios y solicitudes ficticios iniciales
│   ├── db.json             Persistencia de ejecución, excluida de Git
│   └── tests/              Integración MVC con peticiones HTTP reales
└── frontend/
    ├── public/
    ├── tests/              Modelos, controladores y validadores
    ├── package.json
    └── src/
        ├── views/          auth, dashboard, users, tickets, common, layouts
        ├── hooks/          Estado y conexión de las vistas con controladores
        ├── controllers/    AuthController, UserController, TicketController
        ├── models/         AuthModel, UserModel, TicketModel y reglas comunes
        ├── services/       apiService y httpService: recursos REST y peticiones
        ├── config/         Constantes y composición de dependencias
        ├── context/        Sesión, avisos y actualización compartida
        ├── routes/         Navegación y acceso por perfil
        ├── data/           Datos ficticios para pruebas unitarias
        ├── styles/         CSS modular y adaptable
        ├── utils/          Validadores y formato
        ├── App.jsx
        └── main.jsx
```

Recorrido de guardado: `TicketForm → useActions → TicketController → TicketModel → apiService → httpService → JSON Server → db.json`.

1. La vista recoge el formulario y controla carga, errores y navegación.
2. El hook llama al controlador y actualiza el contexto tras una operación correcta.
3. El controlador coordina el caso de uso y devuelve `{ data, message }`; los errores se propagan a la vista. En el registro comprueba además la confirmación de contraseña.
4. El modelo aplica validación, propiedad del registro, permisos y reglas del negocio.
5. `apiService` consulta `/users` y `/tickets`, obtiene detalles por ID y envía `POST`, `PATCH` y `DELETE`. No contiene reglas de perfiles. Para conservar las validaciones compartidas, su método `read` consulta ambas colecciones en paralelo; es una decisión apropiada para este conjunto pequeño de demostración, no una solución de paginación a gran escala.
6. `httpService` ejecuta `fetch`, serializa JSON, comprueba el estado HTTP y traduce desconexiones y tiempos de espera en mensajes legibles. Las escrituras se esperan antes de mostrar éxito. No se reintentan automáticamente para evitar duplicados.
7. JSON Server guarda los cambios en `backend/db.json`; la respuesta recorre las mismas capas hasta actualizar React.

Las consultas pasan por `useResource` y los controladores. `config/createApplication.js` recibe un servicio de datos e inyecta las dependencias en los modelos. `AppContext` proporciona el servicio HTTP en la aplicación; las pruebas unitarias utilizan un adaptador en memoria ubicado en `tests/helpers`.

`useResource` muestra carga y errores y descarta respuestas de pantallas abandonadas. Los formularios bloquean envíos mientras guardan. Si la API no está disponible al iniciar, se muestra un mensaje con el botón Reintentar. La dirección se configura con `VITE_API_URL` y vale `http://127.0.0.1:3001` por defecto.

La implementación usa funciones y promesas. Las rutas y el contexto complementan las capas MVC. El panel calcula resúmenes a partir de las solicitudes autorizadas.

## Reglas de negocio

- El estudiante solo consulta sus propios casos. Puede editar y eliminar únicamente los pendientes.
- El estudiante actualiza sus datos personales, pero no su rol ni el estado de su cuenta.
- El administrador ve todos los casos y puede cambiar su estado.
- La cuenta actual no puede eliminarse, desactivarse ni cambiar su propio rol.
- No se elimina un usuario con solicitudes asociadas; puede desactivarse.
- El correo es único sin distinguir mayúsculas y minúsculas.
- Registrar un usuario como administrador y autorregistrarse son operaciones diferentes.

## Límites del prototipo

Los datos viven en `backend/db.json`. Se inicializa desde `db.example.json` únicamente si aún no existe. Dos navegadores conectados a la misma API consultan los mismos datos; las listas se actualizan al consultar o realizar operaciones, sin sincronización en tiempo real. No se migran los datos antiguos de `localStorage`.

La sesión simulada vive en `sessionStorage` bajo `campus-soporte-session`. El login consulta la API y compara el hash SHA-256 en React; el cierre de sesión borra el identificador incluso si la API no está disponible. El registro crea un usuario mediante `POST /users`.

**La API es simulada y no ofrece autenticación ni autorización segura de servidor.** Los endpoints permiten acceso directo y exponen datos ficticios, incluidos los hashes de demostración. Las reglas de negocio se ejecutan en React y pueden eludirse fuera de la aplicación. SHA-256 sin sal no sirve para almacenar contraseñas de producción. No se implementan JWT, MySQL ni un backend de negocio propio para este corte. Las comprobaciones de correo único y relaciones no son transacciones: operaciones simultáneas pueden generar conflictos. Usa únicamente datos ficticios.

Las fuentes visuales se cargan desde Google Fonts. Si no hay conexión se usa Arial y la aplicación conserva su funcionalidad.


## Pruebas

En `frontend/tests` se verifican modelos, validadores, controladores y errores HTTP (desconexión, timeout, respuesta inválida y error del servidor). Desde `frontend`, `npm test` ejecuta las pruebas y `npm run lint` analiza el código.

En `backend/tests`, `npm test` inicia JSON Server con un archivo temporal y utiliza los mismos controladores, modelos y servicios que React. Comprueba CRUD, autorregistro, login/logout, restricciones del frontend y persistencia, incluyendo una nueva instancia del servidor leyendo el archivo guardado. La prueba no altera la base usada en la aplicación.
