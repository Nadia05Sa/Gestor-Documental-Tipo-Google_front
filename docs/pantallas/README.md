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

### Admin (`/admin`)

| Pantalla | Ruta | Estado | Documento |
|---|---|---|---|
| Gestión de usuarios | `/admin/users` | Placeholder | [admin/user-management.md](./admin/user-management.md) |
| Moderación / Reportes | `/admin/reports` | Placeholder | [admin/moderation.md](./admin/moderation.md) |
| Auditoría | (sin ruta aún) | Estructura preparada | [admin/audit.md](./admin/audit.md) |

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

1. Crear `modules/[rol]/[feature]/` con la estructura estándar (`api`, `hooks`,
   `components`, `pages`, `types`, `validations`).
2. Exportar la página desde `pages/page.tsx`.
3. Registrar la ruta en el router (`AuthRoutes`, `AppRoutes` o `AdminRoutes`).
4. Documentar la pantalla en `docs/pantallas/[rol]/[feature].md` usando la
   plantilla de arriba.
5. Si la pantalla introduce un flujo nuevo, documentarlo en `docs/flujos/`.
