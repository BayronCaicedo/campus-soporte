export const DEMO_PASSWORD = "Campus123!";

export function createSeed(passwordHash) {
  return {
    version: 1,
    users: [
      {
        id: "USR-001",
        name: "Alex Administrador",
        email: "admin@campus.demo",
        role: "admin",
        active: true,
        passwordHash,
      },
      {
        id: "USR-002",
        name: "Laura Estudiante",
        email: "estudiante@campus.demo",
        role: "student",
        active: true,
        passwordHash,
      },
      {
        id: "USR-003",
        name: "Daniel Torres",
        email: "daniel@campus.demo",
        role: "student",
        active: true,
        passwordHash,
      },
    ],
    tickets: [
      {
        id: "SOL-001",
        title: "No puedo ingresar al aula virtual",
        description:
          "La plataforma muestra un error al intentar ingresar al curso. Ya intenté desde otro navegador y el problema continúa.",
        category: "Plataformas",
        priority: "Alta",
        status: "Pendiente",
        userId: "USR-002",
        createdAt: "2026-09-10T15:30:00Z",
      },
      {
        id: "SOL-002",
        title: "Proyector sin señal en el salón 204",
        description:
          "El proyector enciende, pero no reconoce el computador conectado por HDMI en el salón 204 del bloque B.",
        category: "Equipos",
        priority: "Media",
        status: "En proceso",
        userId: "USR-003",
        createdAt: "2026-09-09T14:15:00Z",
      },
      {
        id: "SOL-003",
        title: "Conexión intermitente en biblioteca",
        description:
          "La red inalámbrica se desconecta cada pocos minutos en el segundo piso de la biblioteca.",
        category: "Conectividad",
        priority: "Media",
        status: "En proceso",
        userId: "USR-002",
        createdAt: "2026-09-08T18:00:00Z",
      },
      {
        id: "SOL-004",
        title: "Activación de correo institucional",
        description:
          "Solicito ayuda para activar mi cuenta de correo institucional y acceder a las herramientas del campus.",
        category: "Cuentas",
        priority: "Baja",
        status: "Resuelta",
        userId: "USR-003",
        createdAt: "2026-09-07T13:00:00Z",
      },
    ],
  };
}
