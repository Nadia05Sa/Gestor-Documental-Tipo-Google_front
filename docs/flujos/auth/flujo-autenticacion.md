# Flujo de Usuario: Autenticación

Recorrido completo desde la entrada pública hasta el área autenticada según el
rol. Cubre landing, registro, login, guards y redirecciones.

---

## Diagrama de navegación

```
                    ┌─────────────┐
                    │   Landing   │  /
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    Comenzar gratis   Iniciar sesión   Nav: #funciones / #cta
           │               │
           ▼               ▼
    ┌────────────┐  ┌────────────┐
    │  Registro  │  │   Login    │
    │ /register  │  │  /login    │
    └──────┬─────┘  └──────┬─────┘
           │ éxito         │ credenciales OK
           └──────► Login ◄┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        /drive (rol: user)      /admin/users (rol: admin)
```

---

## Flujo paso a paso

### 1. Entrada pública (Landing `/`)

- El usuario llega a `/` (pública, sin guard).
- `useLanding` decide:
  - **Iniciar sesión** → si ya hay sesión activa redirige al home del rol; si no, va a `/login`.
  - **Comenzar gratis / ahora** → `/register`.

### 2. Registro (`/register`)

1. El usuario completa el formulario.
2. `validateRegisterForm()` valida en cliente (incl. requisitos de contraseña).
3. `useRegister` → `AuthContext.register()`.
4. Si el email existe → error en campo email.
5. Si es válido → se persiste la cuenta (mock: `vault_registered_users`) y se muestra `RegisterSuccess`.
6. "Ir a iniciar sesión" → `/login`.

### 3. Login (`/login`)

1. El usuario envía email + contraseña.
2. `useLogin` → `AuthContext.login()` → `loginApi.findAccount()`.
3. Si la contraseña coincide → se guarda la sesión (mock: `vault_auth_user`).
4. Redirección por rol con `getHomePathByRole`:
   - `admin` → `/admin/users`
   - `user` → `/drive`
5. Si falla → mensaje de error en pantalla.

### 4. Persistencia y bootstrap de sesión

- `AuthContext` expone `user`, `authLoading`, `login`, `register`, `logout`, `restoreSession`.
- Al iniciar la app, `restoreSession()` lee la sesión de `localStorage`.
- `shouldBlockForAuthBootstrap(pathname)` decide si mostrar loading mientras se
  verifica la sesión (rutas privadas y `/login`, `/register`).

---

## Guards y redirecciones

| Situación | Resultado |
|---|---|
| Visita `/login` o `/register` con sesión activa | Redirige al home del rol (`guestOnly`) |
| Visita ruta `user` sin sesión | Redirige a `/login` |
| Visita ruta `admin` sin rol admin | Redirige (no autorizado) |
| Logout | Limpia sesión y vuelve al área pública |

---

## Estado actual vs. objetivo

| Aspecto | Actual (mock) | Objetivo (backend) |
|---|---|---|
| Credenciales | `HARDCODED_USERS` + `localStorage` | `POST /auth/login` en `svc-auth` |
| Sesión | `vault_auth_user` en `localStorage` | Access token + refresh token (`HttpOnly`) |
| OAuth Google | Solo visual | `GET /auth/google` (Token Exchange) |
| Permisos admin | Por rol simple | Payload RBAC cifrado AES-256-GCM |

> Detalle del backend objetivo en
> `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`.

---

## Pantallas relacionadas

- [Landing](../../pantallas/auth/landing.md)
- [Login](../../pantallas/auth/login.md)
- [Registro](../../pantallas/auth/register.md)
