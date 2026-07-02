# Documentación de Pantallas — Infinity Vault Frontend

Esta carpeta documenta cada **pantalla** de la SPA: propósito, diseño, estado de
implementación, archivos involucrados y guía para construirla siguiendo el
patrón de módulos del repositorio.

> Convención de arquitectura vigente: cada pantalla vive en
> `gestor_documental/src/modules/[rol]/[feature]/` (sin carpeta intermedia
> `features/`). Ver [../ESTRUCTURA_PROYECTO.md](../ESTRUCTURA_PROYECTO.md).

---

## Índice

### Auth (`/`)

| Pantalla | Ruta | Estado | Documento |
|---|---|---|---|
| Landing | `/` | Implementada | [auth/landing.md](./auth/landing.md) |
| Login | `/login` | Implementada | [auth/login.md](./auth/login.md) |
| Registro | `/register` | Implementada | [auth/register.md](./auth/register.md) |

### User (área autenticada)

| Pantalla | Ruta | Estado | Documento |
|---|---|---|---|
| Mi Drive | `/drive` | Implementada (mock) | [user/drive.md](./user/drive.md) |
| Compartidos conmigo | `/shared` | Implementada (mock) | [user/shared.md](./user/shared.md) |
| Unidades compartidas | `/shared-drives` | Propuesta (carpeta `pages/` vacía) | [user/shared-drives.md](./user/shared-drives.md) |
| Recientes | `/recents` | Implementada (mock) | [user/recents.md](./user/recents.md) |
| Favoritos / Destacados | `/favorites` | Implementada (mock) | [user/favorites.md](./user/favorites.md) |
| Papelera | `/trash` | Implementada (mock) | [user/trash.md](./user/trash.md) |
| Facturación | `/billing` | Implementada (mock) | [user/billing.md](./user/billing.md) |
| Configuración | `/settings` | Implementada (mock) | [user/settings.md](./user/settings.md) |
| Asistente IA | `/assistant` | Propuesta (diseño) | [user/ai-assistant.md](./user/ai-assistant.md) |

### Admin (`/admin`)

| Pantalla | Ruta | Estado | Documento |
|---|---|---|---|
| Panel de Administración | `/admin/dashboard` | Propuesta (diseño) | [admin/dashboard.md](./admin/dashboard.md) |
| Gestión de usuarios | `/admin/users` | Placeholder | [admin/user-management.md](./admin/user-management.md) |
| Gestión de archivos | `/admin/files` | Propuesta (diseño) | [admin/file-management.md](./admin/file-management.md) |
| Bitácora y Auditoría | `/admin/audit` | Preparada (sin `pages/` ni ruta) | [admin/audit.md](./admin/audit.md) |
| Moderación / Reportes | `/admin/reports` | Placeholder | [admin/moderation.md](./admin/moderation.md) |

---

## Plantilla recomendada por pantalla

Cada documento de pantalla sigue esta estructura:

1. **Propósito** — qué resuelve la pantalla para el usuario.
2. **Ruta y acceso** — URL, guard (`guestOnly`, `allowedRole`) y layout.
3. **Estado de implementación** — implementada / placeholder / preparada.
4. **Diseño y secciones** — composición visual.
5. **Archivos involucrados** — árbol del módulo `modules/[rol]/[feature]/`.
6. **Datos y contratos** — tipos, validaciones y, cuando aplique, endpoints de
   la documentación maestra (`.docs/05-modules/`).
7. **Guía de construcción** — pasos para implementar o completar la pantalla.

---

## Cómo agregar una pantalla nueva

1. Crear `modules/[rol]/[feature]/` con las carpetas necesarias (`api`, `hooks`,
   `pages`; `organisms`, `types`, `validations` solo si aportan valor).
2. Para vistas de archivos laterales: reutilizar `useDriveItemCollection`,
   `DriveVaultViewPage` y `DriveVaultList` (ver ESTRUCTURA_PROYECTO §7.1).
3. Exportar la página desde `pages/page.tsx`.
3. Registrar la ruta en el router (`AuthRoutes`, `AppRoutes` o `AdminRoutes`).
4. Documentar la pantalla en `docs/pantallas/[rol]/[feature].md` usando la
   plantilla de arriba.
5. Si la pantalla introduce un flujo nuevo, documentarlo en `docs/flujos/`.
