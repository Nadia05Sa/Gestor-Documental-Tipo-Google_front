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
│       └── DriveSearchContext.tsx  # Búsqueda global del Drive (UserLayout)
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
│   │   ├── auth/            # AuthTopBar, InfinityVaultLogo, etc.
│   │   ├── drive/           # Cuadrícula, tabla, listas, DnD, utilidades
│   │   │   ├── DriveItemsGrid.tsx      # Cuadrícula unificada (con DnD opcional)
│   │   │   ├── DriveItemsTable.tsx     # Tabla con menú contextual
│   │   │   ├── DriveVaultList.tsx      # Lista + empty state (vistas laterales)
│   │   │   ├── DriveFileCard.tsx       # Tarjeta Figma VAULT
│   │   │   ├── MoveItemModal.tsx
│   │   │   ├── ViewModeToggle.tsx
│   │   │   ├── driveItemUtils.ts       # formatBytes, formatDate, iconos, grupos recientes
│   │   │   ├── driveRowActions.ts      # buildStandardDriveRowActions
│   │   │   └── useDriveItemDragDrop.ts # Hook DnD sobre carpetas (grid)
│   │   ├── inputs/          # InputText, Checkbox, ActionButton, etc.
│   │   ├── layout/          # AuthenticatedLayout, Sidebar, VaultViewPageLayout, DetailInfoRow
│   │   ├── tables/          # Pagination, EmptyStatePanel, EntityListStateRenderer
│   │   ├── ConfirmModal.tsx
│   │   ├── Toast.tsx        # toast() + ToastHost (notificaciones)
│   │   ├── VaultModal.tsx
│   │   └── VaultCard.tsx
│   ├── hooks/
│   │   └── useRequestDeduper.ts
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
├── components/               # Solo componentes propios de la feature (opcional)
├── validations/              # Validaciones de formulario (opcional)
├── types/                    # Tipos propios de la feature (opcional)
└── pages/
    └── page.tsx              # Página exportada al router
```

> **Nota:** no cree stubs vacíos (`() => null`) ni archivos `types/` que solo
> re-exporten tipos del módulo `drive`. Las vistas laterales (favoritos,
> recientes, compartidos) delegan en abstracciones compartidas documentadas en
> §7.1.

### 7.1 Abstracciones compartidas del área Drive

Tras la refactorización de los módulos `user`, estas piezas centralizan la UI y
la lógica de las vistas de archivos:

| Pieza | Ubicación | Uso |
|---|---|---|
| `DriveItem`, `ViewMode` | `modules/user/drive/types/drive.types.ts` | Fuente única de tipos de ítems |
| `useDriveItemCollection` | `modules/user/drive/hooks/` | Hook genérico: lista, preview, estrella, papelera, `detailHandlers` |
| `DriveVaultViewPage` | `modules/user/drive/components/` | Layout: `VaultViewPageLayout` + lista + `MoveItemModal` + `DriveDetail` |
| `DriveVaultList` | `@shared/components/drive/` | Lista unificada con empty state, grid/list y menú contextual |
| `DriveVaultSectionList` | `@shared/components/drive/` | Igual que arriba, agrupada por secciones (recientes) |
| `DriveItemsGrid` | `@shared/components/drive/` | Cuadrícula con `DriveFileCard`; DnD opcional vía `useDriveItemDragDrop` |
| `DriveItemsTable` | `@shared/components/drive/` | Tabla con columnas configurables y selección |
| `buildStandardDriveRowActions` | `@shared/components/drive/driveRowActions.ts` | Menú contextual estándar |
| `DetailInfoRow` | `@shared/components/layout/` | Filas label/valor en paneles de detalle |
| `VaultViewPageLayout` | `@shared/components/layout/` | Encabezado + toggle grid/list + contador |

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
<DriveVaultViewPage title="..." itemCount={...} previewItem={...} detailHandlers={...} onRefresh={...}>
  {({ viewMode, onMove }) => (
    <DriveVaultList items={...} viewMode={viewMode} emptyState={...} onMove={onMove} ... />
  )}
</DriveVaultViewPage>
```

El módulo **drive** conserva su layout propio (`DriveToolbar`, breadcrumbs, modales
de crear/subir/compartir/búsqueda) porque es el explorador completo; usa
`DriveItemsGrid` en cuadrícula y `DriveItemsTable` en lista.

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
| `user` | drive, shared, recents, favorites, trash, billing, settings | Implementadas con store mock en `localStorage`; vistas laterales reutilizan abstracciones Drive (§7.1) |
| `admin` | user-management, moderation | Página placeholder ("en construcción") |
| `admin` | audit | Estructura preparada (sin `pages/` ni ruta) |

---

## 8. Layouts

### `AuthLayout`

Usado en `/login` y `/register`. Layout limpio sin sidebar.

### `UserLayout` / `AdminLayout`

Ambos delegan en `AuthenticatedLayout` (`@shared/components/layout/AuthenticatedLayout.tsx`):

- `Sidebar` lateral fijo en escritorio y como **drawer** en móvil (botón de menú).
- Header con marca, email del usuario y botón de cerrar sesión.
- `<Outlet />` para el contenido de cada feature.
- `ToastHost` montado para las notificaciones globales (`toast()`).

El `Sidebar` adapta sus ítems según el rol: para `user` muestra Mi Drive,
Compartidos, Recientes, Favoritos, Papelera, Facturación y Configuración.

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

### Auth

`AuthTopBar`, `AuthGradientButton`, `AuthFormError`, `InfinityVaultLogo`, `GoogleIcon`, `PasswordRequirementsChecklist`

### Inputs

`InputText`, `Checkbox`, `Switch`, `Select`, `Textarea`, `ActionButton`, `ColorSwatchPicker`, `SelectableListField`, `CascadingSelectableListField`

### Layout

`AuthenticatedLayout`, `Sidebar`, `Header`, `SideDrawer`, `PageSectionHeader`, `VaultViewPageLayout`, `SurfacePanel`, `LoadingStatePanel`, `DetailInfoRow`, `InfoFieldCard`

### Drive (componentes de archivos)

`DriveItemsGrid`, `DriveItemsTable`, `DriveVaultList`, `DriveVaultSectionList`, `DriveFileCard`, `DriveItemIcon`, `MoveItemModal`, `ViewModeToggle`, `driveItemUtils`, `driveRowActions`, `useDriveItemDragDrop`

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

- [ ] Crear carpeta en `modules/[rol]/[feature]/` con la estructura estándar.
- [ ] Exportar la página desde `pages/page.tsx`.
- [ ] Registrar la ruta en el router correspondiente (`AuthRoutes`, `AppRoutes` o `AdminRoutes`).
- [ ] Envolver rutas privadas con `ProtectedRoute` y el layout adecuado.
- [ ] Colocar componentes reutilizables en `shared/components/` o, para vistas de archivos laterales, reutilizar las abstracciones de §7.1.
- [ ] Tipos de ítems Drive en `drive/types/drive.types.ts`; evitar re-exports por módulo.
- [ ] Validaciones en `validations/` cuando haya formularios.
- [ ] Lógica de negocio en hooks, no en componentes.
- [ ] No crear stubs vacíos (`() => null`) ni archivos placeholder sin uso.
- [ ] Actualizar esta documentación si cambia la arquitectura o las rutas.

---

## 16. Documentación relacionada

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
