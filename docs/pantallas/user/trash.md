# Pantalla User: Papelera (`/trash`)

Vista de los archivos eliminados (soft-delete). Permite restaurarlos o
eliminarlos permanentemente.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/trash` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `TrashPage` lista los ítems eliminados con selección en
lote (checkboxes), **barra de acciones flotante**, restaurar y eliminar
permanentemente (individual o en lote) con `ConfirmModal`, vaciar papelera,
detalle del ítem y aviso de expiración a los 30 días. Datos desde el store mock
del Drive.

```text
modules/user/trash/
├── api/trashApi.ts              # reutiliza driveApi (listTrash / restore / …)
├── components/
│   ├── TrashList.tsx            # DriveItemsTable con columnas custom + selección
│   └── TrashDetail.tsx          # panel lateral (DetailInfoRow compartido)
├── hooks/useTrash.ts            # lista, selección, restaurar, borrar, vaciar
└── pages/page.tsx
```

> Tipos `DriveItem` importados desde `modules/user/drive/types/drive.types.ts`.

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/sidebar-views.md`.)

- Listar ítems con `is_deleted = true`.
- Restaurar un ítem a su ubicación original (su `parent_id` se conserva).
- Eliminar permanentemente un ítem o vaciar la papelera.
- Los ítems se eliminan automáticamente tras **30 días** en papelera (cronjob).

> **Principio Vault:** nunca se borra físicamente. El borrado permanente marca
> `is_permanently_deleted = true` en `drive_trash_details` y conserva el binario
> en MinIO para trazabilidad y auditoría.

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/drive/items?deleted=true` | Listar la papelera |
| `PUT` | `/drive/items/:id/restore` | Restaurar ítem |
| `DELETE` | `/drive/items/:id/permanent` | Borrado definitivo (marcado lógico) |

Tablas: `drive_items`, `drive_trash_details`; decrementa `reference_count` en
`file_contents` y la cuota en `user_storage.used_bytes`.

---

## Guía de construcción

1. Tipos desde `drive/types/drive.types.ts` (campos `deletedAt`, `deletedBy`, etc.).
2. `trashApi.ts` con `apiClient.ts`; restaurar y borrar definitivo como mutaciones con `useRequestDeduper`.
3. `useTrash` maneja lista, selección, restauración, borrado y "vaciar papelera".
4. `TrashList` usa `DriveItemsTable` (selectable, columnas custom); `TrashDetail` usa `DetailInfoRow`.

---

## Prompt para IA

> Prompt listo para construir/refinar esta pantalla con un asistente de IA. Basado
> en el diseño **VAULT** (Figma) y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Papelera" (/trash) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `user`, dentro de UserLayout. Datos desde el store mock del Drive (reutiliza driveApi).

DISEÑO (VAULT, copys reales del Figma)
- Encabezado de sección con título "Papelera", aviso de expiración (los ítems se
  eliminan a los 30 días) y botón "Vaciar papelera".
- Lista de ítems eliminados (is_deleted=true) con SELECCIÓN EN LOTE (checkboxes). Cada
  ítem conserva su ubicación original (originalLocation), fecha (deletedAt) y autor (deletedBy).
- Barra de acciones FLOTANTE cuando hay selección: "Restaurar" y "Eliminar
  permanentemente" sobre los seleccionados.
- Acciones por ítem: "Restaurar" y "Eliminar permanentemente" (con confirmación). Toasts
  reales: "Archivo restaurado" / "Archivo eliminado permanentemente".
- Detalle del ítem SIN preview: muestra "Vista previa no disponible en papelera".
- Estado vacío: "La papelera está vacía".

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/user/trash/{api,hooks,components,pages,types}.
  - api/trashApi.ts: reutiliza driveApi (listTrash / restore / deletePermanent / emptyTrash).
  - hooks/useTrash.ts: lista, selección, restaurar, borrar y vaciar. Sin lógica en componentes.
  - components/TrashList.tsx y TrashDetail.tsx: UI pura.
  - pages/page.tsx: compone hook + componentes; exporta `TrashPage`.
  - Tipos desde `drive/types/drive.types.ts` (campos deletedAt, deletedBy, etc.).
- Con backend real: HTTP vía apiClient.ts; restaurar/borrar definitivo/vaciar con
  useRequestDeduper. Borrado definitivo = marcado lógico (no destructivo físicamente).
- Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/drive/DriveItemsTable (selectable, columnas custom, getRowActions).
- @shared/components/layout/DetailInfoRow en TrashDetail.
- @shared/components/ConfirmModal para borrado permanente y vaciar papelera.
- @shared/components/layout/VaultViewPageLayout para el encabezado + acción "Vaciar papelera".
- @shared/components/VaultSidePanel para TrashDetail.
- @shared/components/tables/EmptyStatePanel, VaultBadge, toast().

ESTILOS
- Solo tokens CSS del tema (incluye var(--danger-600) para acciones destructivas). Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Selección en lote, barra flotante, restaurar/eliminar (individual y en lote) con
  ConfirmModal, vaciar papelera y aviso de 30 días funcionan; reutiliza DriveItemsTable
  en modo selectable (no DriveItemsView).
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sidebar-views.md`
