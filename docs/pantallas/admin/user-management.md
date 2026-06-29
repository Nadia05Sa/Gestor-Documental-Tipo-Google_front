# Pantalla Admin: Gestión de usuarios (`/admin/users`)

Herramienta para administradores que controla el acceso y el ciclo de vida de las
cuentas en Vault. Es la pantalla por defecto del panel admin (`/admin` redirige
aquí).

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/admin/users` |
| Acceso | `ProtectedRoute allowedRole="admin"` |
| Layout | `AdminLayout` |
| Registro de ruta | `router/AdminRoutes.tsx` |

---

## Estado de implementación

**Placeholder.** Hoy `pages/page.tsx` exporta `UsersPage`, que solo muestra un
título y el texto "Módulo de administración en construcción". La estructura del
módulo existe pero la lógica está pendiente.

```text
modules/admin/user-management/
├── api/userManagementApi.ts
├── components/
│   ├── UserManagementList.tsx
│   ├── UserManagementDetail.tsx
│   └── UserManagementForm.tsx
├── hooks/useUserManagement.ts
├── pages/page.tsx                    # ← placeholder actual
├── types/userManagement.types.ts     # ← actualmente `Record<string, never>`
└── validations/userManagementSchema.ts
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/admin/user-management.md`.)

- **Listado y búsqueda:** ver todos los usuarios, buscar por email o nombre (data table paginada).
- **Detalle de usuario:** ver el perfil completo de una cuenta.
- **Estado de cuenta:** activar/desactivar (banear) acceso (`is_active`).
- **Roles:** promover un usuario regular a administrador.
- **Reseteo:** forzar reseteo de contraseña o invalidar sesiones activas.

> Regla de negocio: un admin **no** borra físicamente usuarios; solo establece
> `is_active = false` para preservar la integridad referencial (`owner_id` de archivos).

---

## Contrato backend objetivo

Endpoints (ver `.docs/05-modules/system/auth.md`), protegidos por
`JwtAuthGuard` + `@RequirePrivileges`:

| Método | Ruta | Privilegio | Descripción |
|---|---|---|---|
| `GET` | `/users` | `SECURITY.USERS.READ` | Listar usuarios (paginado) |
| `GET` | `/users/:id` | `SECURITY.USERS.BY_ID` | Detalle de usuario |
| `PATCH` | `/users/:id` | `SECURITY.USERS.UPDATE` | Actualizar usuario |
| `PUT` | `/users/:id/toggle-status` | `SECURITY.USERS.CHANGE_STATUS` | Activar/desactivar |

Tablas principales: `users`, `roles`.

---

## Diseño (VAULT, copys reales del Figma)

- Encabezado "Gestión de Usuarios" + buscador ("Buscar por nombre o email...") + botón
  "Agregar usuario".
- Tabla/lista de usuarios: nombre, email, rol (insignia: **Administrador** morado / **Usuario**),
  estado (activo / suspendido) y **almacenamiento usado / límite** con barra de progreso
  cuyo color refleja severidad (normal, **warning** ámbar, **critical** rojo cuando el uso
  ≥ 90%). Texto "con almacenamiento asignado".
- Menú de acciones por usuario: "Ver perfil", **"Suspender"/"Activar"** (toast
  "<nombre> activado/suspendido"), **"Ajustar límite"** (modal "Límite de almacenamiento
  (GB)", "GB disponibles para este usuario"), **"Cambiar rol"** (Select Administrador /
  Usuario, "Seleccionar rol"), **"Cambiar plan"** (Free 15 GB / Pro 100 GB / Business 1 TB,
  confirmación "Confirmar cambio de plan") y **"Eliminar usuario"** (con confirmación).
- Paginación con tamaños "25 / 50 / 100 por página" y "Página N".

> El diseño NO borra físicamente: "Eliminar usuario" / "Suspender" se mapea a
> `is_active = false` en backend, conservando integridad referencial.

---

## Guía de construcción

1. Definir tipos reales en `types/userManagement.types.ts` (`AdminUser`, rol, estado,
   `storageUsed`/`storageLimit`, filtros, paginación).
2. Implementar `userManagementApi.ts` con `apiClient.ts` (mutaciones con `useRequestDeduper`).
3. `useUserManagement` orquesta estado: lista, búsqueda, paginación, acciones.
4. Componentes:
   - `UserManagementList` → tabla con `EntityListItem`, `Pagination`, `EntityListStateRenderer`.
   - `UserManagementDetail` → panel/modal de detalle.
   - `UserManagementForm` → editar rol/estado/límite/plan, con `validations/userManagementSchema.ts`.
5. Reemplazar el placeholder de `pages/page.tsx` componiendo layout + hook + componentes.
6. La UI debe respetar privilegios: ocultar acciones según permisos del admin (RBAC).

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "Gestión de Usuarios") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Gestión de Usuarios" (/admin/users) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `admin`, dentro de AdminLayout. Hoy es un placeholder; complétala.
- Persistencia: mock con misma firma de API para pasar a apiClient.ts.

DISEÑO (VAULT, copys reales del Figma)
- Encabezado "Gestión de Usuarios" + buscador "Buscar por nombre o email..." + botón
  "Agregar usuario".
- Tabla de usuarios: nombre, email, rol (insignia "Administrador" morado / "Usuario"),
  estado (activo/suspendido) y almacenamiento usado/límite con barra de progreso cuyo
  color cambia por severidad: normal, warning (ámbar) y critical (rojo) cuando uso ≥ 90%.
- Menú de acciones por usuario: "Ver perfil"; "Suspender"/"Activar" (toast "<nombre>
  activado/suspendido"); "Ajustar límite" (modal "Límite de almacenamiento (GB)",
  ayuda "GB disponibles para este usuario"); "Cambiar rol" (Select Administrador/Usuario,
  placeholder "Seleccionar rol"); "Cambiar plan" (Free 15 GB / Pro 100 GB / Business 1 TB
  con "Confirmar cambio de plan"); "Eliminar usuario" (confirmación).
- Paginación: tamaños "25 / 50 / 100 por página" y "Página N".

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/admin/user-management/{api,hooks,components,pages,types,validations}.
  - api/userManagementApi.ts: listar/actualizar/estado/límite/rol/plan (mock → apiClient.ts).
  - hooks/useUserManagement.ts: estado, búsqueda, paginación y acciones. Sin lógica en componentes.
  - components/: UserManagementList, UserManagementDetail, UserManagementForm (UI pura).
  - pages/page.tsx: compone layout + hook + componentes; exporta `UsersPage`.
  - types/userManagement.types.ts: AdminUser (rol, estado, storageUsed, storageLimit, plan).
  - validations/userManagementSchema.ts: validación de límite/rol.
- Con backend real: HTTP vía apiClient.ts; toda mutación con useRequestDeduper. Cada acción
  exige el privilegio RBAC correspondiente (JwtAuthGuard + @RequirePrivileges) y la UI
  oculta/deshabilita acciones según permisos. No borrar físicamente: usar is_active=false.
- Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/layout/PageSectionHeader para el encabezado + acción "Agregar usuario".
- @shared/components/tables (EntityListItem, EntityListStateRenderer, Pagination) para la tabla.
- @shared/components/inputs (InputText buscador, Select rol/plan, ActionButton).
- @shared/components/VaultBadge para rol/estado (tono morado admin); barra de progreso de
  almacenamiento con color por severidad usando tokens del tema.
- @shared/components/VaultModal para "Ajustar límite"/"Agregar usuario"; ConfirmModal para
  suspender/eliminar/cambiar plan. toast() para feedback.

ESTILOS
- Solo tokens CSS del tema (incluye var(--vault-purple) para admin, var(--warning), var(--danger)).
  Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Buscar, paginar, suspender/activar, ajustar límite, cambiar rol y plan, eliminar (con
  confirmaciones y toasts) funcionan contra la API del módulo.
- La barra de almacenamiento refleja severidad; las acciones respetan RBAC; reutiliza las
  tablas/inputs/badges compartidos y los tokens del tema.
```

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/user-management.md`
- RBAC: `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`
