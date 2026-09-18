# Guía de sustentación y estudio

## Preparación

Ejecuta la aplicación siguiendo el README. Usa datos ficticios. Ten abiertas la aplicación y la carpeta `src`. Antes de entregar, completa tus datos en el informe y confirma si el profesor exige un formato específico.

## Recorrido sugerido: 8 a 10 minutos

1. **Problema y objetivo — 1 minuto.** Explica el caso de estudio: centralizar solicitudes de soporte y permitir su seguimiento. Presenta los dos módulos y perfiles.
2. **Autorregistro y acceso — 1 minuto.** Crea una cuenta ficticia. Señala que no hay selector de rol. Inicia sesión con esa cuenta.
3. **Solicitudes — 2 minutos.** Crea una solicitud, vuelve al listado, búscala, abre su detalle por ID, edítala y recarga para mostrar persistencia. Elimina ese caso mediante la confirmación. Cierra sesión.
4. **Administrador — 2 minutos.** Ingresa con `admin@campus.demo` y `Campus123!`. Muestra el menú Usuarios. Crea un usuario ficticio sin solicitudes, consúltalo, edítalo y elimínalo. Abre una solicitud y muestra el selector de estado.
5. **Componentes y rutas — 1 a 2 minutos.** Muestra `Field` en `components/ui.jsx` y su reutilización en `UserForm.jsx` y `TicketForm.jsx`. Muestra las rutas con `:id` en `routes/AppRoutes.jsx` y el control de acceso en `routes/ProtectedRoute.jsx`. Explica que `main.jsx` monta React y `App.jsx` organiza el arranque.
6. **Diseño adaptable y alcance — 1 minuto.** Reduce el ancho del navegador y muestra cómo cambia el menú. Explica qué partes son simuladas y qué corresponde a los siguientes cortes.

## Conceptos que debes poder explicar

**Componente:** una función que devuelve parte de la interfaz. `Badge` muestra el estado y se utiliza en varias pantallas.

**Props:** información que un componente recibe. `PageHeading` recibe título y descripción; `TicketForm` recibe una solicitud al editar.

**Estado (`useState`):** información que cambia durante el uso y provoca una nueva representación de la interfaz. Se utiliza en búsquedas, filtros, errores y estado del diálogo.

**Efecto (`useEffect`):** sincroniza el componente con algo externo, como la carga de datos o un temporizador. `useResource` carga información al entrar o cambiar de ID. Su limpieza evita actualizar una vista abandonada.

**Contexto:** comparte información sin pasarla manualmente por todos los niveles de componentes. `AppContext` centraliza la sesión simulada y las notificaciones.

**Ruta:** relaciona una dirección con una pantalla. En `/solicitudes/:id`, `useParams` obtiene el identificador que se consulta en el repositorio.

**CRUD:** crear, consultar, actualizar y eliminar. Consultar todos y consultar por ID son dos funcionalidades explícitas del requisito.

**Repositorio:** agrupa las operaciones de datos. Hoy utiliza almacenamiento local; en el siguiente corte sus funciones realizarán peticiones a una API.

**Diseño responsive:** adapta la estructura al ancho disponible. El menú lateral pasa a la parte superior en móvil, las tarjetas cambian de columnas y las tablas se desplazan dentro de su contenedor.

## Preguntas probables

**¿Por qué no tiene backend todavía?** El primer corte se concentra en interfaces, componentes, estilos y rutas. Los datos locales permiten demostrar los flujos; las integraciones están previstas en los cortes siguientes.

**¿Las rutas protegidas hacen segura la aplicación?** No. Ilustran la experiencia esperada. El servidor debe validar los permisos en cada operación cuando exista el backend real.

**¿Cómo se diferencian autorregistro y registro de usuarios?** El autorregistro es público y crea estudiantes. Registrar usuarios exige administrador y permite gestionar rol y estado.

**¿Dónde está la consulta por ID?** En las pantallas de detalle. El listado genera un enlace con el identificador y la pantalla consulta ese registro.

**¿Qué se reutiliza?** El menú, los encabezados, los campos, las etiquetas, la carga, los errores y el diálogo. Los formularios sirven para creación y edición.

**¿Qué pasa al recargar?** Los datos se conservan en `localStorage`. La sesión simulada permanece en la pestaña mediante `sessionStorage` hasta cerrar sesión o según la restauración de pestañas del navegador.

**¿Qué cambiará al consumir una API?** La implementación del repositorio y el tratamiento de errores de red. Las pantallas ya esperan operaciones asíncronas, lo que facilita esa transición.

## Orden de estudio recomendado

Comienza por `Dashboard.jsx`, identifica las props de `Badge`, sigue con el formulario de solicitudes y después revisa su llamada a `repository.saveTicket`. Finalmente estudia las rutas y el contexto. Haz un cambio pequeño, por ejemplo en un texto de ayuda, ejecútalo y explica su efecto antes de modificar reglas.

## Demostrar los ajustes del primer corte

- Abre `src/pages/tickets/TicketForm.jsx`: observa que el mismo formulario recibe una solicitud existente para editarla o funciona sin ella para crearla.
- Abre `src/utils/validators.js`: identifica una función que recibe datos y devuelve un resultado o lanza un error; no necesita el navegador.
- Abre `src/styles/responsive.css`: localiza la adaptación del menú para pantallas pequeñas.
- Ejecuta `npm run lint`: explica que ESLint analiza el código y las reglas de los hooks.
- Ejecuta `npm test`: explica que las 19 pruebas ejecutan situaciones y comparan resultados esperados, usando datos de prueba aislados.
- Explica la diferencia: Prettier organiza el formato, ESLint analiza el código y los tests comprueban comportamientos concretos. Ninguno garantiza por sí solo la ausencia de todos los errores.
