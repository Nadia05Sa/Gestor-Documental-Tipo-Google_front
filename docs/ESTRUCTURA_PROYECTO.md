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
├── docs/                    # Documentación del frontend
│   ├── ESTRUCTURA_PROYECTO.md
│   ├── AUTH_LANDING_LOGIN_REGISTRO.md
│   ├── arquitectura/
│   │   └── atomic-design.md   # Atomic Design: átomos → pages
│   ├── pantallas/           # Documentación por pantalla (auth, user, admin)
│   │   ├── auth/
│   │   ├── user/
│   │   └── admin/
│   └── flujos/              # Flujos de usuario (auth, user, admin)
│       ├── auth/
│       └── admin/
├── gestor_documental/       # Aplicación frontend (Vite)
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── Gestor-Documental-Tipo-Google/  # Documentación maestra del producto (.docs)
└── README.md
```

> La carpeta `Gestor-Documental-Tipo-Google/.docs/` contiene la documentación
> maestra del producto completo (monorepo NX + microservicios). Este frontend
> es la implementación SPA de la capa de presentación; cuando una pantalla
> necesite contexto funcional del backend, se referencia el módulo
> correspondiente en `.docs/05-modules/`.

---

## 4. Estructura de `gestor_documental/src`

```text
src/
├── main.tsx                 # Punto de entrada
├── App.tsx                  # AuthProvider + AppRouter
│
├── core/
│   └── context/
│       ├── AuthContext.tsx         # Estado global de autenticación
│       └── DriveSearchContext.tsx  # Búsqueda global del Drive (montado en UserLayout)
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
│   │   ├── landing/         # Página pública /
│   │   ├── login/           # /login
│   │   └── register/        # /register
│   │
│   ├── user/
│   │   ├── layout/
│   │   │   └── UserLayout.tsx
│   │   ├── drive/           # /drive (explorador + store mock + abstracciones compartidas)
│   │   ├── shared/          # /shared   (Compartidos conmigo)
│   │   ├── recents/         # /recents
│   │   ├── favorites/       # /favorites (Destacados)
│   │   ├── trash/           # /trash
│   │   ├── billing/         # /billing
│   │   └── settings/        # /settings
│   │
│   └── admin/
│       ├── layout/
│       │   └── AdminLayout.tsx
│       ├── user-management/   # /admin/users
│       ├── moderation/        # /admin/reports
│       └── audit/             # (estructura preparada, sin ruta aún)
│
├── shared/
│   ├── components/
│   │   ├── atoms/           # InputText, ActionButton, VaultCard, …
│   │   ├── molecules/       # ConfirmModal, PageSectionHeader, VaultModal, …
│   │   ├── organisms/       # Sidebar, AppNavbar, AuthTopBar, Toast, …
│   │   ├── templates/       # AuthenticatedLayout, VaultViewPageLayout, AuthSplitTemplate, LandingTemplate, RegisterTemplate
│   │   └── index.ts
│   ├── domain/
│   │   └── drive/           # Tipos, utils, UI del dominio archivos
│   │       ├── types/drive.types.ts
│   │       ├── atoms/       # DriveItemIcon
│   │       ├── molecules/   # ViewModeToggle
│   │       ├── organisms/   # DriveVaultList, DriveItemsTable, MoveItemModal, …
│   │       ├── templates/   # DrivePageTemplate, DriveVaultCollectionTemplate
│   │       ├── organisms/   # DriveVaultCollectionShell (= DriveVaultViewPage), …
│   │       ├── utils/       # driveItemUtils, driveRowActions
│   │       ├── hooks/       # useDriveItemDragDrop
│   │       └── index.ts
│   ├── hooks/
│   │   └── useRequestDeduper.ts
│   ├── pages/
│   │   ├── AppLoadingScreen.tsx
│   │   └── AppNotFoundScreen.tsx
│   └── utils/
│       ├── appTheme.ts
│       ├── authTheme.ts
│       ├── universityContext.ts
│       └── vaultUtils.ts      # iconMap, renderIcon, resolveDaysLeftTone
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
import { AuthTopBar } from '@shared/components/organisms/AuthTopBar';
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
| `/drive` | Usuario autenticado | Explorador principal (home) |
| `/shared` | Usuario autenticado | Compartidos conmigo |
| `/recents` | Usuario autenticado | Recientes |
| `/favorites` | Usuario autenticado | Favoritos |
| `/trash` | Usuario autenticado | Papelera |
| `/billing` | Usuario autenticado | Facturación |
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

Cada feature sigue la misma estructura dentro de `modules/[rol]/[feature]/`:

> **Cambio de arquitectura:** se eliminó la carpeta intermedia `features/`. Las
> features ahora cuelgan directamente del módulo de rol (`modules/admin/audit/`
> en lugar de `modules/admin/features/audit/`). Las rutas de importación y la
> documentación se actualizaron en consecuencia.

```text
modules/[rol]/[feature]/
├── api/
│   └── [feature]Api.ts       # Llamadas HTTP o persistencia local
├── hooks/
│   └── use[Feature].ts       # Lógica de negocio y estado
├── organisms/                # UI del feature (Atomic Design: organismos)
├── validations/              # Validaciones de formulario (opcional)
├── types/                    # Tipos propios de la feature (opcional)
└── pages/
    └── page.tsx              # Página exportada al router (Atomic Design: page)
```

Ver [arquitectura/atomic-design.md](./arquitectura/atomic-design.md) para reglas de composición (átomos → pages).

> **Nota:** no cree stubs vacíos (`() => null`) ni archivos `types/` que solo
> re-exporten tipos del módulo `drive`. Las vistas laterales (favoritos,
> recientes, compartidos) delegan en abstracciones compartidas documentadas en
> §7.1.

### 7.1 Abstracciones compartidas del área Drive

Tras la refactorización de los módulos `user`, estas piezas centralizan la UI y
la lógica de las vistas de archivos:

| Pieza | Ubicación | Uso |
|---|---|---|
| `DriveItem`, `ViewMode` | `shared/domain/drive/types/drive.types.ts` | Fuente única de tipos de ítems |
| `useDriveItemCollection` | `modules/user/drive/hooks/` | Hook genérico: lista, preview, estrella, papelera, `detailHandlers` |
| `DriveVaultViewPage` | `shared/domain/drive/organisms/DriveVaultCollectionShell.tsx` | Shell de vistas laterales: encabezado + toggle + `MoveItemModal` + `DriveDetail`. Re-exportado desde `modules/user/drive/organisms/DriveVaultViewPage.tsx` |
| `DrivePageTemplate` | `shared/domain/drive/templates/` | Layout de Mi Unidad (toolbar, migas, content, modals) |
| `DrivePageModals` | `modules/user/drive/organisms/` | Modales agrupados de la page Drive |
| `DriveVaultList` | `shared/domain/drive/organisms/` | Lista unificada con empty state, grid/list y menú contextual |
| `DriveVaultSectionList` | `shared/domain/drive/organisms/` | Igual que arriba, agrupada por secciones (recientes) |
| `DriveItemsGrid` | `shared/domain/drive/organisms/` | Cuadrícula con `DriveFileCard`; DnD opcional vía `useDriveItemDragDrop` |
| `DriveItemsTable` | `shared/domain/drive/organisms/` | Tabla con columnas configurables y selección |
| `buildStandardDriveRowActions` | `shared/domain/drive/utils/driveRowActions.ts` | Menú contextual estándar |
| `DetailInfoRow` | `shared/components/molecules/` | Filas label/valor en paneles de detalle |
| `VaultViewPageLayout` | `shared/components/templates/` | Encabezado + toggle grid/list + contador |
| `AuthSplitTemplate` | `shared/components/templates/` | Login: formulario + panel promocional |

**Hooks delgados por vista** (ejemplo):

```typescript
// modules/user/favorites/hooks/useFavorites.ts
export const useFavorites = () =>
  useDriveItemCollection({
    api: favoritesApi,
    getToggleStarMessage: () => 'Eliminado de destacados',
    openFolder: 'navigate-drive',
    closePreviewOnToggleStar: true,
  });
```

**Página típica de vista lateral** (Destacados, Compartidos, Recientes):

```typescript
// pages/page.tsx — compone DriveVaultViewPage + DriveVaultList
import { DriveVaultViewPage } from '../../drive/organisms/DriveVaultViewPage';
import { DriveVaultList } from '@shared/domain/drive/organisms/DriveVaultList';

<DriveVaultViewPage title="..." itemCount={...} previewItem={...} detailHandlers={...} onRefresh={...}>
  {({ viewMode, onMove }) => (
    <DriveVaultList items={...} viewMode={viewMode} emptyState={...} onMove={onMove} ... />
  )}
</DriveVaultViewPage>
```

El módulo **drive** usa `DrivePageTemplate` + `DrivePageModals` en la page; el explorador completo conserva toolbar, breadcrumbs y modales propios porque es la vista raíz del árbol de carpetas.

### Responsabilidades

| Carpeta | Responsabilidad |
|---|---|
| `api/` | Peticiones HTTP o acceso a almacenamiento (mock en auth) |
| `hooks/` | Estado, efectos y orquestación de la feature |
| `organisms/` | UI del feature (formularios, listas, modales propios) |
| `validations/` | Reglas de validación de formularios |
| `types/` | Tipos TypeScript y constantes de copy |
| `pages/` | Composición de layout + hooks + organismos (capa Page) |

### Features implementadas

| Módulo | Feature | Estado |
|---|---|---|
| `auth` | landing, login, register | UI completa con mock |
| `user` | drive, shared, recents, favorites, trash, billing, settings | Implementadas con store mock en `localStorage`; vistas laterales reutilizan abstracciones Drive (§7.1) |
| `admin` | user-management, moderation | Placeholder en `pages/page.tsx`; hooks vacíos (`() => ({})`); sin `organisms/` |
| `admin` | audit | Solo `api/`, `hooks/`, `types/`, `validations/`; sin `pages/` ni ruta |
| `user` | shared-drives | Carpeta `pages/` reservada; sin implementación ni ruta |

---

## 8. Layouts

### `AuthLayout`

Usado en `/login` y `/register`. Layout limpio sin sidebar.

### `UserLayout` / `AdminLayout`

**UserLayout** envuelve `AuthenticatedLayout` con `DriveSearchProvider` (contexto de
búsqueda global del Drive). **AdminLayout** delega directamente en
`AuthenticatedLayout`.

Ambos usan `@shared/components/templates/AuthenticatedLayout.tsx`:

- `Sidebar` lateral fijo en escritorio y como **drawer** en móvil (botón de menú).
- Header con marca, email del usuario y botón de cerrar sesión.
- `<Outlet />` para el contenido de cada feature.
- `ToastHost` montado para las notificaciones globales (`toast()`).

El `Sidebar` adapta sus ítems según el rol (`USER_MENU` / `ADMIN_MENU` en
`shared/components/organisms/Sidebar.tsx`):

- **user:** Mi Unidad, Compartidos, Recientes, Destacados, Papelera, Plan y facturación, Configuración (7 ítems + separador antes de Papelera).
- **admin:** Usuarios (`/admin/users`) — el diseño VAULT prevé más ítems (dashboard, archivos, auditoría) aún no enrutados.

### Landing

No usa `AuthLayout`; renderiza su propia estructura con `AuthTopBar` fijo.

---

## 9. Autenticación (mock de desarrollo)

El flujo actual no llama a un backend. La lógica vive en:

- `core/context/AuthContext.tsx` — estado global (`user`, `login`, `register`, `logout`)
- `modules/auth/login/api/loginApi.ts` — usuarios hardcodeados y sesión en `localStorage`
- `modules/auth/register/api/registerApi.ts` — registro en `localStorage`

Claves de almacenamiento:

| Clave | Contenido |
|---|---|
| `vault_auth_user` | Sesión activa (sin contraseña) |
| `vault_registered_users` | Cuentas registradas desde `/register` |
| `vault_drive_items` | Store mock del Drive (archivos/carpetas) — Drive, Compartidos, Recientes, Favoritos, Papelera, Facturación |
| `vault_user_settings` | Preferencias del usuario (perfil, tema, idioma, zona) |

Ver [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) para el flujo completo.

---

## 10. Componentes compartidos (`shared/`)

Organizados según **Atomic Design**. Detalle completo en [arquitectura/atomic-design.md](./arquitectura/atomic-design.md).

### Atoms (`shared/components/atoms/`)

`InputText`, `Checkbox`, `Switch`, `Select`, `Textarea`, `ActionButton`, `VaultCard`, `VaultBadge`, `VaultAlert`, `Tooltip`, `GoogleIcon`, `InfinityVaultLogo`

### Molecules (`shared/components/molecules/`)

`ConfirmModal`, `VaultModal`, `PageSectionHeader`, `EmptyStatePanel`, `Pagination`, `AuthFormError`, `AuthGradientButton`, `PasswordRequirementsChecklist`, `DetailInfoRow`, `LoadingStatePanel`, …

### Organisms (`shared/components/organisms/`)

`Sidebar`, `AppNavbar`, `AuthTopBar`, `Toast`, `VaultSidePanel`, `EntityListStateRenderer`

### Templates (`shared/components/templates/`)

`AuthenticatedLayout`, `VaultViewPageLayout`, `AuthSplitTemplate`, `LandingTemplate`, `RegisterTemplate`

### Dominio Drive (`shared/domain/drive/`)

Tipos (`drive.types.ts`), utils, organismos, templates y hooks del dominio archivos.

> Los imports deben usar `@shared/domain/drive/...` o `@shared/components/atoms|molecules|organisms|templates/...`.

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
- Exportaciones nombradas en componentes shared (`export const`, `export function`; sin `export default`).
- Páginas del router exportadas como `[Feature]Page` o `[Feature]` desde `pages/page.tsx`.
- `allowJs: true` permite archivos `.js` legacy (`useRequestDeduper.js`).

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

- [ ] Crear carpeta en `modules/[rol]/[feature]/` con la estructura estándar.
- [ ] Exportar la página desde `pages/page.tsx`.
- [ ] Registrar la ruta en el router correspondiente (`AuthRoutes`, `AppRoutes` o `AdminRoutes`).
- [ ] Envolver rutas privadas con `ProtectedRoute` y el layout adecuado.
- [ ] Colocar UI del feature en `organisms/`; pages solo ensamblan (ver [atomic-design.md](./arquitectura/atomic-design.md)).
- [ ] Colocar componentes reutilizables en `shared/components/` o en `shared/domain/drive/` según corresponda.
- [ ] Tipos Drive en `@shared/domain/drive`; evitar duplicar `*.types.ts` por módulo.
- [ ] Validaciones en `validations/` cuando haya formularios.
- [ ] Lógica de negocio en hooks, no en componentes.
- [ ] No crear stubs vacíos (`() => null`) ni archivos placeholder sin uso.
- [ ] Actualizar esta documentación si cambia la arquitectura o las rutas.

---

## 16. Documentación relacionada

- [arquitectura/atomic-design.md](./arquitectura/atomic-design.md) — Atomic Design: átomos, moléculas, organismos, templates, pages.
- [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) — Landing, login, registro y flujo de autenticación mock.
- [pantallas/README.md](./pantallas/README.md) — Índice de documentación por pantalla (auth, user y admin).
- [flujos/README.md](./flujos/README.md) — Índice de flujos de usuario (auth, user y admin).

### Documentación maestra del producto

La carpeta `Gestor-Documental-Tipo-Google/.docs/` contiene la especificación
funcional completa del producto. Referencias útiles para este frontend:

| Tema | Archivo |
|---|---|
| Autenticación y RBAC | `.docs/05-modules/system/auth.md` |
| Gestión de usuarios | `.docs/05-modules/admin/user-management.md` |
| Moderación | `.docs/05-modules/admin/moderation.md` |
| Log de auditoría | `.docs/05-modules/admin/audit-log.md` |
| Dashboard admin | `.docs/05-modules/admin/dashboard.md` |
| Gestión de planes | `.docs/05-modules/admin/plans-management.md` |
| Drive y vistas | `.docs/05-modules/user/` |
