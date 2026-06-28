# Flujo de Usuario: Administración

Recorrido del administrador dentro del panel `/admin`: acceso, navegación entre
módulos y operaciones principales de gestión.

---

## Acceso al panel

```
Login (rol: admin)
      │  getHomePathByRole('admin')
      ▼
   /admin  ──(index redirect)──►  /admin/users
      │
      ├── /admin/users     Gestión de usuarios
      ├── /admin/reports   Moderación / reportes
      └── (futuro) /admin/audit   Auditoría
```

- Todas las rutas admin están envueltas en `ProtectedRoute allowedRole="admin"` + `AdminLayout`.
- `/admin` y cualquier ruta admin no reconocida redirigen a `/admin/users`.

---

## Diagrama de navegación

```
                 ┌──────────────┐
   admin login → │   /admin     │ → redirect → /admin/users
                 └──────┬───────┘
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  Gestión de        Moderación       Auditoría
  usuarios          /admin/reports   (futuro)
  /admin/users
```

---

## Flujos de negocio principales

### A. Gestión de usuarios (`/admin/users`)

```
1. Admin abre /admin/users
2. Lista paginada de usuarios (GET /users)
3. Busca por email/nombre
4. Selecciona un usuario → detalle (GET /users/:id)
5. Acción:
   - Activar/Desactivar (PUT /users/:id/toggle-status)  → is_active
   - Promover a admin / editar (PATCH /users/:id)
6. Cada acción exige el privilegio correspondiente (RBAC) y genera evento de auditoría
```

> Regla: el admin nunca borra físicamente; usa `is_active = false`.

### B. Moderación de reportes (`/admin/reports`)

```
1. Usuario denuncia un archivo (POST /drive/items/:id/report)  [lado cliente]
2. Admin abre la cola /admin/reports (ordenada por nº de quejas)
3. Revisa el contenido reportado
4. Resuelve (POST /admin/reports/:id/resolve):
   - Soft block  → drive_items.is_blocked = true   (una copia)
   - Hard block  → file_contents.is_blocked = true (todas las copias por hash)
5. Se guardan notas en drive_moderation_details
6. Eventos ITEM_BLOCKED / GLOBAL_HASH_BLOCKED en audit_log
```

### C. Auditoría (futuro `/admin/audit`)

```
1. Admin filtra eventos por usuario, acción, recurso y fechas
2. Revisa detalle (oldData/newData, IP, user-agent)
3. Solo lectura: la UI nunca escribe en audit_log
```

---

## Seguridad (RBAC)

- Endpoints administrativos requieren `JwtAuthGuard` + `@RequirePrivileges('MODULO.ENTIDAD.ACCION')`.
- Acciones estándar: `READ`, `BY_ID`, `SELECT`, `CREATE`, `UPDATE`, `CHANGE_STATUS`, `DELETE`, `EXPORT`.
- La UI debe ocultar/deshabilitar acciones según los privilegios del admin.
- El payload de privilegios para roles administrativos viaja **cifrado** (AES-256-GCM).

> Detalle completo del modelo RBAC en
> `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`.

---

## Estado actual

| Módulo | Estado frontend |
|---|---|
| Gestión de usuarios | Placeholder ("en construcción") |
| Moderación | Placeholder ("en construcción") |
| Auditoría | Estructura preparada, sin `pages/` ni ruta |
| Dashboard / Planes | No implementados (existen en la doc maestra) |

---

## Pantallas relacionadas

- [Gestión de usuarios](../../pantallas/admin/user-management.md)
- [Moderación](../../pantallas/admin/moderation.md)
- [Auditoría](../../pantallas/admin/audit.md)
