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
que necesite (`api/`, `hooks/`, `components/`, `pages/`, `types/`, `validations/`);
**no** es obligatorio crear `List`, `Detail` o `Form` si la pantalla reutiliza
abstracciones compartidas (ver [ESTRUCTURA_PROYECTO.md §7.1](./ESTRUCTURA_PROYECTO.md)).

Los tipos de ítems del Drive (`DriveItem`, `ViewMode`, etc.) viven en un único
archivo: `modules/user/drive/types/drive.types.ts`. Las vistas laterales
importan desde ahí; no dupliquen archivos `*.types.ts` de re-export.

---

## Estado de implementación (resumen)

| Módulo | Pantallas | Estado |
|---|---|---|
| auth | landing, login, register | Implementadas (mock) |
| user | drive, shared, recents, favorites, trash, billing, settings | Implementadas (mock) |
| user | shared-drives, assistant | Propuesta de diseño (sin ruta) |
| admin | user-management, moderation | Placeholder |
| admin | audit | Estructura preparada (sin ruta) |
| admin | dashboard, file-management | Propuesta de diseño (sin ruta) |
