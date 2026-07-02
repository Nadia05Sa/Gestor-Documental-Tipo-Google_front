# Pantalla User: Mi Drive (`/drive`)

Componente central de la experiencia del usuario: explorador donde visualiza,
organiza y gestiona sus archivos y carpetas. Es el home del rol `user`.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/drive` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `DrivePage` es un explorador funcional: cuadrícula/lista,
breadcrumbs, navegación por carpetas, crear carpeta, subir archivo, renombrar,
destacar, compartir, mover a papelera y previsualización. La persistencia es un
**store mock** en `localStorage` (`vault_drive_items`) que replica el contrato
objetivo de `svc-main`; al existir backend se reemplaza por `apiClient.ts`.

```text
modules/user/drive/
├── api/driveApi.ts                    # store mock (CRUD, papelera, favoritos, recientes)
├── hooks/
│   ├── useDrive.ts                    # carpeta actual, breadcrumbs, acciones del explorador
│   └── useDriveItemCollection.ts      # hook genérico reutilizado por vistas laterales
├── organisms/
│   ├── DriveToolbar.tsx               # título, toggle grid/list, nueva carpeta, subir
│   ├── DriveBreadcrumbs.tsx           # ruta de navegación + DnD
│   ├── DriveList.tsx                  # DriveItemsGrid / DriveItemsTable + empty state
│   ├── DriveForm.tsx                  # modal crear carpeta / renombrar
│   ├── UploadFileModal.tsx
│   ├── DriveDetail.tsx                # panel lateral de previsualización
│   ├── DriveVaultViewPage.tsx         # re-export de DriveVaultCollectionShell (vistas laterales)
│   ├── ShareModal.tsx
│   ├── AdvancedSearchModal.tsx
│   ├── CreateContentModal.tsx
│   └── DrivePageModals.tsx            # orquestador de modales
├── pages/page.tsx                     # compone DrivePageTemplate + organismos
├── types/drive.types.ts               # re-export desde @shared/domain/drive
└── validations/driveSchema.ts
```

> `DriveVaultViewPage` apunta a `@shared/domain/drive/organisms/DriveVaultCollectionShell.tsx`.
> Favoritos, Compartidos y Recientes lo importan desde `../drive/organisms/DriveVaultViewPage`.
>
> La cuadrícula, la tabla y las listas unificadas viven en `@shared/domain/drive/organisms/`
> (`DriveItemsGrid`, `DriveItemsTable`, `DriveVaultList`, `DriveFileCard`,
> `driveItemUtils`, `buildStandardDriveRowActions`). Las reutilizan Favoritos,
> Recientes, Compartidos y Papelera.

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/drive.md`.)

- **Listado:** contenido de la carpeta actual (raíz por defecto).
- **Navegación:** entrar a carpetas y volver con breadcrumbs (migas de pan).
- **Operaciones:** crear carpeta, renombrar, mover (drag & drop) y enviar a papelera (soft-delete).
- **Restauración:** sacar ítems de la papelera o eliminarlos permanentemente.
- **Miniaturas:** previsualización de archivos (thumbnails) según el tipo.

---

## Contrato backend objetivo

Endpoints (ver `.docs/05-modules/user/drive.md`), servidos por `svc-main`:

| Método | Ruta | Uso en UI | Guard |
|---|---|---|---|
| `GET` | `/drive/items?parentId=...` | Cargar grid/lista | `JwtAuthGuard` |
| `GET` | `/drive/items/:id` | Ver detalle del ítem | `ItemAccessGuard` (VIEWER) |
| `POST` | `/drive/folders` | "Nueva carpeta" | `JwtAuthGuard` |
| `PATCH` | `/drive/items/:id` | Renombrar | `ItemAccessGuard` (EDITOR) |
| `PUT` | `/drive/items/:id/move` | Drop de drag & drop | `ItemAccessGuard` (EDITOR) |
| `DELETE` | `/drive/items/:id` | Mover a papelera | `ItemAccessGuard` (OWNER) |
| `PUT` | `/drive/items/:id/restore` | Restaurar | `ItemAccessGuard` (OWNER) |
| `DELETE` | `/drive/items/:id/permanent` | Borrar definitivo | `ItemAccessGuard` (OWNER) |

Tablas: `drive_items`, `item_permissions`, `drive_trash_details`.

> Notas clave: el listado filtra por `parentId` (no devuelve todo el árbol); el
> borrado es **soft-delete** (`is_deleted = true`); el almacenamiento se delega
> a Storage con deduplicación SHA-256. Los IDs públicos usan UUID, no el ID interno.

---

## Guía de construcción

1. Tipos en `types/drive.types.ts` (`DriveItem`, `ItemKind`, breadcrumb, permisos).
2. `driveApi.ts` con `apiClient.ts`; mutaciones (mover, renombrar, borrar) con `useRequestDeduper`.
3. `useDrive` orquesta: carpeta actual, breadcrumbs, selección, drag & drop, acciones.
4. Organismos:
   - `DriveList` → `DriveItemsGrid` (grid, con DnD) / `DriveItemsTable` (lista).
   - `DriveDetail` → panel lateral con `DetailInfoRow` compartido.
   - `DriveForm` → diálogos de "nueva carpeta" y "renombrar", con `driveSchema.ts`.
5. Vistas laterales: exponer APIs delgadas (`favoritesApi`, etc.) y usar
   `useDriveItemCollection` + `DriveVaultViewPage` + `DriveVaultList`.

---

## Prompt para IA

> Prompt listo para construir/refinar esta pantalla con un asistente de IA. Basado
> en el diseño **VAULT** (Figma "VAULT Document Management System") y en la
> arquitectura real del repositorio. Las **reglas de arquitectura** y los
> **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Mi Drive" (/drive) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- La pantalla es el HOME del rol `user`, dentro de UserLayout (Sidebar + Header + ToastHost).
- Persistencia actual: store mock en localStorage (vault_drive_items). Mantén la firma
  de la API por módulo para poder cambiar a apiClient.ts sin tocar componentes.

DISEÑO (VAULT, copys reales del Figma) — explorador tipo Google Drive ("Mi Unidad")
- Toolbar superior: título "Mi Unidad", buscador con placeholder "Buscar archivos,
  carpetas...", botón "Búsqueda Avanzada", toggle de vista cuadrícula/lista, botón
  "Nueva carpeta" y menú "Subir" (acción primaria acentuada).
- Crear contenido inline: además de carpeta, permite "Crear documento" y "Crear hoja
  de cálculo" (toasts "Creando nuevo documento..." / "Creando nueva hoja de cálculo...").
- Búsqueda Avanzada (panel/modal con filtros): "Tipo de archivo" (Seleccionar tipo),
  "Tamaño mínimo (MB)", "Tamaño máximo (MB)", rango de fechas, tags
  ("Separar por comas: trabajo, importante, urgente"), "Solo archivos compartidos",
  "Solo archivos destacados".
- Breadcrumbs (migas de pan) para navegar por carpetas.
- Área de contenido: cuadrícula de tarjetas (icono por tipo, nombre, tamaño/"Carpeta",
  estrella de destacado, acciones al hover) o tabla en modo lista (Nombre, Tamaño,
  Modificado, insignia "Compartido", acciones). Drag & drop para mover ("Mover a...",
  "Mover aquí").
- Acciones por ítem: abrir (doble clic), destacar/quitar estrella (toasts "Añadido a
  destacados" / "Eliminado de destacados"), renombrar, mover a papelera, "Obtener enlace"
  (toast "Enlace copiado al portapapeles") y compartir.
- Modal "Compartir": "Personas con acceso" (lista + permisos "Puede editar" / "Puede
  comentar" / "Solo ver"), "Acceso con enlace" ("Cualquier persona con el enlace") y
  botón "Obtener enlace".
- Carpeta → navega; archivo → abre "Vista previa" (panel/modal lateral).
- Estado vacío con llamada a subir/crear contenido.
- Modales: crear carpeta ("Nombre de la carpeta"), renombrar ("Nuevo nombre"), subir,
  compartir y panel de detalle/preview.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Respeta el patrón de módulos: modules/user/drive/{api,hooks,organisms,pages,types,validations}.
  - api/driveApi.ts: acceso a datos (mock localStorage hoy; misma firma para apiClient.ts).
  - hooks/useDrive.ts: TODO el estado y la orquestación (carpeta actual, breadcrumbs,
    viewMode, selección, acciones). Los organismos NO contienen lógica de negocio.
  - organisms/: UI pura que recibe props y callbacks (DriveToolbar, DriveBreadcrumbs,
    DriveList, DriveForm, UploadFileModal, DriveDetail).
  - pages/page.tsx: compone hook + organismos; exporta `DrivePage`.
  - types/drive.types.ts: DriveItem, ItemKind, Breadcrumb, ViewMode.
  - validations/driveSchema.ts: validateItemName.
- Cuando exista backend: toda petición HTTP vía apiClient.ts y toda mutación (crear,
  renombrar, mover, borrar) envuelta en useRequestDeduper. IDs públicos UUID, no internos.
- Importa con alias @shared/* y @context/*. Borrado = soft-delete (no destructivo).

COMPONENTES REUTILIZABLES (NO reinventar)
- Cuadrícula: @shared/domain/drive/organisms/DriveItemsGrid (movable/onMoveItem para DnD).
- Tabla: @shared/domain/drive/organisms/DriveItemsTable + buildStandardDriveRowActions.
- Toggle de vista: @shared/domain/drive/molecules/ViewModeToggle.
- Iconos y formatos: @shared/domain/drive/utils/driveItemUtils.
- Filas de detalle: @shared/components/molecules/DetailInfoRow.
- Botones: @shared/components/atoms/ActionButton.
- Estado vacío: @shared/components/molecules/EmptyStatePanel.
- Modales: @shared/components/molecules/VaultModal; panel lateral: @shared/components/organisms/VaultSidePanel.
- Mover ítem: @shared/domain/drive/organisms/MoveItemModal.
- Notificaciones: toast() de @shared/components/organisms/Toast. Confirmaciones: @shared/components/molecules/ConfirmModal.

ESTILOS
- Usa exclusivamente los tokens CSS del tema: var(--text-primary), var(--text-secondary),
  var(--accent), var(--accent-subtle), var(--bg-elevated), var(--bg-surface),
  var(--border-default), var(--radius-card), var(--shadow-card). Nada de colores hardcodeados.

ENTREGABLES
- Código de los archivos del módulo siguiendo la estructura anterior, sin lógica en componentes.
- Sin errores de lint/tipos.

CRITERIOS DE ACEPTACIÓN
- Cambiar grid/list, navegar por breadcrumbs, crear carpeta/doc/hoja, subir, renombrar,
  destacar, mover a papelera y previsualizar funcionan contra la API del módulo.
- Búsqueda Avanzada filtra por tipo, tamaño, fechas, tags y banderas (compartido/destacado).
- El modal "Compartir" gestiona permisos por persona y enlace público ("Obtener enlace").
- 100% de la UI reutiliza los componentes compartidos listados; cero CSS de color hardcodeado.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Vistas laterales: [shared.md](./shared.md) · [favorites.md](./favorites.md) · [recents.md](./recents.md) · [trash.md](./trash.md)
- Abstracciones Drive: [../../ESTRUCTURA_PROYECTO.md](../../ESTRUCTURA_PROYECTO.md) §7.1
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/drive.md`
