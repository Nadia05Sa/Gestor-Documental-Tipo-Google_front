# Pantalla Admin: Gestión de Archivos (`/admin/files`)

Vista global donde el administrador supervisa **todos los archivos del sistema**
(no solo los suyos): búsqueda, propietario, tipo, tamaño y acciones de
supervisión/moderación. Aparece en el diseño VAULT como "Gestión de Archivos".

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/admin/files` |
| Acceso | `ProtectedRoute allowedRole="admin"` |
| Layout | `AdminLayout` |
| Registro de ruta | `router/AdminRoutes.tsx` |

---

## Estado de implementación

**No implementada (propuesta de diseño).** No existe el módulo
`modules/admin/file-management/`. Esta ficha documenta el diseño VAULT y el prompt.

```text
modules/admin/file-management/    (propuesto)
├── api/fileManagementApi.ts       # listar/buscar/bloquear/eliminar (mock → apiClient.ts)
├── organisms/
│   ├── FileManagementList.tsx     # tabla global de archivos
│   ├── FileManagementDetail.tsx   # detalle / vista previa
│   └── FileManagementToolbar.tsx  # búsqueda + filtros
├── hooks/useFileManagement.ts     # lista, filtros, paginación, acciones
├── pages/page.tsx                 # exporta FilesPage
├── types/file-management.types.ts # AdminFile, filtros
└── validations/fileManagementSchema.ts
```

---

## Funcionalidad objetivo

(Basado en el diseño VAULT "Gestión de Archivos" y en
`.docs/05-modules/admin/` + moderación.)

- **Listado global** de archivos del sistema ("Archivos en el Sistema"): nombre, tipo,
  propietario (`owner`), tamaño, fecha de modificación, estado (normal / bloqueado).
- **Búsqueda y filtros** ("Buscar archivos, carpetas...", tipo de archivo, tamaño, fechas).
- **Vista previa / detalle** del archivo.
- **Acciones de supervisión:** bloquear contenido (soft / hard por hash) y eliminar; estas
  acciones de moderación están aquí en el diseño (ver [moderation.md](./moderation.md) para
  el modelo de sanciones).
- Paginación.

> Principio Vault: nada se borra físicamente; el bloqueo/eliminación es marcado lógico y
> genera eventos en `audit_log`.

---

## Contrato backend objetivo (propuesto)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/admin/files` | Listar/buscar todos los archivos (paginado) |
| `GET` | `/admin/files/:id` | Detalle de un archivo |
| `POST` | `/admin/files/:id/block` | Bloquear (soft/hard por hash) |
| `DELETE` | `/admin/files/:id` | Eliminar (marcado lógico) |

Tablas: `drive_items`, `file_contents`, `drive_moderation_details`.

---

## Guía de construcción

1. Tipos en `types/file-management.types.ts` (`AdminFile`, estado, filtros, paginación).
2. `fileManagementApi.ts` con `apiClient.ts`; bloquear/eliminar como mutaciones con `useRequestDeduper`.
3. `useFileManagement` orquesta lista, búsqueda, filtros, paginación y acciones.
4. Componentes (UI pura) reutilizando la cuadrícula/lista compartida cuando aplique.
5. Registrar `/admin/files` en `AdminRoutes.tsx` y el ítem "Gestión de Archivos" en el `Sidebar` admin.

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "Gestión de Archivos") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Gestión de Archivos" (/admin/files) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `admin`, dentro de AdminLayout. La feature es NUEVA: crea modules/admin/file-management/.
- Vista global de TODOS los archivos del sistema (no solo los del admin).
- Persistencia: mock con misma firma para apiClient.ts.

DISEÑO (VAULT, copys reales del Figma)
- Encabezado "Gestión de Archivos" + buscador "Buscar archivos, carpetas..." + filtros
  (tipo de archivo, tamaño, fechas) y toggle de vista grid/list.
- Tabla/cuadrícula global: nombre + icono por tipo, propietario (owner), tamaño, fecha de
  modificación e insignia de estado (normal / bloqueado).
- Vista previa/detalle del archivo.
- Acciones de supervisión: bloquear contenido (soft = una copia / hard = todas por hash) y
  eliminar (marcado lógico), con confirmación; generan eventos en audit_log.
- Paginación.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/admin/file-management/{api,hooks,organisms,pages,types,validations}.
  - api/fileManagementApi.ts: listar/buscar/detalle/bloquear/eliminar (mock → apiClient.ts).
  - hooks/useFileManagement.ts: lista, filtros, paginación y acciones. Sin lógica en organismos.
  - organisms/: FileManagementList, FileManagementDetail, FileManagementToolbar (UI pura).
  - pages/page.tsx: compone layout + hook + organismos; exporta `FilesPage`.
  - types/file-management.types.ts: AdminFile, estado, filtros.
  - validations/fileManagementSchema.ts: validación de acciones.
- Con backend real: HTTP vía apiClient.ts; bloquear/eliminar con useRequestDeduper. Acceso
  RBAC. Nada se borra físicamente (marcado lógico). Importa con alias @shared/*.
- Registrar /admin/files en AdminRoutes.tsx y el ítem en el Sidebar admin.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/domain/drive/organisms/DriveItemsGrid o DriveItemsTable para la cuadrícula/lista (getActions para bloquear/
  eliminar/ver) y @shared/domain/drive/molecules/ViewModeToggle; iconos/formatos en driveItemUtils.
- @shared/components/molecules/PageSectionHeader para el encabezado.
- @shared/components/molecules/Pagination, @shared/components/organisms/EntityListStateRenderer y @shared/components/molecules/EmptyStatePanel.
- @shared/components/molecules/ConfirmModal para bloquear/eliminar (reforzado en hard block);
  @shared/components/organisms/VaultSidePanel / @shared/components/molecules/VaultModal para el detalle; @shared/components/atoms/VaultBadge para el estado; toast() para feedback.

ESTILOS
- Solo tokens CSS del tema (var(--danger) para bloqueo/eliminar, var(--warning)).
  Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Buscar/filtrar/paginar todos los archivos, ver detalle/preview, bloquear (soft/hard) y
  eliminar con confirmación funcionan; reutiliza DriveItemsView y los componentes/ tokens
  compartidos; cero color hardcodeado.
```

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Pantalla relacionada: [moderation.md](./moderation.md) (modelo de sanciones)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/drive.md` · `.docs/05-modules/admin/moderation.md`
