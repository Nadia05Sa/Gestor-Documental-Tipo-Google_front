# Pantalla: Landing (`/`)

Página pública de presentación de **Infinity Vault**. Es la puerta de entrada:
presenta el producto y dirige al usuario hacia el registro o el inicio de sesión.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/` |
| Acceso | Público (sin guard) |
| Layout | Propio (no usa `AuthLayout`); renderiza `AuthTopBar` fijo |
| Registro de ruta | `router/AuthRoutes.tsx` → `<Route path="/" element={<Landing />} />` |

---

## Estado de implementación

**Implementada** con UI completa (modo mock, sin backend).

---

## Diseño y secciones

La landing se compone de la barra superior más 5 secciones:

1. **AuthTopBar** — Logo, navegación por anclas (`#funciones`, `#cta`) y botón "Iniciar sesión".
2. **Hero** — Título, descripción, CTAs e imagen con badge AES-256.
3. **Funciones** (`#funciones`) — Grid de 6 tarjetas con iconos.
4. **Beneficios** — Lista con checks + estadísticas en grid.
5. **CTA** (`#cta`) — Banner con gradiente y botón "Comenzar ahora".
6. **Footer** — Copyright y enlaces legales.

---

## Archivos involucrados

```text
modules/auth/landing/
├── pages/page.tsx                    # Orquestador; compone LandingTemplate
├── hooks/useLanding.ts               # Navegación a login/registro
├── api/landingApi.ts
├── types/landing.types.ts            # Textos, stats e iconos por sección
├── validations/landingSchema.ts
├── organisms/
│   ├── LandingHeroSection.tsx
│   ├── LandingFeaturesSection.tsx
│   ├── LandingBenefitsSection.tsx
│   ├── LandingCtaSection.tsx
│   └── LandingFooter.tsx
├── molecules/
│   └── SectionHeading.tsx

shared/components/templates/LandingTemplate.tsx
shared/components/organisms/AuthTopBar.tsx  # Barra fija superior
shared/utils/authTheme.ts             # Tema, gradientes y setupAuthPage()
```

---

## Datos y contenido editable

Todo el copy y las métricas viven en `types/landing.types.ts`:
`LANDING_HERO`, `LANDING_FEATURES`, `LANDING_BENEFITS`, `LANDING_CTA`,
`LANDING_FOOTER_LINKS`. Para cambiar textos sin tocar JSX, editar ese archivo.

---

## Lógica de navegación (`useLanding`)

| Acción | Comportamiento |
|---|---|
| Iniciar sesión | Si hay sesión activa → `/drive` o `/admin/users`; si no → `/login` |
| Comenzar gratis / ahora | Navega a `/register` |
| `pendingAction` | Evita doble clic durante la carga (`isBusy`) |

---

## Guía de construcción / extensión

- Mantener la composición en secciones desacopladas (un componente por sección).
- El contenido siempre desde `types/landing.types.ts` (preparado para i18n futuro).
- La navegación se centraliza en `useLanding`; los componentes solo reciben callbacks.

---

## Referencias

- Flujo completo: [../../flujos/auth/flujo-autenticacion.md](../../flujos/auth/flujo-autenticacion.md)
- Detalle ampliado: [../../AUTH_LANDING_LOGIN_REGISTRO.md](../../AUTH_LANDING_LOGIN_REGISTRO.md)
