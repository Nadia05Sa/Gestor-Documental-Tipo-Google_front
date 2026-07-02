# Infinity Vault — Frontend

Frontend de **Infinity Vault** (gestor documental tipo Google Drive): SPA con **React 19**, **TypeScript**, **Vite 7**, **React Router 7** y **Tailwind CSS 4**. La UI sigue **Atomic Design** y una arquitectura modular por features.

## Resumen

- Autenticación pública (landing, login, registro) con mock en `localStorage`
- Área de usuario: explorador Drive, vistas laterales, papelera, facturación y configuración
- Panel admin: placeholders en usuarios y moderación; auditoría preparada sin ruta
- Componentes compartidos en `shared/components/{atoms,molecules,organisms,templates}/`
- Dominio archivos centralizado en `shared/domain/drive/`

## Stack

| Área | Tecnología |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | React Router DOM 7 |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Iconos | Lucide React |
| Auth (dev) | Mock + `localStorage` |

## Estructura del repositorio

```text
Gestor-Documental-Tipo-Google_front/
├── docs/                 # Documentación del frontend (índice en docs/README.md)
├── gestor_documental/    # Aplicación Vite
│   └── src/
│       ├── core/context/       # AuthContext, DriveSearchContext
│       ├── router/             # AuthRoutes, AppRoutes, AdminRoutes, ProtectedRoute
│       ├── modules/            # auth, user, admin (features por rol)
│       └── shared/
│           ├── components/     # atoms, molecules, organisms, templates
│           ├── domain/drive/   # tipos, UI y utils del dominio archivos
│           ├── pages/          # 404, loading
│           ├── hooks/
│           └── utils/          # appTheme, authTheme, universityContext, vaultUtils
└── README.md
```

Patrón de cada feature en `modules/[rol]/[feature]/`:

```text
api/  hooks/  organisms/  pages/page.tsx  types/  validations/
```

> No usar carpetas legacy `components/` por feature. UI del módulo en `organisms/`.

Detalle completo: [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md) · [docs/arquitectura/atomic-design.md](docs/arquitectura/atomic-design.md)

## Rutas principales

| Ruta | Acceso | Pantalla |
|---|---|---|
| `/` | Público | Landing |
| `/login`, `/register` | Solo invitado | Login / Registro |
| `/drive` | Usuario | Mi Unidad (home user) |
| `/shared`, `/recents`, `/favorites` | Usuario | Compartidos, Recientes, Destacados |
| `/trash`, `/billing`, `/settings` | Usuario | Papelera, Facturación, Configuración |
| `/admin` | Admin | Redirige a `/admin/users` |
| `/admin/users`, `/admin/reports` | Admin | Usuarios / Moderación (placeholders) |

Sin ruta aún (diseño documentado): `/shared-drives`, `/assistant`, `/admin/dashboard`, `/admin/files`, `/admin/audit`.

Credenciales mock de prueba:

| Rol | Email | Contraseña | Destino |
|---|---|---|---|
| Usuario | `usuario@gmail.com` | `User123` | `/drive` |
| Admin | `admin@gmail.com` | `Admin123` | `/admin/users` |

## Configuración y scripts

```bash
cd gestor_documental
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run lint
npm run preview
```

Variables de entorno: revisar `.env.example` en `gestor_documental/` si existe.

## Convenciones de código

- **Pages delgadas:** estado y API en `hooks/`; layout en `templates/` de shared.
- **Drive:** tipos e UI desde `@shared/domain/drive` (`DriveItem`, `DriveVaultList`, etc.).
- **Vistas laterales:** reutilizar `useDriveItemCollection` + `DriveVaultViewPage` + `DriveVaultList`.
- **Imports:** `@shared/components/atoms|molecules|organisms|templates/...` y `@context/AuthContext`.
- **UserLayout** monta `DriveSearchProvider` para búsqueda global del Drive.

## Documentación

| Documento | Contenido |
|---|---|
| [docs/README.md](docs/README.md) | Índice general |
| [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md) | Arquitectura, router, módulos, abstracciones Drive |
| [docs/AUTH_LANDING_LOGIN_REGISTRO.md](docs/AUTH_LANDING_LOGIN_REGISTRO.md) | Flujo de autenticación |
| [docs/pantallas/](docs/pantallas/README.md) | Especificación por pantalla |
| [docs/flujos/](docs/flujos/README.md) | Flujos auth, user y admin |

La especificación funcional del producto completo (backend, microservicios) vive en `Gestor-Documental-Tipo-Google/.docs/` cuando esa carpeta está presente en el entorno de desarrollo.
