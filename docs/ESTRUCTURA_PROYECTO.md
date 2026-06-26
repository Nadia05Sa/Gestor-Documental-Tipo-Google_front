# Estructura del proyecto — Infinity Vault Frontend

Documentación del estado actual del frontend y de las convenciones arquitectónicas del repositorio.

---

## 1. Contexto

**Infinity Vault** es un gestor documental tipo Google Drive. El frontend vive en la carpeta `gestor_documental/` como una **SPA** con:

**React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4**

La documentación original de Vault contemplaba Next.js 14 o un monorepo NX con microfrontends. Este repositorio adoptó la alternativa **React + Vite** como aplicación única, manteniendo la separación por módulos y features que facilitará escalar hacia microfrontends más adelante.

---

## 2. Stack actual

| Área | Tecnología |
|---|---|
| Framework UI | React 19 |
| Lenguaje | TypeScript |
| Build tool | Vite 7 |
| Routing | React Router DOM 7 |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Iconos | Lucide React |
| Autenticación (dev) | Mock con `localStorage` |
| Validaciones | Esquemas manuales en `validations/` (Zod/Yup pendiente) |
| HTTP client | Pendiente (`apiClient.ts` no implementado aún) |
| i18n | Pendiente (textos en `types/` y componentes por ahora) |

---

## 3. Raíz del repositorio

```text
Gestor-Documental-Tipo-Google_front/
├── docs/                    # Documentación del proyecto
│   ├── ESTRUCTURA_PROYECTO.md
│   └── AUTH_LANDING_LOGIN_REGISTRO.md
├── gestor_documental/       # Aplicación frontend (Vite)
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## 4. Estructura de `gestor_documental/src`

```text
src/
├── main.tsx                 # Punto de entrada
├── App.tsx                  # AuthProvider + AppRouter
│
├── core/
│   └── context/
│       └── AuthContext.tsx  # Estado global de autenticación
│
├── router/
│   ├── index.tsx            # BrowserRouter y rutas 404
│   ├── AuthRoutes.tsx       # /, /login, /register
│   ├── AppRoutes.tsx        # Rutas de usuario autenticado
│   ├── AdminRoutes.tsx      # Rutas de administrador
│   └── ProtectedRoute.tsx   # Guards de sesión y rol
│
├── modules/
│   ├── auth/
│   │   ├── layout/
│   │   │   └── AuthLayout.tsx
│   │   └── features/
│   │       ├── landing/     # Página pública /
│   │       ├── login/       # /login
│   │       └── register/    # /register
│   │
│   ├── user/
│   │   ├── layout/
│   │   │   └── UserLayout.tsx
│   │   └── features/
│   │       ├── drive/       # /drive
│   │       ├── favorites/   # /favorites
│   │       ├── recents/     # /recents
│   │       ├── trash/       # /trash
│   │       └── settings/    # /settings
│   │
│   └── admin/
│       ├── layout/
│       │   └── AdminLayout.tsx
│       └── features/
│           ├── user-management/   # /admin/users
│           ├── moderation/          # /admin/reports
│           └── audit/               # (estructura preparada)
│
├── shared/
│   ├── components/
│   │   ├── auth/            # AuthTopBar, InfinityVaultLogo, etc.
│   │   ├── inputs/          # InputText, Checkbox, ActionButton, etc.
│   │   ├── layout/          # AuthenticatedLayout, Sidebar, Header, etc.
│   │   ├── tables/          # Pagination, EntityListItem, etc.
│   │   ├── ConfirmModal.tsx
│   │   ├── VaultModal.tsx
│   │   └── VaultCard.tsx
│   ├── hooks/
│   │   └── useRequestDeduper.js
│   ├── pages/
│   │   ├── AppLoadingScreen.tsx
│   │   └── AppNotFoundScreen.tsx
│   └── utils/
│       └── authTheme.ts     # Tema, gradientes y setup de páginas auth
│
└── assets/
```

---

## 5. Alias de importación

Configurados en `vite.config.ts` y `tsconfig.app.json`:

| Alias | Resuelve a |
|---|---|
| `@shared/*` | `src/shared/*` |
| `@context/*` | `src/core/context/*` |
| `@context/AuthContext` | `src/core/context/AuthContext` |

Ejemplo:

```typescript
import { AuthTopBar } from '@shared/components/auth/AuthTopBar';
import { useAuth } from '@context/AuthContext';
```

---

## 6. Router y rutas

### Archivos del router

```text
src/router/
├── index.tsx           # AppRouter: combina todas las rutas
├── AuthRoutes.tsx      # Rutas públicas
├── AppRoutes.tsx       # Rutas de usuario (rol user)
├── AdminRoutes.tsx     # Rutas de admin (rol admin)
└── ProtectedRoute.tsx  # Guard unificado
```

### Mapa de rutas

| Ruta | Acceso | Página |
|---|---|---|
| `/` | Público | Landing |
| `/login` | Solo invitado | Login |
| `/register` | Solo invitado | Registro |
| `/drive` | Usuario autenticado | Explorador principal |
| `/favorites` | Usuario autenticado | Favoritos |
| `/recents` | Usuario autenticado | Recientes |
| `/trash` | Usuario autenticado | Papelera |
| `/settings` | Usuario autenticado | Configuración |
| `/admin` | Admin | Redirige a `/admin/users` |
| `/admin/users` | Admin | Gestión de usuarios |
| `/admin/reports` | Admin | Moderación / reportes |
| `*` | Cualquiera | 404 |

### Reglas de enrutamiento

- Rutas públicas en `AuthRoutes.tsx`.
- Rutas de usuario envueltas en `ProtectedRoute allowedRole="user"` + `UserLayout`.
- Rutas admin envueltas en `ProtectedRoute allowedRole="admin"` + `AdminLayout`.
- Login y registro usan `ProtectedRoute guestOnly` para redirigir si ya hay sesión.
- Tras login, la redirección depende del rol:
  - `user` → `/drive`
  - `admin` → `/admin/users`

---

## 7. Patrón de módulos (features)

Cada feature sigue la misma estructura dentro de `modules/[rol]/features/[feature]/`:

```text
modules/[rol]/features/[feature]/
├── api/
│   └── [feature]Api.ts       # Llamadas HTTP o persistencia local
├── hooks/
│   └── use[Feature].ts       # Lógica de negocio y estado
├── components/
│   ├── [Feature]List.tsx
│   ├── [Feature]Detail.tsx
│   └── [Feature]Form.tsx
├── validations/
│   └── [feature]Schema.ts    # Validaciones de formulario
├── types/
│   └── [feature].types.ts    # Tipos y constantes de contenido
└── pages/
    └── page.tsx              # Página exportada al router
```

### Responsabilidades

| Carpeta | Responsabilidad |
|---|---|
| `api/` | Peticiones HTTP o acceso a almacenamiento (mock en auth) |
| `hooks/` | Estado, efectos y orquestación de la feature |
| `components/` | UI pura; recibe props y callbacks |
| `validations/` | Reglas de validación de formularios |
| `types/` | Tipos TypeScript y constantes de copy |
| `pages/` | Composición de layout + hooks + componentes |

### Features implementadas

| Módulo | Feature | Estado |
|---|---|---|
| `auth` | landing, login, register | UI completa con mock |
| `user` | drive, favorites, recents, trash, settings | Estructura base |
| `admin` | user-management, moderation | Estructura base |
| `admin` | audit | Estructura preparada |

---

## 8. Layouts

### `AuthLayout`

Usado en `/login` y `/register`. Layout limpio sin sidebar.

### `UserLayout` / `AdminLayout`

Ambos delegan en `AuthenticatedLayout` (`@shared/components/layout/AuthenticatedLayout.tsx`):

- Header con email del usuario y botón de cerrar sesión.
- `<Outlet />` para el contenido de cada feature.

### Landing

No usa `AuthLayout`; renderiza su propia estructura con `AuthTopBar` fijo.

---

## 9. Autenticación (mock de desarrollo)

El flujo actual no llama a un backend. La lógica vive en:

- `core/context/AuthContext.tsx` — estado global (`user`, `login`, `register`, `logout`)
- `modules/auth/features/login/api/loginApi.ts` — usuarios hardcodeados y sesión en `localStorage`
- `modules/auth/features/register/api/registerApi.ts` — registro en `localStorage`

Claves de almacenamiento:

| Clave | Contenido |
|---|---|
| `vault_auth_user` | Sesión activa (sin contraseña) |
| `vault_registered_users` | Cuentas registradas desde `/register` |

Ver [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) para el flujo completo.

---

## 10. Componentes compartidos (`shared/`)

### Auth

`AuthTopBar`, `AuthGradientButton`, `AuthFormError`, `InfinityVaultLogo`, `GoogleIcon`, `PasswordRequirementsChecklist`

### Inputs

`InputText`, `Checkbox`, `Switch`, `Select`, `Textarea`, `ActionButton`, `ColorSwatchPicker`, `SelectableListField`, `CascadingSelectableListField`

### Layout

`AuthenticatedLayout`, `Sidebar`, `Header`, `SideDrawer`, `PageSectionHeader`, `SurfacePanel`, `LoadingStatePanel`, `InfoFieldCard`

### Tablas y listas

`EntityListItem`, `EntityListStateRenderer`, `Pagination`, `EmptyStatePanel`

### Overlays

`ConfirmModal`, `VaultModal`, `VaultSidePanel`, `VaultAlert`, `VaultBadge`, `VaultCard`, `Tooltip`

---

## 11. Estilos y tema

Tailwind CSS 4 se integra vía plugin Vite (`@tailwindcss/vite`). No hay `tailwind.config.ts` separado; los tokens visuales de auth están centralizados en:

```text
src/shared/utils/authTheme.ts
```

Incluye gradientes de marca, variables CSS (`--bg-base`, `--text-primary`, etc.) y `setupAuthPage()` para fuentes y tema claro en pantallas de auth.

---

## 12. Scripts de desarrollo

```bash
cd gestor_documental
npm install
npm run dev      # Servidor local (http://localhost:5173)
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Vista previa del build
```

---

## 13. Convenciones TypeScript

- Componentes en `.tsx`; lógica, hooks, APIs y tipos en `.ts`.
- Props tipadas explícitamente (migración en curso: algunos handlers aún sin tipo).
- Exportaciones nombradas preferidas (`export const Login = ...`).
- Páginas del router exportadas como `[Feature]Page` o `[Feature]` desde `pages/page.tsx`.
- `allowJs: true` permite archivos `.js` legacy (`useRequestDeduper.js`, `vault-utils.js`).

---

## 14. Objetivo futuro (no implementado aún)

Estas decisiones están documentadas como referencia arquitectónica para cuando el proyecto escale:

| Área | Objetivo |
|---|---|
| Monorepo NX | Separar `mfe-main`, `mfe-word`, `mfe-excel` |
| Module Federation | Cargar editores TipTap y FortuneSheet de forma lazy |
| HTTP | Cliente centralizado `apiClient.ts` con cifrado selectivo |
| i18n | `react-i18next` con archivos en `locales/es/` y `locales/en/` |
| Colaboración | Yjs + WebSocket directo |
| Variables de entorno | `VITE_API_BASE_URL`, `VITE_RSA_PUBLIC_KEY`, etc. |

Reglas que aplicarán cuando exista backend:

- Toda petición HTTP pasa por `apiClient.ts`.
- Mutaciones protegidas con `useRequestDeduper`.
- No llamar a MinIO desde el frontend.
- No exponer IDs internos en URLs públicas.
- Datos sensibles con `{ encrypt: true }`.

---

## 15. Checklist al agregar una feature

- [ ] Crear carpeta en `modules/[rol]/features/[feature]/` con la estructura estándar.
- [ ] Exportar la página desde `pages/page.tsx`.
- [ ] Registrar la ruta en el router correspondiente (`AuthRoutes`, `AppRoutes` o `AdminRoutes`).
- [ ] Envolver rutas privadas con `ProtectedRoute` y el layout adecuado.
- [ ] Colocar componentes reutilizables en `shared/components/`.
- [ ] Tipos y constantes en `types/`; validaciones en `validations/`.
- [ ] Lógica de negocio en hooks, no en componentes.
- [ ] Actualizar esta documentación si cambia la arquitectura o las rutas.

---

## 16. Documentación relacionada

- [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) — Landing, login, registro y flujo de autenticación mock.
