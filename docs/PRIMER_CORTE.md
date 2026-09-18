# Campus Soporte — Primer corte

**Curso:** Ingeniería Web II  
**Proyecto:** Sistema de gestión de solicitudes de soporte universitario  
**Tecnología:** React  
**Autor, institución, docente y fecha:** completar con los datos de la entrega.

## 1. Planteamiento del problema

En el escenario propuesto para este proyecto, las solicitudes de ayuda relacionadas con plataformas, equipos y conectividad de un campus se reciben por distintos canales. Esto dificulta que los estudiantes conozcan el estado de sus casos y que el personal encargado organice su atención.

Campus Soporte propone una interfaz centralizada para registrar solicitudes, consultar su detalle y gestionar su estado. Este escenario es un caso de estudio académico; no se afirma haber realizado un diagnóstico de una universidad específica.

## 2. Objetivo general

Desarrollar el front-end de una aplicación web en React para gestionar usuarios y solicitudes de soporte universitario mediante interfaces adaptables, componentes reutilizables y navegación diferenciada para los perfiles administrador y estudiante.

## 3. Objetivos específicos

1. Implementar las interfaces de las ocho funcionalidades del módulo de usuarios y las cinco del módulo de solicitudes.
2. Organizar la aplicación mediante componentes compartidos, rutas y formularios reutilizables.
3. Adaptar la presentación a pantallas de computador y dispositivos móviles.
4. Demostrar los flujos de ambos perfiles con datos ficticios y validaciones locales.
5. Separar las operaciones de datos de las pantallas para facilitar el consumo de una API en el segundo corte.

## 4. Alcance de la entrega

El primer corte implementa una aplicación front-end funcional como demostración local. Incluye las pantallas, navegación, validaciones, estados, operaciones sobre datos de prueba y persistencia en el navegador.

El consumo de API REST corresponde al segundo corte; el backend propio y la base de datos corresponden al tercero. Las restricciones locales de acceso ilustran el comportamiento esperado, pero no representan seguridad real.

La captura del programa de curso establece contenidos y resultados de aprendizaje; no contiene una lista detallada de archivos a entregar. Este documento y el código constituyen una propuesta de entrega alineada con ese programa y los requisitos compartidos. Deben ajustarse si el profesor aporta una rúbrica adicional.

## 5. Actores

**Estudiante:** se autorregistra, inicia y cierra sesión, consulta y actualiza su perfil, y gestiona sus solicitudes pendientes. Puede consultar solicitudes propias en cualquier estado.

**Administrador:** inicia y cierra sesión, administra usuarios y consulta o gestiona todas las solicitudes. Su cuenta inicial existe entre los datos de demostración.

## 6. Matriz de requisitos funcionales

Las rutas se muestran sin el prefijo `#` que utiliza la aplicación.

| Código | Módulo | Funcionalidad | Perfil | Evidencia en la interfaz |
| --- | --- | --- | --- | --- |
| RF-01 | Usuarios | Iniciar sesión | Ambos | `/ingresar`; credenciales válidas conducen al inicio |
| RF-02 | Usuarios | Cerrar sesión | Ambos | Botón de salida en el menú; vuelve al acceso |
| RF-03 | Usuarios | Autorregistro | Visitante | `/registro`; crea una cuenta de estudiante |
| RF-04 | Usuarios | Registrar usuarios | Administrador | `/usuarios/nuevo`; permite asignar perfil y estado |
| RF-05 | Usuarios | Consultar todos los usuarios | Administrador | `/usuarios`; listado con búsqueda |
| RF-06 | Usuarios | Consultar usuario por ID | Administrador; estudiante solo propio | `/usuarios/:id` y `/perfil`; detalle e identificador |
| RF-07 | Usuarios | Actualizar usuario | Administrador; estudiante solo datos propios | `/usuarios/:id/editar` y `/perfil/editar` |
| RF-08 | Usuarios | Eliminar usuario | Administrador | Detalle de usuario y diálogo de confirmación |
| RF-09 | Solicitudes | Registrar | Ambos | `/solicitudes/nueva`; formulario de caso |
| RF-10 | Solicitudes | Consultar todos | Ambos según alcance | `/solicitudes`; administrador ve todas, estudiante ve todas las propias |
| RF-11 | Solicitudes | Consultar por ID | Ambos según alcance | `/solicitudes/:id`; detalle, estado y solicitante |
| RF-12 | Solicitudes | Actualizar | Administrador; estudiante solo propias pendientes | `/solicitudes/:id/editar` |
| RF-13 | Solicitudes | Eliminar | Administrador; estudiante solo propias pendientes | Detalle de solicitud y diálogo de confirmación |

**Total: 13 funcionalidades, 2 módulos y 2 perfiles.** Los filtros, el resumen y la consulta de perfil complementan el alcance; no se utilizan para inflar el conteo obligatorio.

## 7. Reglas y validaciones

- Nombre: entre 3 y 80 caracteres, sin contar espacios al inicio o al final.
- Correo: formato válido, máximo 120 caracteres y único sin distinguir mayúsculas.
- Contraseña de prueba: entre 8 y 128 caracteres. En edición puede dejarse vacía para conservarla.
- Asunto de solicitud: entre 5 y 100 caracteres.
- Descripción: entre 15 y 2.000 caracteres.
- Categoría: Plataformas, Equipos, Conectividad, Cuentas u Otros.
- Prioridad: Baja, Media o Alta.
- Estados: Pendiente, En proceso o Resuelta.
- La solicitud pertenece a la cuenta que la crea; el formulario no puede reasignarla.
- El autorregistro no permite elegir el rol de administrador.
- No se elimina la propia cuenta ni una cuenta con solicitudes asociadas.
- Las cuentas inactivas no pueden iniciar sesión.

## 8. Modelo de datos

| Entidad | Campos |
| --- | --- |
| Usuario | `id`, `name`, `email`, `role`, `active`, `passwordHash` (solo demostración) |
| Solicitud | `id`, `title`, `description`, `category`, `priority`, `status`, `userId`, `createdAt` |

La relación es de uno a muchos: un usuario puede registrar varias solicitudes y cada solicitud pertenece a un usuario. El nombre del solicitante se obtiene a partir de su ID al consultar los casos. Las contraseñas y su representación local no se incluyen en los objetos entregados a las pantallas de consulta.

## 9. Estructura del front-end

La interfaz se organiza en páginas. Estas reutilizan componentes visuales y utilizan un contexto para acceder a la sesión y al repositorio. El repositorio encapsula las operaciones sobre el almacenamiento del navegador.

```text
main.jsx → App.jsx → routes/AppRoutes.jsx
  └─ pages/
      ├─ tickets/ (listado, detalle, editor y formulario)
      ├─ users/   (listado, detalle, editor y formulario)
      └─ componentes compartidos + context / hooks
          └─ services/repository.js
              ├─ utils/validators.js + config/constants.js
              └─ datos ficticios + almacenamiento del navegador

styles/index.css → base, layout, dashboard, components, auth, responsive
```

No se incorpora una API REST en este corte. La separación y el uso de operaciones asíncronas preparan el reemplazo del repositorio por un adaptador HTTP.

## 10. Relación con los contenidos del primer corte

| Contenido de aprendizaje | Evidencia verificable en el código | Demostración sugerida |
| --- | --- | --- |
| 1.1. Desarrollo con frameworks | [`main.jsx`](../src/main.jsx), [`App.jsx`](../src/App.jsx) y [`package.json`](../package.json) | Ejecutar la aplicación y explicar cómo React monta componentes mediante JSX; distinguir arranque de aplicación y mapa de rutas. |
| 1.2. Estructura y ciclo de vida | [`useResource.js`](../src/hooks/useResource.js), [`AppContext.jsx`](../src/context/AppContext.jsx) y [`TicketList.jsx`](../src/pages/tickets/TicketList.jsx) | Cambiar la búsqueda y explicar `useState`; abrir un detalle por ID y explicar el efecto de carga y su limpieza. |
| 1.3. Estilización y diseño responsive | [`styles/index.css`](../src/styles/index.css), [`layout.css`](../src/styles/layout.css) y [`responsive.css`](../src/styles/responsive.css) | Comparar computador y móvil: menú superior en pantalla pequeña, tarjetas en menos columnas y desplazamiento de tablas dentro de su contenedor. |
| 1.4. Gestión de rutas y navegación | [`AppRoutes.jsx`](../src/routes/AppRoutes.jsx), [`ProtectedRoute.jsx`](../src/routes/ProtectedRoute.jsx) y [`TicketDetail.jsx`](../src/pages/tickets/TicketDetail.jsx) | Abrir listado, detalle y edición; mostrar el ID de la URL. Comparar acceso a Usuarios como administrador y estudiante. |
| 1.5. Interfaz modular y reutilizable | [`ui.jsx`](../src/components/ui.jsx), [`UserForm.jsx`](../src/pages/users/UserForm.jsx), [`TicketForm.jsx`](../src/pages/tickets/TicketForm.jsx) y [`Brand.jsx`](../src/components/Brand.jsx) | Mostrar `Field` en ambos módulos, `Badge` en listado y detalle, y el mismo formulario al crear y editar. |

### Evidencias adicionales de calidad

- **Análisis estático:** [`eslint.config.js`](../eslint.config.js) configura reglas para JavaScript, hooks y componentes. `npm run lint` exige cero advertencias.
- **Validaciones compartidas:** [`validators.js`](../src/utils/validators.js) valida campos sin depender del navegador. El repositorio conserva la comprobación de permisos y de correos duplicados.
- **Pruebas:** [`repository.test.js`](../tests/repository.test.js) comprueba 15 escenarios de datos y permisos; [`validators.test.js`](../tests/validators.test.js) añade 4 escenarios de límites, normalización y confirmación de contraseña. Se ejecutan con `npm test`.
- **Reproducibilidad:** `pnpm-lock.yaml` registra las versiones; el README explica instalación, compilación y ejecución.

Estas evidencias se relacionan con los contenidos compartidos del primer corte, pero no constituyen una rúbrica adicional ni garantizan una nota específica. La estructura conserva una separación por responsabilidades; no se presenta como una implementación completa de MVC.

React permite componer las vistas y actualizar solo la interfaz que depende del estado. Para este caso, favorece compartir campos, formularios y estructura de navegación. Como contrapartida, se debe elegir e integrar una solución de rutas y organizar explícitamente el acceso a los datos. La elección responde a la experiencia previa del estudiante y al enfoque del curso; no se afirma que sea superior en todos los proyectos.

## 11. Limitaciones y continuidad

El prototipo es de una sola instalación de navegador, sin sincronización multiusuario. Las comprobaciones de rol en JavaScript pueden alterarse y deben reproducirse en el servidor del tercer corte. SHA-256 local no es una solución de almacenamiento seguro de contraseñas para producción.

En el segundo corte se conectarán las operaciones a JSON Server o Supabase, según la alternativa elegida. En el tercero se implementarán el backend, la base de datos, la autenticación y la autorización reales.

## 12. Referencias

- React. [Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch).
- Vite. [Getting Started](https://vite.dev/guide/).
- Programa del curso y requisitos del proyecto compartidos por el estudiante.
