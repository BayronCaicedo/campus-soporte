# Ejecutar Campus Soporte después de la migración MVC

## Este computador

En PowerShell, copia el bloque completo. La carpeta ahora termina en `frontend`.

```powershell
$proyecto = 'C:\Users\bairo\Documents\Codex\2026-09-11\proyecto-debe-contar-con-m-nimo\outputs\campus-soporte\frontend'
Set-Location -LiteralPath $proyecto
$nodeCampus = 'C:\Users\bairo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $nodeCampus node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5173 --configLoader native
```

Abre la dirección indicada en la terminal. Deja PowerShell abierto; detén con Ctrl+C. Si un servidor anterior sigue en 5173, detenlo antes de iniciar para conservar el mismo origen y los datos del navegador.

Para las pruebas, abre otra ventana y ejecuta las tres primeras líneas del bloque anterior (hasta definir `$nodeCampus`), después:

```powershell
& $nodeCampus --test tests/models.test.js tests/validators.test.js tests/controllers.test.js
& $nodeCampus node_modules/eslint/bin/eslint.js . --max-warnings 0
```

Resultado esperado: 22 pruebas aprobadas y 0 fallidas. ESLint vuelve al indicador sin mensajes si no encuentra problemas.

Después de cambiar código, recompila antes de usar la vista previa:

```powershell
& $nodeCampus node_modules/vite/bin/vite.js build --configLoader native
```

## Otro computador con Node.js y Git

Requiere Node.js 22.12 o superior. Para una descarga nueva:

```powershell
git clone https://github.com/BayronCaicedo/campus-soporte.git
cd campus-soporte/frontend
npm install
npm run dev
```

Si ya está clonado, actualiza con `git pull` desde el repositorio, entra a `frontend` e instala las dependencias allí. No hace falta clonar otra vez. La instalación reproducible con pnpm está en el README. Los datos locales no viajan con Git.
