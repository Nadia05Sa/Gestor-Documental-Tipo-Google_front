# Pantalla User: Favoritos (`/favorites`)

Vista de acceso rápido a los archivos y carpetas que el usuario marcó con
"estrella" (Destacados).

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/favorites` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `FavoritesPage` usa las abstracciones compartidas del
área Drive: `useDriveItemCollection`, `DriveVaultViewPage` y `DriveVaultList`.
Los datos provienen del store mock (`vault_drive_items` en `localStorage`).

```text
modules/user/favorites/
├── api/favoritesApi.ts          # reutiliza driveApi (listStarred / toggleStar / …)
├── hooks/useFavorites.ts        # wrapper de useDriveItemCollection
└── pages/page.tsx               # DriveVaultViewPage + DriveVaultList
```

> No hay componentes `FavoritesList` ni `types/favorites.types.ts`: los tipos
> vienen de `@shared/domain/drive` (`DriveItem`, etc.).

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/sidebar-views.md`.)

- Marcar/desmarcar ítems como favoritos (estrella).
- Listar únicamente los ítems destacados del usuario.
- Abrir o navegar al ítem desde la vista de favoritos.
- Panel lateral (`DriveDetail`) con mover a papelera y quitar destacado.

> Los favoritos son **por usuario**: si un archivo se comparte entre dos
> personas, cada una gestiona su propia estrella sin afectar a la otra
> (tabla `item_favorites`).

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/drive/items?favorites=true` (o endpoint dedicado) | Listar favoritos |
| `POST` | `/drive/items/:id/favorite` | Marcar favorito |
| `DELETE` | `/drive/items/:id/favorite` | Quitar favorito |

Tabla: `item_favorites` (`item_id`, `user_id`).

---

## Guía de construcción

1. Tipos: importar `DriveItem` y `ViewMode` desde `@shared/domain/drive` (o vía `modules/user/drive/types/drive.types.ts`, que re-exporta).
2. `favoritesApi.ts` con firmas compatibles con `DriveItemCollectionApi`.
3. `useFavorites` como wrapper de `useDriveItemCollection` con
   `closePreviewOnToggleStar: true` y `openFolder: 'navigate-drive'`.
4. `pages/page.tsx` compone `DriveVaultViewPage` + `DriveVaultList` con empty state.

---

## Prompt para IA

> Prompt listo para construir/refinar esta pantalla con un asistente de IA.

```text
Construye la pantalla "Destacados" (/favorites) del frontend Infinity Vault.

CONTEXTO
- Rol `user`, dentro de UserLayout. Datos desde el store mock del Drive.
- Reutiliza useDriveItemCollection, DriveVaultViewPage y DriveVaultList (NO crear FavoritesList propio).

DISEÑO (VAULT)
- Título visible "Destacados"; toggle grid/list vía DriveVaultViewPage.
- Lista solo ítems con estrella activa. Quitar estrella los retira (toast "Eliminado de destacados").
- Empty state: "No tienes archivos destacados".
- DriveDetail lateral: quitar destacado, mover a papelera, mover a… (MoveItemModal).

ARQUITECTURA
- modules/user/favorites/{api,hooks,pages} — sin types/ ni organisms/ propios salvo necesidad real.
- api/favoritesApi.ts → driveApi. hooks/useFavorites.ts → useDriveItemCollection.
- Import: DriveVaultViewPage desde `modules/user/drive/organisms/DriveVaultViewPage`.
- Tipos desde `@shared/domain/drive`.

COMPONENTES REUTILIZABLES
- DriveVaultViewPage, DriveVaultList, DriveItemsGrid, DriveItemsTable, MoveItemModal, DriveDetail.
- EmptyStatePanel, VaultViewPageLayout, toast().

CRITERIOS DE ACEPTACIÓN
- Lista solo destacados, quitar estrella actualiza vista, panel lateral funcional, cero duplicación de List/Detail/Form stubs.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Abstracciones Drive: [../../ESTRUCTURA_PROYECTO.md](../../ESTRUCTURA_PROYECTO.md) §7.1
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sidebar-views.md`
