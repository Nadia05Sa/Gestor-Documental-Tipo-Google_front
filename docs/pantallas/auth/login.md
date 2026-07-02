# Pantalla: Inicio de sesión (`/login`)

Permite que un usuario existente acceda a su área según su rol (`user` o `admin`).

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/login` |
| Acceso | Solo invitado (`ProtectedRoute guestOnly`) |
| Layout | `AuthLayout` |
| Registro de ruta | `router/AuthRoutes.tsx` |

Si ya hay sesión activa, el guard redirige al home del rol (`getHomePathByRole`).

---

## Estado de implementación

**Implementada** (mock con `localStorage`, sin backend real).

---

## Diseño y secciones

Pantalla **split-screen** en escritorio:

| Panel izquierdo | Panel derecho |
|---|---|
| Formulario de login | Panel promocional con gradiente |
| Logo, email, contraseña | 3 tarjetas de características |
| Recordarme, olvidé contraseña | Solo visible en `lg+` |
| Botón gradiente + Google | |

En móvil solo se muestra el formulario.

---

## Archivos involucrados

```text
modules/auth/login/
├── pages/page.tsx                    # Estado del formulario; AuthSplitTemplate
├── hooks/useLogin.ts                 # Lógica de submit y redirección
├── api/loginApi.ts                   # Credenciales mock y utilidades de sesión
├── types/login.types.ts              # Tipos y textos del panel promo (LOGIN_PROMO)
├── validations/loginSchema.ts
└── organisms/
    ├── LoginForm.tsx                 # UI del formulario
    └── LoginPromoPanel.tsx           # Panel derecho promocional

modules/auth/layout/AuthLayout.tsx
shared/components/templates/AuthSplitTemplate.tsx
```

Componentes compartidos: `InputText`, `Checkbox`, `AuthGradientButton`,
`AuthFormError`, `GoogleIcon`, `InfinityVaultLogo` (en `@shared/components/molecules/` y `@shared/components/atoms/`).

---

## Flujo de inicio de sesión (mock)

```
1. Usuario envía email + contraseña
2. useLogin → AuthContext.login()
3. loginApi.findAccount() busca en:
   - HARDCODED_USERS (loginApi.ts)
   - vault_registered_users (localStorage)
4. Si la contraseña coincide:
   - Guarda sesión en localStorage (vault_auth_user)
   - Redirige según rol: admin → /admin/users · user → /drive
5. Si falla → muestra error
```

### Credenciales de prueba

| Rol | Correo | Contraseña | Destino |
|---|---|---|---|
| Usuario | `usuario@gmail.com` | `User123` | `/drive` |
| Admin | `admin@gmail.com` | `Admin123` | `/admin/users` |

---

## Contrato backend objetivo

Cuando exista API real, esta pantalla consumirá `svc-auth`
(ver `.docs/05-modules/system/auth.md`):

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Login local (email + password) |
| `POST` | `/auth/refresh` | Renovar access token (cookie `HttpOnly`) |
| `GET` | `/auth/google` | OAuth Google (Token Exchange) |

> Para roles administrativos, el backend devuelve el payload de privilegios
> cifrado (AES-256-GCM). Ver sección RBAC en `.docs/05-modules/system/auth.md`.

---

## Guía de construcción / migración a API

1. Reemplazar `loginApi.findAccount()` por una llamada vía `apiClient.ts`.
2. Mover la persistencia de sesión a cookies `HttpOnly` + refresh token.
3. Implementar el botón Google con el flujo OAuth real (`/auth/google`).
4. Mantener `useLogin` como única fuente de la lógica de submit/redirección.

---

## Referencias

- Flujo completo: [../../flujos/auth/flujo-autenticacion.md](../../flujos/auth/flujo-autenticacion.md)
- Backend Auth: `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`
