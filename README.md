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


## Guías de la entrega

- [Organización MVC y pruebas](docs/ARQUITECTURA_MVC.md)
- [Guion de cuatro minutos](docs/GUION_VIDEO_MVC.md)
- [Comandos para Windows](docs/EJECUCION_WINDOWS.md)
- [Informe del primer corte](docs/PRIMER_CORTE.md)
