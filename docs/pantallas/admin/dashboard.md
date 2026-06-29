# Pantalla Admin: Panel de Administración (`/admin/dashboard`)

Vista de inicio del panel admin con las métricas globales de la plataforma:
usuarios, archivos y capacidad de almacenamiento. Es la primera pantalla del
área `admin` en el diseño VAULT ("Panel de Administración").

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/admin/dashboard` (candidata a ser el index de `/admin`) |
| Acceso | `ProtectedRoute allowedRole="admin"` |
| Layout | `AdminLayout` |
| Registro de ruta | `router/AdminRoutes.tsx` |

> Hoy `/admin` redirige a `/admin/users`. En el diseño VAULT el sidebar admin
> abre con **Dashboard**; al implementarlo, valora moverlo a index de `/admin`.

---

## Estado de implementación

**No implementada (propuesta de diseño).** No existe el módulo
`modules/admin/dashboard/`. Esta ficha documenta el diseño VAULT y el prompt.

```text
modules/admin/dashboard/      (propuesto)
├── api/dashboardApi.ts        # métricas agregadas (mock → apiClient.ts)
├── components/
│   ├── DashboardMetrics.tsx   # cuadrícula de tarjetas de métrica
│   └── MetricCard.tsx         # tarjeta individual (label, valor, subtítulo)
├── hooks/useDashboard.ts      # carga de métricas
├── pages/page.tsx             # exporta DashboardPage
└── types/dashboard.types.ts   # DashboardMetrics, Metric
```

---

## Funcionalidad objetivo

(Basado en el diseño VAULT "Panel de Administración" y en
`.docs/05-modules/admin/dashboard.md`.)

- **Encabezado:** título "Panel de Administración" e insignia de rol "Panel Administrador".
- **Tarjetas de métrica** (cuadrícula): "Total de Usuarios", "Usuarios Activos Hoy"
  (sub "de uso activo"), "Archivos en el Sistema", "Promedio por Usuario".
- **Capacidad de almacenamiento:** "Capacidad Total" (ej. "10 TB", sub "Infraestructura
  actual"), "Espacio Disponible" (ej. "5.8 TB", sub "58% libre") y "Almacenamiento Usado"
  con barra de progreso.
- Solo lectura (panel informativo). Punto de entrada a las demás secciones admin.

---

## Contrato backend objetivo (propuesto)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/admin/dashboard/metrics` | Métricas agregadas de la plataforma |

> Privilegio RBAC de lectura administrativa. Las métricas son agregados (no exponen datos
> de usuarios individuales).

---

## Guía de construcción

1. Tipos en `types/dashboard.types.ts` (`Metric { label, value, sub?, tone? }`, `DashboardMetrics`).
2. `dashboardApi.ts` solo lectura (`GET`) con `apiClient.ts`.
3. `useDashboard` carga las métricas.
4. `DashboardMetrics` + `MetricCard` componen la cuadrícula con `SurfacePanel`.
5. Registrar la ruta en `AdminRoutes.tsx` y el ítem "Dashboard" en el `Sidebar` admin.

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "Panel de Administración") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Panel de Administración" (/admin/dashboard) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `admin`, dentro de AdminLayout. La feature es NUEVA: crea modules/admin/dashboard/.
- Solo lectura. Persistencia: mock con misma firma para apiClient.ts.

DISEÑO (VAULT, copys reales del Figma)
- Encabezado "Panel de Administración" con insignia "Panel Administrador".
- Cuadrícula de tarjetas de métrica: "Total de Usuarios", "Usuarios Activos Hoy"
  (sub "de uso activo"), "Archivos en el Sistema", "Promedio por Usuario".
- Bloque de almacenamiento: "Capacidad Total" (ej. "10 TB", sub "Infraestructura actual"),
  "Espacio Disponible" (ej. "5.8 TB", sub "58% libre") y "Almacenamiento Usado" con barra
  de progreso.
- Panel informativo de solo lectura; sirve de entrada al resto del panel admin.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/admin/dashboard/{api,hooks,components,pages,types}.
  - api/dashboardApi.ts: GET de métricas (mock → apiClient.ts).
  - hooks/useDashboard.ts: carga de métricas. Sin lógica en componentes.
  - components/: DashboardMetrics, MetricCard (UI pura).
  - pages/page.tsx: compone hook + componentes; exporta `DashboardPage`.
  - types/dashboard.types.ts: Metric, DashboardMetrics.
- Registrar /admin/dashboard en AdminRoutes.tsx y el ítem "Dashboard" en el Sidebar admin.
  Acceso RBAC de lectura administrativa. Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/layout/SurfacePanel para cada tarjeta de métrica.
- @shared/components/layout/PageSectionHeader para el encabezado.
- @shared/components/VaultBadge para "Panel Administrador".
- Formatos desde @shared/components/drive/driveItemUtils (formatBytes) para capacidades.

ESTILOS
- Solo tokens CSS del tema (var(--accent), var(--success), var(--vault-purple) para admin,
  var(--text-primary), var(--text-secondary)). Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Muestra las métricas de usuarios/archivos y el bloque de almacenamiento (capacidad,
  disponible, usado con barra y %), en una cuadrícula responsive; reutiliza SurfacePanel y
  los tokens del tema; cero color hardcodeado.
```

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/dashboard.md`
