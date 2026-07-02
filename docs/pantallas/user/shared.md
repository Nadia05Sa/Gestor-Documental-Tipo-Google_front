# Pantalla User: Compartidos (`/shared`)

Vista de los archivos y carpetas que **otras personas** han compartido con el
usuario actual ("Compartidos conmigo").

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/shared` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `SharedPage` lista ítems con `isShared = true` mediante
`DriveVaultList` (`tableVariant="shared"`, `showSharedIcon`). Vista por defecto en
modo lista. Datos desde el store mock del Drive.

```text
modules/user/shared/
├── api/sharedApi.ts           # reutiliza driveApi (listShared / …)
├── hooks/useShared.ts         # wrapper de useDriveItemCollection
└── pages/page.tsx             # DriveVaultViewPage + DriveVaultList
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/sharing-permissions.md`.)

- Listar los ítems compartidos con el usuario (vía ACL `item_permissions`).
- Mostrar quién compartió cada ítem (`sharedBy`).
- Abrir/previsualizar respetando `permission_level` (VIEWER, COMMENTER, EDITOR).
- Destacar, mover y enviar a papelera vía menú contextual.

> Distinto de **Unidades compartidas** (`/shared-drives`, propuesta sin ruta):
> esta pantalla es la lista de ítems individuales compartidos contigo.

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/drive/items?sharedWithMe=true` | Listar compartidos conmigo |
| `POST` | `/drive/items/:id/share` | Compartir con un usuario |
| `DELETE` | `/drive/items/:id/share/:userId` | Revocar permiso |

Tablas: `item_permissions`, `drive_items`.

---

## Guía de construcción

1. Tipos desde `@shared/domain/drive`.
2. `sharedApi.ts` + `useShared` vía `useDriveItemCollection` (`openFolder: 'navigate-drive'`).
3. `DriveVaultList` con `tableVariant="shared"` y `showSharedIcon`.
4. `detailHandlers` del hook actualiza estrella en el panel sin cerrarlo.

---

## Prompt para IA

```text
Construye "Compartidos conmigo" (/shared) con DriveVaultViewPage + DriveVaultList.
tableVariant="shared", showSharedIcon, defaultViewMode="list".
Empty state: "Nada compartido contigo aún".
NO crear SharedList.tsx ni types/shared.types.ts.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Unidades compartidas (propuesta): [shared-drives.md](./shared-drives.md)
- Abstracciones Drive: [../../ESTRUCTURA_PROYECTO.md](../../ESTRUCTURA_PROYECTO.md) §7.1
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sharing-permissions.md`
