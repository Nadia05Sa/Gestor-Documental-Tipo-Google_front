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
      ├── /admin/dashboard   Panel de Administración   (propuesta de diseño)
      ├── /admin/users       Gestión de usuarios
      ├── /admin/files       Gestión de archivos       (propuesta de diseño)
      ├── /admin/audit       Bitácora y Auditoría       (estructura preparada)
      └── /admin/reports     Moderación / reportes      (sin ref. Figma)
```

- Todas las rutas admin están envueltas en `ProtectedRoute allowedRole="admin"` + `AdminLayout`.
- `/admin` y cualquier ruta admin no reconocida redirigen a `/admin/users`.
- El **sidebar admin implementado** (`ADMIN_MENU`) muestra solo **Usuarios**
  (`/admin/users`). El diseño VAULT prevé Dashboard, Gestión de Archivos y
  Bitácora/Auditoría — aún sin ruta ni ítems en el menú.
- **Moderación / reportes** (`/admin/reports`) está enrutada pero es placeholder;
  deriva de la documentación maestra de backend, no del Figma VAULT.

---

## Diagrama de navegación

```
                      ┌──────────────┐
   admin login →      │   /admin     │ → redirect → /admin/users
                      └──────┬───────┘
   ┌──────────┬─────────────┼─────────────┬──────────────┐
   ▼          ▼             ▼             ▼              ▼
 Dashboard  Gestión de   Gestión de   Bitácora y    Moderación
 /admin/    usuarios     archivos     Auditoría     /admin/reports
 dashboard  /admin/users /admin/files /admin/audit  (sin ref. Figma)
 (propuesta)             (propuesta)  (preparada)
```

---

## Flujos de negocio principales

### 0. Panel de Administración (`/admin/dashboard`) — propuesta de diseño

```
1. El admin entra y ve métricas globales (Total de Usuarios, Usuarios Activos Hoy,
   Archivos en el Sistema, Promedio por Usuario)
2. Bloque de almacenamiento: Capacidad Total, Espacio Disponible, Almacenamiento Usado (%)
3. Solo lectura; punto de entrada al resto del panel admin
```

### A. Gestión de usuarios (`/admin/users`)

```
1. Admin abre /admin/users
2. Lista paginada de usuarios (GET /users)
3. Busca por email/nombre
4. Selecciona un usuario → detalle (GET /users/:id)
5. Acción:
   - Suspender/Activar (PUT /users/:id/toggle-status)  → is_active
   - Cambiar rol Administrador/Usuario / editar (PATCH /users/:id)
   - Ajustar límite de almacenamiento (GB) y cambiar plan (Free/Pro/Business)
   - Eliminar usuario (marcado lógico)
6. Cada acción exige el privilegio correspondiente (RBAC) y genera evento de auditoría
```

> Regla: el admin nunca borra físicamente; usa `is_active = false`.

### A2. Gestión de archivos (`/admin/files`) — propuesta de diseño

```
1. Admin lista/busca TODOS los archivos del sistema (owner, tipo, tamaño, estado)
2. Vista previa / detalle del archivo
3. Acciones de supervisión:
   - Bloquear (soft = una copia / hard = todas por hash)
   - Eliminar (marcado lógico)
4. Genera eventos ITEM_BLOCKED / GLOBAL_HASH_BLOCKED en audit_log
```

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
| Panel de Administración (Dashboard) | Propuesta de diseño (sin módulo ni ruta) |
| Gestión de usuarios | Placeholder en `pages/page.tsx`; hook vacío; sin `organisms/` |
| Gestión de archivos | Propuesta de diseño (sin módulo ni ruta) |
| Bitácora y Auditoría | Solo `api/`, `hooks/`, `types/`, `validations/`; sin `pages/` ni ruta |
| Moderación | Placeholder en `pages/page.tsx`; hook vacío; sin `organisms/` |

---

## Pantallas relacionadas

- [Panel de Administración](../../pantallas/admin/dashboard.md) (propuesta)
- [Gestión de usuarios](../../pantallas/admin/user-management.md)
- [Gestión de archivos](../../pantallas/admin/file-management.md) (propuesta)
- [Bitácora y Auditoría](../../pantallas/admin/audit.md)
- [Moderación](../../pantallas/admin/moderation.md) (sin ref. Figma)
