# Pantalla User: Configuración (`/settings`)

Preferencias personales de la interfaz y la cuenta del usuario.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/settings` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**Implementada (mock).** `SettingsPage` tiene pestañas **Perfil** y **Preferencias**
más **Cerrar sesión** (con confirmación). Muestra `LoadingStatePanel` mientras
carga. Preferencias en `localStorage` (`vault_user_settings`); tema vía
`document.documentElement.dataset.theme`.

```text
modules/user/settings/
├── api/settingsApi.ts           # persistencia mock + applyTheme
├── organisms/SettingsForm.tsx  # secciones Perfil y Preferencias
├── hooks/useSettings.ts         # expone settings, loading, saveProfile, savePreferences
├── pages/page.tsx               # tabs + cerrar sesión + loading state
├── types/settings.types.ts      # UserSettings, opciones de tema/idioma/zona
└── validations/settingsSchema.ts
```

---

## Funcionalidad objetivo

(Basado en `.docs/05-modules/user/settings.md`.)

- **Perfil:** nombre, apellido, avatar.
- **Seguridad:** cambio de contraseña, 2FA (futuro).
- **Preferencias UI:** tema (`SYSTEM`/`LIGHT`/`DARK`), idioma y zona horaria.

### Idiomas soportados (v1)

| Código | Idioma |
|---|---|
| `es-419` | Español Latinoamericano |
| `en` | Inglés |
| `fr` | Francés |

La zona horaria usa identificadores IANA (ej. `America/Mexico_City`).

---

## Contrato backend objetivo

Endpoints granulares en `svc-auth` (requieren JWT):

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/settings` | Configuración actual (upsert si no existe) |
| `PATCH` | `/settings/theme` | Actualiza tema |
| `PATCH` | `/settings/locale` | Actualiza idioma |
| `PATCH` | `/settings/timezone` | Actualiza zona horaria |

Tabla: `user_settings` (1:1 con `users`).

> El frontend lee `GET /settings` al iniciar y configura los contextos de React
> (`ThemeContext`, `LocaleContext`) que heredan los microfrontends de editores.

---

## Guía de construcción

1. Tipos en `types/settings.types.ts` (`UserSettings`, enums de tema/locale).
2. `settingsApi.ts` con `apiClient.ts`; cada `PATCH` granular como mutación con `useRequestDeduper`.
3. `useSettings` carga la configuración y expone updaters por sección.
4. `SettingsForm` agrupa secciones (perfil, seguridad, preferencias) con
   `validations/settingsSchema.ts`; usar `Switch`, `Select` de `@shared/components/atoms`.

---

## Prompt para IA

> Prompt listo para construir/refinar esta pantalla con un asistente de IA. Basado
> en el diseño **VAULT** (Figma) y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Configuración" (/settings) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `user`, dentro de UserLayout. Preferencias en localStorage (vault_user_settings);
  el tema se aplica vía document.documentElement.dataset.theme.

DISEÑO (VAULT, copys reales del Figma)
- Pantalla con PESTAÑAS:
  - "Perfil": "Nombre", "Apellido paterno", "Apellido materno", "Correo electrónico"
    (con validación, "Email inválido") + botón "Guardar cambios".
  - "Preferencias": idioma (es-419, en, fr), tema (SYSTEM/LIGHT/DARK) y zona horaria (IANA)
    + botón "Guardar preferencias" (toast "Configuración actualizada").
- Al pie/cabecera: botón "Cerrar sesión" con confirmación.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/user/settings/{api,hooks,organisms,pages,types,validations}.
  - api/settingsApi.ts: persistencia mock + applyTheme; misma firma para apiClient.ts.
  - hooks/useSettings.ts: carga la config y expone updaters por sección. Sin lógica en organismos.
  - organisms/SettingsForm.tsx: secciones Perfil y Preferencias (UI pura).
  - pages/page.tsx: tabs + "Cerrar sesión"; exporta `SettingsPage`.
  - types/settings.types.ts: UserSettings (perfil: firstName, lastName, motherLastName,
    email) + enums de tema/idioma/zona.
  - validations/settingsSchema.ts: validateProfile (nombre/apellidos requeridos, email válido).
- Con backend real: HTTP vía apiClient.ts; cada PATCH granular (theme/locale/timezone)
  como mutación con useRequestDeduper. Cerrar sesión usa AuthContext (logout).
- Importa con alias @shared/* y @context/AuthContext.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/atoms: InputText, Select, Switch (para preferencias), ActionButton.
- @shared/components/templates/VaultViewPageLayout para el layout de página.
- @shared/components/molecules/LoadingStatePanel mientras `useSettings().loading`.
- @shared/components/atoms/VaultCard para tabs y formularios.
- @shared/components/molecules/ConfirmModal para confirmar "Cerrar sesión".
- @shared/components/molecules/AuthFormError (o patrón equivalente) para errores de validación.
- toast() de @shared/components/organisms/Toast para confirmar guardado.

ESTILOS
- Solo tokens CSS del tema. El cambio de tema debe reflejarse en dataset.theme. Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Las pestañas Perfil/Preferencias funcionan, el perfil valida antes de guardar, el tema
  se aplica al instante, y "Cerrar sesión" pide confirmación; reutiliza los inputs compartidos.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/settings.md`
