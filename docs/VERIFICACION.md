# Verificación del primer corte

## Comprobaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| Instalación de dependencias con pnpm y archivo de versiones | Correcta |
| Compilación con Vite (`build --configLoader native`) | Correcta |
| Pruebas automáticas del repositorio | 15 aprobadas, 0 fallidas |
| Abrir la versión compilada en navegador | Correcto |
| Inicio de sesión como estudiante y administrador | Correcto |
| Autorregistro desde el formulario público | Cuenta creada como estudiante |
| Crear, consultar y editar una solicitud desde la interfaz | Correcto |
| Recargar el detalle después de editar | Cambios conservados |
| Eliminar solicitud de prueba con confirmación | Eliminada y retirada del listado |
| Listar, registrar, consultar por ID y editar usuarios | Correcto |
| Eliminar usuario ficticio sin solicitudes | Eliminado y retirado del listado |
| Cierre de sesión | Regreso al formulario de acceso |
| Diseño de inicio en computador | Revisado visualmente |
| Diseño de inicio en viewport de 390 × 844 | Revisado; corregido un desbordamiento de etiqueta oculta de tabla |

La revisión móvil final comprobó que el documento no supera el ancho del viewport. Las tablas disponen de su propio contenedor con desplazamiento horizontal.

Los casos y cuentas creados para las pruebas de interfaz fueron eliminados al finalizar; permanecen los datos iniciales de demostración.

## Qué cubren las pruebas automáticas

1. Inicio, contraseña incorrecta y cierre de sesión.
2. Autorregistro con rol de estudiante incluso si la entrada intenta indicar administrador.
3. Correos duplicados normalizados y datos de usuario inválidos.
4. Ciclo completo de administración de usuarios.
5. Restricciones del estudiante sobre cuentas ajenas.
6. Edición del perfil propio sin elevar privilegios.
7. Protección de la cuenta actual y de usuarios con solicitudes asociadas.
8. Ciclo completo de solicitud pendiente propia.
9. Restricciones sobre solicitudes ajenas consultadas directamente por ID.
10. Restricciones de edición y eliminación de solicitudes en proceso.
11. Cambio de estado por administrador conservando propietario y fecha.
12. Validación de campos de solicitud e identificadores inexistentes.
13. Persistencia entre instancias del repositorio y finalización de sesión.
14. Bloqueo de acceso a cuentas inactivas.
15. Errores de almacenamiento sin sobrescribir datos dañados.

Las pruebas del repositorio usan almacenamiento en memoria y no modifican los datos del navegador.

## Repetir antes de presentar

- [ ] Ejecutar `pnpm test` y `pnpm build`.
- [ ] Iniciar la aplicación o su vista previa.
- [ ] Recorrer ambos perfiles siguiendo `SUSTENTACION.md`.
- [ ] Crear datos ficticios nuevos para las acciones de eliminación.
- [ ] Confirmar que el estudiante no ve el menú de administración.
- [ ] Cambiar un caso a “En proceso” como administrador y comprobar que su estudiante no puede editarlo.
- [ ] Probar un correo duplicado y observar el mensaje.
- [ ] Verificar la interfaz en el computador donde se realizará la exposición.
- [ ] Completar autor, institución, docente y fecha en el informe.
- [ ] Confirmar con la rúbrica final si se requieren capturas, PDF, video o enlace remoto.

## Alcance de la verificación

Se verificó una demostración local, no un despliegue público ni una integración con API. El servidor de desarrollo encontró una restricción de lectura de dependencias en el entorno de trabajo; la aplicación compilada se probó mediante la vista previa. El proyecto incluye el código del servidor de desarrollo de Vite y las instrucciones normales para un entorno local con permisos de lectura.

No se atribuyen a este prototipo autenticación segura, pruebas de backend o persistencia remota: corresponden a los siguientes cortes.
