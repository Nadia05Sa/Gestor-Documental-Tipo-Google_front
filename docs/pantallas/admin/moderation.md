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
título y el texto "Módulo de reportes en construcción".

```text
modules/admin/moderation/
├── api/moderationApi.ts
├── components/
│   ├── ModerationList.tsx
│   ├── ModerationDetail.tsx
│   └── ModerationForm.tsx
├── hooks/useModeration.ts
├── pages/page.tsx                    # ← placeholder actual
├── types/moderation.types.ts         # ← actualmente `Record<string, never>`
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

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/moderation.md`
