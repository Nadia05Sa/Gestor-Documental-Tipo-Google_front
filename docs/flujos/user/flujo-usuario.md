# Flujo de Usuario: Área de trabajo (Drive y vistas)

Recorrido del usuario final (`role = user`) dentro de su área autenticada:
navegación del Drive, vistas laterales (favoritos, recientes, papelera) y
configuración.

---

## Acceso al área de usuario

```
Login (rol: user)
      │  getHomePathByRole('user')
      ▼
   /drive  ◄── home del usuario
      │
      ├── /shared         Compartidos conmigo
      ├── /shared-drives  Unidades compartidas   (propuesta de diseño)
      ├── /recents        Recientes
      ├── /favorites      Favoritos / Destacados
      ├── /trash          Papelera
      ├── /billing        Facturación
      ├── /settings       Configuración
      └── /assistant      Asistente IA           (propuesta de diseño)
```

Todas las rutas están envueltas en `ProtectedRoute allowedRole="user"` +
`UserLayout` (incluye `DriveSearchProvider`). La navegación entre vistas se hace
desde el `Sidebar` (`USER_MENU`: 7 ítems + separador antes de Papelera). **Unidades
compartidas** y **Asistente IA** son pantallas del diseño VAULT aún no implementadas
(sin ruta; `shared-drives/pages/` existe vacío).

---

## Diagrama de navegación

```
                     ┌──────────────┐
       user login →  │   /drive     │  (explorador principal)
                     └──────┬───────┘
   ┌──────────┬────────┬────┼─────┬──────────┬──────────┐
   ▼          ▼        ▼    ▼     ▼          ▼          ▼
 Compartidos Recientes Favoritos Papelera Facturación Settings
 /shared    /recents  /favorites /trash   /billing    /settings
```

---

## Flujos de negocio principales

### A. Explorar y organizar (`/drive`)

```
1. Carga la carpeta raíz (GET /drive/items?parentId=null)
2. Navega a subcarpetas vía breadcrumbs (parentId)
3. Operaciones:
   - Nueva carpeta (POST /drive/folders)
   - Renombrar (PATCH /drive/items/:id)
   - Mover por drag & drop (PUT /drive/items/:id/move)
   - Enviar a papelera (DELETE /drive/items/:id → is_deleted = true)
```

### A2. Compartidos conmigo (`/shared`)

```
1. /shared lista los ítems con permiso ACL para el usuario (item_permissions)
2. Se muestra quién compartió cada ítem y una insignia "Compartido"
3. Abrir/previsualizar respeta el permission_level (VIEWER / COMMENTER / EDITOR)
```

### B. Acceso rápido — Favoritos (`/favorites`)

```
1. Marca un ítem con estrella (POST /drive/items/:id/favorite)
2. Lo encuentra en /favorites (item_favorites, por usuario)
3. Quita la estrella (DELETE /drive/items/:id/favorite)
```

### C. Continuar trabajo — Recientes (`/recents`)

```
1. Al abrir/previsualizar un ítem, svc-main hace upsert en item_recents
2. /recents lista por visited_at descendente (solo lectura)
```

### D. Ciclo de vida de borrado — Papelera (`/trash`)

```
1. /trash lista ítems con is_deleted = true
2. Restaurar (PUT /drive/items/:id/restore) → vuelve a su parent_id original
3. Borrado definitivo (DELETE /drive/items/:id/permanent)
   - Marca is_permanently_deleted = true (no borra físicamente)
   - Decrementa reference_count y la cuota del owner
4. Auto-purga lógica tras 30 días (cronjob)
```

### E. Preferencias (`/settings`)

```
1. La app lee GET /settings al iniciar → ThemeContext / LocaleContext
2. El usuario cambia tema/idioma/zona horaria (PATCH granular)
3. La pestaña Perfil edita nombre/correo; al pie está "Cerrar sesión"
```

### F. Facturación (`/billing`)

```
1. /billing muestra plan actual, uso de almacenamiento y método de pago
2. Historial de pagos (payment_history) con estado pagado/pendiente/fallido
3. Upgrade/downgrade entre planes (checkout vía Stripe en backend real)
4. CRUD de métodos de pago (agregar, eliminar, marcar predeterminado)
```

### G. Unidades compartidas (`/shared-drives`) — propuesta de diseño

```
1. /shared-drives lista las unidades del equipo (memberCount, owner, myRole)
2. Crear/editar unidad (nombre + descripción); eliminar con confirmación
3. Gestionar miembros: pestañas Miembros / Invitaciones
   - Roles: Control total / Puede editar / Puede comentar / Solo visualizar
   - Invitar miembro, cambiar rol, quitar de la unidad, reenviar/cancelar invitación
```

### H. Asistente IA (`/assistant`) — propuesta de diseño

```
1. El usuario abre el chat (pantalla /assistant o panel lateral)
2. Escribe una pregunta ("Escribe tu pregunta...") y envía
3. El asistente muestra estado "procesando" y responde sobre el Drive del usuario
   (respetando sus permisos; sin exponer IDs internos)
```

---

## Principios transversales

- Vistas laterales de archivos: reutilizar abstracciones de [ESTRUCTURA_PROYECTO §7.1](../../ESTRUCTURA_PROYECTO.md) (`useDriveItemCollection`, `DriveVaultList`, etc.).
- **Nada se borra físicamente:** todo es soft-delete / marcado lógico (trazabilidad).
- **Permisos por recurso (ACL):** las operaciones del Drive no usan `@RequirePrivileges`;
  se validan por propiedad del recurso (`owner_id`) o permisos compartidos (`item_permissions`).
- **Toda petición HTTP** vía `apiClient.ts`; **toda mutación** con `useRequestDeduper`.

---

## Estado actual

| Pantalla | Estado frontend |
|---|---|
| Drive | Implementada (mock): explorador completo, DnD, modales, búsqueda avanzada |
| Compartidos conmigo | Implementada (mock): `DriveVaultViewPage` + `DriveVaultList` |
| Unidades compartidas | Propuesta de diseño (`modules/user/shared-drives/pages/` vacío) |
| Recientes | Implementada (mock): agrupada por fecha, `DriveVaultSectionList` |
| Favoritos / Destacados | Implementada (mock): `useDriveItemCollection` |
| Papelera | Implementada (mock): selección en lote, `DriveItemsTable` custom |
| Facturación | Implementada (mock): plan, uso, historial |
| Configuración | Implementada (mock): perfil + preferencias + loading state |
| Asistente IA | Propuesta de diseño (sin módulo ni ruta) |

### Abstracciones compartidas del área Drive

Las vistas laterales de archivos comparten:

- **Hook:** `useDriveItemCollection` (`modules/user/drive/hooks/`)
- **Layout de página:** `DriveVaultViewPage` (= `DriveVaultCollectionShell` en `@shared/domain/drive/organisms/`)
- **Re-export:** `modules/user/drive/organisms/DriveVaultViewPage.tsx` (punto de importación usado por favorites, shared, recents)
- **Listas:** `DriveVaultList` / `DriveVaultSectionList` (`@shared/domain/drive/organisms/`)
- **Tipos:** `@shared/domain/drive/types/drive.types.ts` (fuente única de `DriveItem`)

Ver [ESTRUCTURA_PROYECTO.md §7.1](../../ESTRUCTURA_PROYECTO.md).

> **Nota:** la persistencia es un store mock en `localStorage`
> (`vault_drive_items`, `vault_user_settings`). Al integrar el backend real se
> sustituye por `apiClient.ts` manteniendo las firmas de las APIs por módulo.

---

## Pantallas relacionadas

- [Mi Drive](../../pantallas/user/drive.md)
- [Compartidos conmigo](../../pantallas/user/shared.md)
- [Unidades compartidas](../../pantallas/user/shared-drives.md) (propuesta)
- [Recientes](../../pantallas/user/recents.md)
- [Favoritos / Destacados](../../pantallas/user/favorites.md)
- [Papelera](../../pantallas/user/trash.md)
- [Facturación](../../pantallas/user/billing.md)
- [Configuración](../../pantallas/user/settings.md)
- [Asistente IA](../../pantallas/user/ai-assistant.md) (propuesta)
