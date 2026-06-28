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

## Guía de construcción

1. Definir tipos reales en `types/userManagement.types.ts` (`AdminUser`, filtros, paginación).
2. Implementar `userManagementApi.ts` con `apiClient.ts` (mutaciones con `useRequestDeduper`).
3. `useUserManagement` orquesta estado: lista, filtros, paginación, acciones.
4. Componentes:
   - `UserManagementList` → tabla con `EntityListItem`, `Pagination`, `EntityListStateRenderer`.
   - `UserManagementDetail` → panel/modal de detalle.
   - `UserManagementForm` → edición de rol/estado, con `validations/userManagementSchema.ts`.
5. Reemplazar el placeholder de `pages/page.tsx` componiendo layout + hook + componentes.
6. La UI debe respetar privilegios: ocultar acciones según permisos del admin (RBAC).

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/user-management.md`
- RBAC: `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`
