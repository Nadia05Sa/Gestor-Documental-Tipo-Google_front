# Pantalla Admin: Auditoría (sin ruta aún)

Visor del log de auditoría: herramienta de seguridad y cumplimiento para
monitorear quién hizo qué y cuándo en la plataforma.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | **Pendiente** (no registrada en `AdminRoutes.tsx`) |
| Acceso | `ProtectedRoute allowedRole="admin"` (cuando se cree la ruta) |
| Layout | `AdminLayout` |

Ruta sugerida: `/admin/audit`.

---

## Estado de implementación

**Estructura preparada.** El módulo existe pero **no tiene carpeta `pages/`** ni
ruta registrada. Es el módulo admin menos avanzado.

```text
modules/admin/audit/
├── api/auditApi.ts
├── components/
│   ├── AuditList.tsx
│   ├── AuditDetail.tsx
│   └── AuditForm.tsx
├── hooks/useAudit.ts
├── types/audit.types.ts
└── validations/auditSchema.ts
        (falta) pages/page.tsx
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/admin/audit-log.md`.)

- **Búsqueda histórica:** filtrar por `user_id`, `action`, `resource_type` y rango de fechas.
- **Rastreo de IPs:** registro de `ip_address` por evento.
- **Detalle del evento:** ver `oldData` / `newData` capturados por la extensión de Prisma.

### Eventos auditables clave

`USER_LOGIN_SUCCESS` · `USER_LOGIN_FAILED` · `PASSWORD_RESET` ·
`USER_BANNED` / `USER_UNBANNED` · `ROLE_CHANGED` ·
`PLAN_SUBSCRIBED` / `PLAN_CANCELED` · `ITEM_BLOCKED` · `GLOBAL_HASH_BLOCKED`.

> `FILE_PREVIEWED` **no** se audita (demasiado ruido); para eso se usa `item_recents`.

Tabla principal: `audit_log` (la que más crece del sistema; solo lectura desde la UI).

---

## Diseño (VAULT, copys reales del Figma)

- Encabezado "Bitácora y Auditoría" con acciones: **exportar** (toasts "Exportando
  bitácora..." → "Bitácora exportada correctamente") y **recargar** ("Recargando bitácora...").
- Panel de filtros: rango de fechas ("Fecha desde" / "Fecha hasta"), rol
  (Administrador / Usuario), resultado (Éxito / **"Fallido"**) y búsqueda.
- Tabla de eventos: acción ("Inició sesión", "Cambió permisos", "Cambio estado",
  "Descargó"), recurso (ej. "Reporte-ventas.xlsx"), usuario, tiempo relativo ("hace 1.5 h")
  e insignia de **severidad** (critical rojo / warning ámbar) y de resultado (Fallido rojo /
  éxito verde / neutro).
- Detalle del evento: `ipAddress`, `userAgent` (ej. "Chrome · Windows"), `recordId`,
  `source`, `tableName`, `transactionId`, diff `oldData`/`newData`, con botón **"Copiar JSON
  completo"** (toast "Copiado al portapapeles").
- Paginación. Solo lectura: la UI nunca escribe en `audit_log`.

---

## Guía de construcción

1. Crear `pages/page.tsx` exportando `AuditPage`.
2. Registrar la ruta en `AdminRoutes.tsx` (`<Route path="audit" element={<AuditPage />} />`).
3. Agregar el enlace en el `Sidebar` del panel admin.
4. Tipos en `types/audit.types.ts` (`AuditEvent`, severidad, filtros, paginación).
5. `auditApi.ts` solo lectura (`GET`) + exportación; `useAudit` maneja filtros + paginación.
6. Componentes:
   - `AuditList` → tabla con filtros (acción, usuario, rol, resultado, fechas) y severidad.
   - `AuditDetail` → diff `oldData`/`newData`, IP, user-agent y "Copiar JSON completo".
   - `AuditForm` → panel de filtros avanzados (no escribe en `audit_log`).

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "Bitácora y Auditoría") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Bitácora y Auditoría" (/admin/audit) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `admin`, dentro de AdminLayout. El módulo existe pero falta pages/ y la ruta; complétalo.
- Solo lectura del audit_log. Persistencia: mock con misma firma para apiClient.ts.

DISEÑO (VAULT, copys reales del Figma)
- Encabezado "Bitácora y Auditoría" con botones exportar (toasts "Exportando bitácora..." →
  "Bitácora exportada correctamente") y recargar ("Recargando bitácora...").
- Filtros: "Fecha desde"/"Fecha hasta", rol (Administrador/Usuario), resultado (Éxito/"Fallido")
  y búsqueda.
- Tabla de eventos: acción ("Inició sesión", "Cambió permisos", "Cambio estado", "Descargó"),
  recurso, usuario, tiempo relativo ("hace 1.5 h"), insignia de severidad (critical rojo /
  warning ámbar) y de resultado (Fallido rojo / éxito verde / neutro).
- Detalle: ipAddress, userAgent ("Chrome · Windows"), recordId, source, tableName,
  transactionId, diff oldData/newData, botón "Copiar JSON completo" (toast "Copiado al
  portapapeles").
- Paginación. La UI NUNCA escribe en audit_log.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/admin/audit/{api,hooks,components,pages,types,validations}.
  - api/auditApi.ts: GET de eventos + exportación (mock → apiClient.ts). Sin mutaciones de escritura.
  - hooks/useAudit.ts: filtros, paginación y selección de detalle. Sin lógica en componentes.
  - components/: AuditList, AuditDetail, AuditForm (filtros) — UI pura.
  - pages/page.tsx: compone layout + hook + componentes; exporta `AuditPage`.
  - types/audit.types.ts: AuditEvent, AuditSeverity, filtros.
- Registrar /admin/audit en AdminRoutes.tsx y el ítem en el Sidebar admin.
- Acceso RBAC (privilegio de auditoría/EXPORT). Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/layout/PageSectionHeader para encabezado + acciones exportar/recargar.
- @shared/components/tables (EntityListItem, EntityListStateRenderer, Pagination).
- @shared/components/inputs (Select rol/resultado, InputText búsqueda, ActionButton, fechas).
- @shared/components/VaultBadge para severidad/resultado; @shared/components/VaultSidePanel o
  VaultModal para el detalle del evento; toast() para exportar/copiar.

ESTILOS
- Solo tokens CSS del tema (var(--danger) critical/fallido, var(--warning), var(--success)).
  Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Filtrar por fechas/rol/resultado/búsqueda, paginar, ver detalle con diff y copiar JSON,
  exportar y recargar funcionan; severidad/resultado con insignias; solo lectura.
- Reutiliza tablas/inputs/badges/paneles compartidos y los tokens del tema.
```

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/audit-log.md`
