# Documentación — Infinity Vault Frontend

Índice de la documentación del frontend (`gestor_documental/`). Esta carpeta
describe la arquitectura real del repositorio, sus pantallas y sus flujos de
usuario.

> La especificación funcional **completa del producto** (monorepo NX +
> microservicios) vive en `../Gestor-Documental-Tipo-Google/.docs/`. Desde aquí
> se referencia cuando una pantalla necesita contexto del backend.

---

## Mapa de la documentación

| Documento | Contenido |
|---|---|
| [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) | Arquitectura, stack, router, patrón de módulos, abstracciones Drive y convenciones |
| [arquitectura/atomic-design.md](./arquitectura/atomic-design.md) | Atomic Design: átomos → pages, carpetas, imports y anti-patrones |
| [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) | Detalle ampliado del flujo de autenticación (mock) |
| [pantallas/](./pantallas/README.md) | Documentación por pantalla (auth, user y admin) |
| [flujos/](./flujos/README.md) | Flujos de navegación y de negocio (auth, user y admin) |

---

## Estructura de carpetas

```text
docs/
├── README.md                       # Este índice
├── ESTRUCTURA_PROYECTO.md          # Arquitectura del frontend
├── AUTH_LANDING_LOGIN_REGISTRO.md  # Auth en detalle
├── arquitectura/
│   └── atomic-design.md            # Convenciones Atomic Design
├── pantallas/
│   ├── README.md
│   ├── auth/
│   │   ├── landing.md
│   │   ├── login.md
│   │   └── register.md
│   ├── user/
│   │   ├── drive.md
│   │   ├── shared.md
│   │   ├── favorites.md
│   │   ├── recents.md
│   │   ├── trash.md
│   │   ├── billing.md
│   │   ├── settings.md
│   │   ├── shared-drives.md      # Propuesta (sin ruta)
│   │   └── ai-assistant.md       # Propuesta (sin ruta)
│   └── admin/
│       ├── dashboard.md
│       ├── user-management.md
│       ├── file-management.md
│       ├── moderation.md
│       └── audit.md
└── flujos/
    ├── README.md
    ├── auth/
    │   └── flujo-autenticacion.md
    ├── user/
    │   └── flujo-usuario.md
    └── admin/
        └── flujo-administracion.md
```

---

## Convención de arquitectura vigente

Cada pantalla vive en `gestor_documental/src/modules/[rol]/[feature]/`
(**sin** la carpeta intermedia `features/`). Cada feature incluye las carpetas
que necesite (`api/`, `hooks/`, `organisms/`, `pages/`, `types/`, `validations/`).
La UI del feature va en **`organisms/`**; **`pages/`** solo ensambla hooks +
templates + organismos. Ver [arquitectura/atomic-design.md](./arquitectura/atomic-design.md).

Los tipos de ítems del Drive (`DriveItem`, `ViewMode`, etc.) tienen fuente única en
`shared/domain/drive/types/drive.types.ts`. El archivo
`modules/user/drive/types/drive.types.ts` re-exporta por compatibilidad.

---

## Estado de implementación (resumen)

| Módulo | Pantallas | Estado |
|---|---|---|
| auth | landing, login, register | Implementadas (mock); templates `LandingTemplate`, `AuthSplitTemplate`, `RegisterTemplate` |
| user | drive, shared, recents, favorites, trash, billing, settings | Implementadas (mock); vistas laterales vía `useDriveItemCollection` + `DriveVaultViewPage` |
| user | shared-drives, assistant | Propuesta de diseño; `shared-drives/pages/` vacío, sin ruta |
| admin | user-management, moderation | Placeholder en `pages/page.tsx`; hooks vacíos; sin UI en `organisms/` |
| admin | audit | Solo capas `api/`, `hooks/`, `types/`, `validations/`; sin `pages/` ni ruta |
| admin | dashboard, file-management | Propuesta de diseño (sin módulo ni ruta) |

> **Convención vigente:** UI de features en `organisms/`; no existen carpetas `components/` por módulo. Imports shared vía `@shared/components/{atoms,molecules,organisms,templates}/` y drive vía `@shared/domain/drive/`.
