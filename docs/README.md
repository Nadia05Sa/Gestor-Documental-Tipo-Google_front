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
| [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) | Arquitectura, stack, router, patrón de módulos y convenciones |
| [AUTH_LANDING_LOGIN_REGISTRO.md](./AUTH_LANDING_LOGIN_REGISTRO.md) | Detalle ampliado del flujo de autenticación (mock) |
| [pantallas/](./pantallas/README.md) | Documentación por pantalla (auth y admin) |
| [flujos/](./flujos/README.md) | Flujos de navegación y de negocio (auth y admin) |

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
│   └── admin/
│       ├── user-management.md
│       ├── moderation.md
│       └── audit.md
└── flujos/
    ├── README.md
    ├── auth/
    │   └── flujo-autenticacion.md
    └── admin/
        └── flujo-administracion.md
```

---

## Convención de arquitectura vigente

Cada pantalla vive en `gestor_documental/src/modules/[rol]/[feature]/`
(**sin** la carpeta intermedia `features/`, eliminada en la última refactorización).
Cada feature mantiene la estructura estándar: `api/`, `hooks/`, `components/`,
`pages/`, `types/`, `validations/`.

---

## Estado de implementación (resumen)

| Módulo | Pantallas | Estado |
|---|---|---|
| auth | landing, login, register | Implementadas (mock) |
| user | drive, favorites, recents, trash, settings | Estructura base |
| admin | user-management, moderation | Placeholder |
| admin | audit | Estructura preparada (sin ruta) |
