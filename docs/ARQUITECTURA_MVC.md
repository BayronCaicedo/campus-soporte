# Arquitectura MVC de Campus Soporte

Aplicación React con módulos de usuarios y solicitudes, perfiles de administrador y estudiante y persistencia local.

## Organización MVC

```text
campus-soporte/
├── docs/                   Arquitectura MVC
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

Los datos viven en `localStorage` bajo la clave `campus-soporte-v1`. La sesión simulada vive en `sessionStorage` bajo `campus-soporte-session`: permanece al recargar y termina al cerrar sesión; el navegador puede restaurar sesiones de pestañas según su configuración.

**No existe autenticación segura, API ni base de datos remota en esta versión.** Se usa SHA-256 para no guardar la contraseña literal, pero ese mecanismo local, sin sal ni derivación de contraseñas, no sustituye autenticación del servidor. Quien controla el navegador puede modificar datos y permisos. Usa solo información ficticia.

Los datos pertenecen a este navegador y origen (dirección y puerto). Abrir otro navegador o puerto muestra otra copia. No hay sincronización multiusuario ni edición concurrente. La eliminación local no tiene papelera.

Las fuentes visuales se cargan desde Google Fonts. Si no hay conexión se usa Arial y la aplicación conserva su funcionalidad.


## Pruebas

En `frontend/tests` se verifican los modelos, los validadores y la integración con los controladores. Los tests utilizan almacenamiento en memoria independiente del navegador. Desde `frontend`, `npm test` ejecuta las pruebas y `npm run lint` analiza el código.
