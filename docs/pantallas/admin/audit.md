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

## Guía de construcción

1. Crear `pages/page.tsx` exportando `AuditPage`.
2. Registrar la ruta en `AdminRoutes.tsx` (`<Route path="audit" element={<AuditPage />} />`).
3. Agregar el enlace en el `Sidebar` del panel admin.
4. Tipos en `types/audit.types.ts` (`AuditEvent`, filtros, paginación).
5. `auditApi.ts` solo lectura (`GET`); `useAudit` maneja filtros + paginación.
6. Componentes:
   - `AuditList` → tabla con filtros (acción, usuario, fechas).
   - `AuditDetail` → diff `oldData`/`newData`, IP y user-agent.
   - `AuditForm` → panel de filtros avanzados (no escribe en `audit_log`).

---

## Referencias

- Flujo admin: [../../flujos/admin/flujo-administracion.md](../../flujos/admin/flujo-administracion.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/admin/audit-log.md`
