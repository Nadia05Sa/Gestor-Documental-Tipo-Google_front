# Pantalla User: Recientes (`/recents`)

Vista que muestra los últimos archivos abiertos o visualizados por el usuario,
agrupados por fecha.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/recents` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `RecentsPage` agrupa ítems por **Hoy / Ayer / Esta
semana / Antes** (`getRecentGroup` en `driveItemUtils`) usando
`DriveVaultSectionList` dentro de `DriveVaultViewPage`. Datos desde el store mock.

```text
modules/user/recents/
├── api/recentsApi.ts          # reutiliza driveApi (listRecents / touchRecent / …)
├── hooks/useRecents.ts        # useDriveItemCollection + agrupación por fecha
└── pages/page.tsx             # DriveVaultViewPage + DriveVaultSectionList
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/sidebar-views.md`.)

- Listar los archivos accedidos recientemente, ordenados por `visited_at` descendente.
- Agrupar visualmente por ventana temporal (Hoy, Ayer, etc.).
- Mostrar tiempo relativo de acceso en la cuadrícula.
- Abrir el ítem y gestionar estrella / papelera desde menú contextual y panel lateral.

> Implementación backend: *upsert* ligero en `item_recents` al abrir/previsualizar.

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/drive/recents` | Listar recientes (orden cronológico) |

Tabla: `item_recents`.

---

## Guía de construcción

1. Tipos desde `@shared/domain/drive` (`visitedAt` en `DriveItem`).
2. `recentsApi.ts` compatible con `DriveItemCollectionApi`.
3. `useRecents`: `useDriveItemCollection` + `sections` agrupadas con `getRecentGroup`.
4. `pages/page.tsx`: `DriveVaultSectionList` con `getFooterRight={formatRelativeTime}`.

---

## Prompt para IA

```text
Construye "Archivos recientes" (/recents) reutilizando useDriveItemCollection,
DriveVaultViewPage y DriveVaultSectionList.

DISEÑO: grupos Hoy/Ayer/Esta semana/Antes; tiempo relativo en tarjetas;
empty state "Aún no hay archivos recientes"; panel DriveDetail con estrella y papelera.

NO crear RecentsList.tsx ni types/recents.types.ts. Import DriveVaultViewPage desde drive/organisms/.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Abstracciones Drive: [../../ESTRUCTURA_PROYECTO.md](../../ESTRUCTURA_PROYECTO.md) §7.1
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sidebar-views.md`
