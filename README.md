# Vault Frontend

Frontend de **Vault** construido con **React**, **TypeScript**, **Vite** y **Tailwind CSS**.

## Resumen

Interfaz del gestor documental: autenticación, exploración de archivos, vistas de detalle y componentes reutilizables organizados con **Atomic Design**.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7

## Estructura del proyecto

La aplicación vive en `gestor_documental/`:

```text
gestor_documental/src/
├── shared/
│   ├── components/
│   │   ├── atoms/           # Botones, inputs, badges…
│   │   ├── molecules/       # Campos compuestos, modales base…
│   │   ├── organisms/       # Sidebar, navbar, listas admin…
│   │   └── templates/       # Layouts con slots (auth, landing, registro…)
│   ├── domain/drive/        # UI del dominio archivos/carpetas (misma jerarquía)
│   ├── pages/               # Pantallas globales (404, loading)
│   ├── hooks/
│   └── utils/
├── modules/
│   └── [rol]/[feature]/
│       ├── api/
│       ├── hooks/
│       ├── molecules/       # Solo si aplica al feature (p. ej. landing)
│       ├── organisms/       # UI del feature
│       ├── pages/page.tsx   # Pantalla: hooks + ensamblaje
│       ├── types/
│       └── validations/
└── router/
```

Documentación detallada: [docs/arquitectura/atomic-design.md](docs/arquitectura/atomic-design.md) y [docs/ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md).

## Configuración

```bash
cd gestor_documental
npm install
```

Variables de entorno: revisar `.env.example` si existe en el paquete frontend.

## Desarrollo

```bash
cd gestor_documental
npm run dev
```

## Build

```bash
cd gestor_documental
npm run build
```

Ejecuta comprobación TypeScript (`tsc -b`) y genera el bundle en `dist/`.

## Buenas prácticas

- Respetar la jerarquía **átomos → moléculas → organismos → templates → pages**.
- Pages delgadas: estado y API en `hooks/`; layout en `templates/`.
- Tipos drive desde `@shared/domain/drive`.
- No crear carpetas legacy `components/` por feature (usar `organisms/`).

## Documentación

- [docs/README.md](docs/README.md) — índice de documentación
- [docs/pantallas/](docs/pantallas/) — especificación por pantalla
- [docs/AUTH_LANDING_LOGIN_REGISTRO.md](docs/AUTH_LANDING_LOGIN_REGISTRO.md) — flujo de autenticación
