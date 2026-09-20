# Guion MVC — aproximadamente cuatro minutos

Prepara la aplicación, las pestañas de código y una segunda terminal siguiendo [EJECUCION_WINDOWS.md](EJECUCION_WINDOWS.md). Ensaya con cronómetro: los tiempos incluyen las acciones. Los fragmentos de código se muestran, no se ejecutan en la terminal.

## 0:00–0:25 · Presentación

Pantalla: inicio de sesión.

“Hola, soy Bayron Caicedo. Presento Campus Soporte, mi proyecto del primer corte de Ingeniería Web II, desarrollado con React y organizado con el enfoque modelo, vista y controlador. Permite gestionar solicitudes de ayuda universitaria con dos módulos, usuarios y solicitudes, y dos perfiles: administrador y estudiante.”

## 0:25–1:15 · Estudiante

Ingresa con `estudiante@campus.demo` y `Campus123!`. Crea una solicitud con asunto “Error de acceso al aula”, categoría Plataformas, prioridad Media y descripción “No puedo consultar las actividades del curso porque aparece un error al ingresar.”

“El estudiante puede registrarse y gestionar sus propias solicitudes. Aquí creo un caso con datos obligatorios. Al guardarlo, aparece su detalle, identificador y estado pendiente. Desde el listado puedo consultar, editar o eliminar mis solicitudes pendientes.”

Edita el asunto a “Error de acceso al aula virtual”, guarda y vuelve al listado. No necesitas eliminar para este recorrido breve.

## 1:15–1:45 · Administrador y diseño

Cierra sesión, entra con `admin@campus.demo` y `Campus123!`. Abre Usuarios, el detalle de una cuenta y su formulario de edición sin guardar cambios. Reduce brevemente el ancho del navegador.

“El administrador gestiona los usuarios y todas las solicitudes. El módulo permite registrar, listar, consultar por identificador, actualizar y eliminar, respetando las reglas del sistema. El diseño adapta su distribución al ancho de la pantalla.”

## 1:45–2:10 · Organización MVC

Muestra `frontend/src` en GitHub o el editor.

“Las vistas muestran la interfaz. Los controladores coordinan las operaciones y sus mensajes. Los modelos contienen las reglas de los datos. Además, los hooks conectan estas capas con el estado de React y un servicio se ocupa del almacenamiento local.”

## 2:10–2:40 · Vista y hook

Abre `frontend/src/views/tickets/TicketForm.jsx`. Señala `TicketForm({ ticket })`, los estados `error` y `busy` y la llamada `actions.saveTicket(values, ticket?.id)`.

“Este formulario sirve para crear y editar. Recibe una solicitud cuando se utiliza para edición. El estado controla los errores y el botón mientras guarda. Al enviar, recojo los campos y uso una acción del hook para llamar al controlador.”

Abre brevemente `frontend/src/hooks/useActions.js` y señala `controllers[method]` y `refresh`.

“El hook actualiza la sesión y los avisos después de una operación correcta.”

## 2:40–3:15 · Controlador, modelo y servicio

Muestra `frontend/src/controllers/TicketController.js`, función `saveTicket`; después `frontend/src/models/TicketModel.js`, también `saveTicket`.

“El controlador solicita el guardado al modelo y prepara el mensaje de confirmación. El modelo comprueba los campos, los permisos y el estado de la solicitud. Después utiliza el servicio para guardar los datos. En este primer corte el almacenamiento es local; el consumo de una API se incorporará en el siguiente.”

No expliques cada línea. Señala `validateTicketFields`, `ticketAccess` y `write`.

## 3:15–3:45 · Pruebas

En la segunda terminal, ya ubicada en frontend y con `$nodeCampus` definido:

```powershell
& $nodeCampus --test tests/models.test.js tests/validators.test.js tests/controllers.test.js
```

“Las pruebas comprueban las validaciones, los permisos y las operaciones de usuarios y solicitudes. También verifican el recorrido entre controladores, modelos y almacenamiento. Utilizan datos temporales en memoria y no modifican los datos del navegador.”

Cuando termine, verifica el resultado antes de decir: “Las veintidós pruebas aprobaron y ninguna falló.”

## 3:45–4:00 · Cierre

Muestra el README del repositorio.

“El repositorio incluye el código organizado en MVC, las instrucciones de ejecución y la documentación. Esta entrega demuestra las trece funcionalidades con una interfaz modular, reutilizable y adaptable. Muchas gracias.”

## Si el profesor pregunta

- ¿MVC requiere una API? No. Separa responsabilidades; el servicio actual utiliza almacenamiento local.
- ¿Es igual al ejemplo? Conserva las capas principales, usando funciones y promesas en lugar de clases estáticas y callbacks.
- ¿La autenticación es real? No, es una demostración frontend; los permisos deben validarse también en el servidor en el tercer corte.
- ¿Por qué hay hooks y contexto? Para integrar los casos de uso con el estado, la sesión y las notificaciones de React.
- ¿Qué diferencia hay entre lint y pruebas? ESLint analiza el código; los tests ejecutan escenarios concretos. Ninguno garantiza por sí solo ausencia total de errores.
