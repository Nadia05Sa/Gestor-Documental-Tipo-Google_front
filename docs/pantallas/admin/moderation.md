# Pantalla Admin: Moderación / Reportes (`/admin/reports`)

Permite revisar denuncias de usuarios y tomar acciones contra contenido
malicioso, ilegal o que infrinja los términos de servicio.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/admin/reports` |
| Acceso | `ProtectedRoute allowedRole="admin"` |
| Layout | `AdminLayout` |
| Registro de ruta | `router/AdminRoutes.tsx` |

---

## Estado de implementación

**Placeholder.** Hoy `pages/page.tsx` exporta `ReportsPage`, que solo muestra un
título y el texto "Módulo de reportes en construcción". Existe la estructura de
capas pero **no hay carpeta `organisms/`** ni UI implementada. `useModeration`
devuelve `{}`.

```text
modules/admin/moderation/
├── api/moderationApi.ts
├── hooks/useModeration.ts            # stub: () => ({})
├── pages/page.tsx                    # ← placeholder actual
├── types/moderation.types.ts
└── validations/moderationSchema.ts
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/admin/moderation.md`.)

- **Cola de revisión:** lista de reportes (`GET /admin/reports`) ordenada por cantidad de quejas.
- **Detalle del reporte:** ver el contenido denunciado, la razón y el historial.
- **Resolución:** aplicar sanción y registrar notas del administrador.

### Niveles de sanción

| Nivel | Efecto | Uso |
|---|---|---|
| **Bloqueo individual** (soft) | `drive_items.is_blocked = true`: el ítem deja de compartirse/abrirse salvo dueño y admins | Violaciones menores |
| **Bloqueo global por hash** (hard) | `file_contents.is_blocked = true`: bloquea **todas** las copias del mismo archivo (deduplicación SHA-256) | Phishing, malware, CSAM |

La decisión y notas se guardan en `drive_moderation_details`.

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/admin/reports` | Cola de reportes ordenada por severidad |
| `POST` | `/admin/reports/:id/resolve` | Resolver reporte (soft/hard block) |

Tablas: `item_abuse_reports`, `report_reasons`, `drive_items`, `file_contents`,
`drive_moderation_details`.

> Las acciones de moderación generan eventos `ITEM_BLOCKED` y
> `GLOBAL_HASH_BLOCKED` en `audit_log`.

---

## Guía de construcción

1. Tipos en `types/moderation.types.ts` (`AbuseReport`, `ResolutionAction`, razones).
2. `moderationApi.ts` con `apiClient.ts`; resolución como mutación con `useRequestDeduper`.
3. `useModeration` orquesta cola, filtros, selección y resolución.
4. Componentes:
   - `ModerationList` → cola priorizada.
   - `ModerationDetail` → contenido reportado + contexto.
   - `ModerationForm` → selección de sanción (soft/hard) + notas, con `moderationSchema.ts`.
5. Mostrar confirmación clara en el bloqueo global por hash (impacto masivo).

---

## Prompt para IA

> **Nota de diseño:** esta pantalla **no aparece** en el Figma VAULT proporcionado
> (el área admin del diseño cubre Dashboard, Gestión de Usuarios, Gestión de Archivos y
> Bitácora/Auditoría). Por eso el prompt se basa en la **documentación maestra de backend**
> (`.docs/05-modules/admin/moderation.md`) y aplica las **mismas reglas de arquitectura y
> design system** que el resto de pantallas VAULT. Las acciones de bloqueo de contenido del
> diseño viven en **Gestión de Archivos** (ver [file-management.md](./file-management.md)).

```text
Construye la pantalla "Moderación / Reportes" (/admin/reports) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `admin`, dentro de AdminLayout. Hoy es un placeholder; complétala.
- No hay referencia visual en el Figma: respeta el design system VAULT (tokens, componentes
  Vault*) y la coherencia con las demás pantallas admin.
- Persistencia: mock con misma firma para apiClient.ts.

DISEÑO (derivado de la funcionalidad de backend + design system VAULT)
- Cola de reportes ordenada por nº de quejas/severidad; cada fila: contenido reportado,
  razón, denunciante(s), fecha y severidad (insignia critical/warning).
- Detalle del reporte: vista del ítem denunciado, razón, historial y notas del admin.
- Resolución con dos niveles: "Bloqueo individual" (soft, una copia) y "Bloqueo global por
  hash" (hard, todas las copias por SHA-256) + campo de notas.
- Confirmación reforzada para el bloqueo global por hash (impacto masivo).

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/admin/moderation/{api,hooks,organisms,pages,types,validations}.
  - api/moderationApi.ts: cola + resolución (mock → apiClient.ts).
  - hooks/useModeration.ts: cola, filtros, selección y resolución. Sin lógica en organismos.
  - organisms/: ModerationList, ModerationDetail, ModerationForm (UI pura).
  - pages/page.tsx: compone layout + hook + organismos; exporta `ReportsPage`.
  - types/moderation.types.ts: AbuseReport, ResolutionAction, razones.
  - validations/moderationSchema.ts: validación de la resolución.
- Con backend real: HTTP vía apiClient.ts; resolución con useRequestDeduper. Acceso RBAC.
  Las acciones generan eventos ITEM_BLOCKED / GLOBAL_HASH_BLOCKED en audit_log.
- Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/molecules/PageSectionHeader; tablas compartidas (@shared/components/organisms/EntityListItem,
  EntityListStateRenderer) y @shared/components/molecules/Pagination para la cola.
- @shared/components/atoms/VaultBadge para severidad; @shared/components/organisms/VaultSidePanel / @shared/components/molecules/VaultModal para el detalle.
- @shared/components/molecules/ConfirmModal para confirmar bloqueos (reforzado en hard block).
- @shared/components/atoms (Select de sanción), @shared/components/atoms/Textarea (notas), @shared/components/atoms/ActionButton. toast() para feedback.

ESTILOS
- Solo tokens CSS del tema (var(--danger), var(--warning)). Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Listar/priorizar la cola, ver detalle, resolver con soft/hard block + notas y confirmación
  reforzada en el bloqueo global; reutiliza tablas/badges/modales compartidos y tokens del tema.
```

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Pantalla relacionada (diseño): [file-management.md](./file-management.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/moderation.md`
