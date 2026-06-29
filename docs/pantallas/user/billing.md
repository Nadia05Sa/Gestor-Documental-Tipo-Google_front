# Pantalla User: Facturación (`/billing`)

Vista donde el usuario consulta su plan, almacenamiento, método de pago e
historial de cobros. Visible para el rol `user`.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/billing` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `BillingPage` muestra: tarjeta del plan actual con
barra de uso de almacenamiento, método de pago, planes disponibles e historial
de pagos. El almacenamiento usado se calcula a partir de los archivos reales del
Drive (`driveApi.getUsedBytes()`); el resto de datos son un mock que replica el
contrato de `svc-billing`.

```text
modules/user/billing/
├── api/billingApi.ts              # resumen mock + uso real (driveApi.getUsedBytes)
├── components/
│   ├── BillingView.tsx            # plan, uso, métodos de pago, historial
│   └── PaymentMethodModal.tsx
├── hooks/useBilling.ts
├── pages/page.tsx                 # VaultViewPageLayout + BillingView
├── types/billing.types.ts
└── validations/paymentSchema.ts
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/billing.md`.)

- Mostrar el plan actual, su precio y la fecha de renovación.
- Uso de almacenamiento (usado / total del plan).
- Gestión del método de pago (Stripe en backend real).
- Historial de pagos con estado (pagado / pendiente / fallido).
- Upgrade / downgrade entre planes (Free 15 GB → Pro 100 GB → Business 1 TB).

> En backend real, los pagos los procesa **Stripe** y `svc-billing` recibe
> eventos por webhook (`invoice.payment_succeeded` / `invoice.payment_failed`).
> Un cobro fallido marca la suscripción como `PAST_DUE` y el `QuotaGuard`
> bloquea nuevas subidas.

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/billing/subscription` | Plan y estado actual |
| `GET` | `/billing/history` | Historial de pagos |
| `POST` | `/billing/checkout` | Iniciar checkout de Stripe |
| `POST` | `/billing/stripe-webhook` | Webhook de eventos de Stripe |

Tablas: `subscription_plans`, `user_subscriptions`, `user_payment_methods`, `payment_history`.

---

## Guía de construcción

1. Tipos del resumen de facturación en `types/billing.types.ts`.
2. `billingApi.ts` con `apiClient.ts`; el checkout como mutación con `useRequestDeduper`.
3. `useBilling` carga el resumen.
4. `BillingView` compone tarjetas con `SurfacePanel`, `VaultBadge` y `ActionButton`.

---

## Prompt para IA

> Prompt listo para construir/refinar esta pantalla con un asistente de IA. Basado
> en el diseño **VAULT** (Figma) y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Facturación" (/billing) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `user`, dentro de UserLayout. El almacenamiento usado se calcula de archivos reales
  del Drive (driveApi.getUsedBytes()); el resto (plan, método, historial) es mock que replica
  el contrato de svc-billing.

DISEÑO (VAULT, copys reales del Figma) — sección "Plan y facturación"
- Tarjeta "Plan actual": nombre del plan, precio e insignia "Actual"; botón "Cambiar plan"
  que abre confirmación ("Confirmar cambio de plan" / "Confirmar cambio").
- Tarjeta de almacenamiento: "Almacenamiento Usado", "Espacio Disponible", barra de
  progreso con "% Uso" y textos "X GB usados" / "X GB de Y GB" (ej. "58% libre").
- Sección "Planes disponibles": 3 tarjetas (Free 15 GB → Pro 100 GB → Business 1 TB) con
  lista de features (check), insignia "Actual" y botón "Cambiar plan"/"Plan actual".
- Métodos de pago (CRUD completo, no solo lectura):
  - Lista de tarjetas (marca + ••••last4 + "Expira MM/AA") con la predeterminada marcada.
  - Botón "Agregar método de pago" → modal con "Número de tarjeta", "Nombre en la tarjeta",
    "Fecha de expiración" (placeholder "MM / AA"), "Establecer como método predeterminado"
    y botón "Guardar tarjeta".
  - Acciones: eliminar (confirmación "¿Estás seguro de que quieres eliminar este método de
    pago?") y marcar predeterminado. Reglas: "No puedes eliminar el método de pago
    predeterminado". Toasts: "Método de pago agregado exitosamente", "Método de pago
    eliminado", "Método de pago predeterminado actualizado".
- Sección "Historial de pagos": tabla (Fecha, Concepto, Importe, Estado) con estado
  coloreado pagado / pendiente ("Pago pendiente") / en proceso ("En proceso") / fallido.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/user/billing/{api,hooks,components,pages,types}.
  - api/billingApi.ts: resumen mock (plan, método, historial) + uso real; misma firma para apiClient.ts.
  - hooks/useBilling.ts: carga el resumen. Sin lógica en componentes.
  - components/BillingView.tsx (UI pura que recibe `summary`) + un modal de alta de
    tarjeta (p. ej. PaymentMethodModal) con su validación en validations/.
  - pages/page.tsx: compone hook + componentes; exporta `BillingPage`.
  - types/billing.types.ts: BillingPlan, PaymentRecord, PaymentMethod, PaymentStatus, BillingSummary.
- Con backend real: HTTP vía apiClient.ts; el checkout como mutación con useRequestDeduper
  (los pagos los procesa Stripe; svc-billing recibe webhooks).
- Importa con alias @shared/*.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/layout/SurfacePanel para todas las tarjetas (prop padding, className).
- @shared/components/inputs/ActionButton para los botones (variant primary/secondary, size, fullWidth).
- @shared/components/VaultBadge (tone primary/success) para "Actual".
- @shared/components/VaultModal para el alta de método de pago; inputs desde
  @shared/components/inputs (InputText para número/nombre/expiración, Switch/Checkbox para
  "predeterminado").
- @shared/components/ConfirmModal para eliminar método de pago y confirmar cambio de plan.
- Formatos desde @shared/components/drive/driveItemUtils (formatBytes, formatDate).
- toast() de @shared/components/Toast para feedback (alta/baja/predeterminado).

ESTILOS
- Solo tokens CSS del tema: var(--text-primary), var(--text-secondary), var(--accent),
  var(--accent-subtle), var(--success-600), var(--warning-600), var(--danger-600),
  var(--bg-surface), var(--border-subtle). Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Muestra plan, uso real de almacenamiento (barra + %), 3 planes con insignia "Actual" e
  historial con estados coloreados.
- Métodos de pago: agregar (modal con validación), eliminar (con confirmación y bloqueo del
  predeterminado) y marcar predeterminado, con sus toasts.
- Cambio de plan pide confirmación. Reutiliza SurfacePanel/ActionButton/VaultBadge/VaultModal/ConfirmModal.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/billing.md`
