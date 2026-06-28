# Flujos de Usuario — Infinity Vault Frontend

Esta carpeta documenta los **flujos de navegación y de negocio** de la SPA:
recorridos del usuario entre pantallas, decisiones del router, guards y
redirecciones según el rol.

> Diferencia con `docs/pantallas/`: aquí se documenta el **recorrido** entre
> pantallas; en `pantallas/` se documenta cada pantalla por separado.

---

## Índice

| Flujo | Ámbito | Documento |
|---|---|---|
| Autenticación | Landing → Login / Registro → área por rol | [auth/flujo-autenticacion.md](./auth/flujo-autenticacion.md) |
| Administración | Acceso admin y operaciones de gestión | [admin/flujo-administracion.md](./admin/flujo-administracion.md) |

---

## Roles y home por defecto

| Rol | Home tras login | Rutas |
|---|---|---|
| `user` | `/drive` | `/drive`, `/favorites`, `/recents`, `/trash`, `/settings` |
| `admin` | `/admin/users` | `/admin/users`, `/admin/reports` |

La redirección por rol se resuelve con `getHomePathByRole(role)` en
`modules/auth/login/api/loginApi.ts`.

---

## Guards (`router/ProtectedRoute.tsx`)

| Prop | Uso |
|---|---|
| `guestOnly` | `/login` y `/register` — redirige si ya hay sesión |
| `allowedRole="user"` | Exige sesión + rol user |
| `allowedRole="admin"` | Exige sesión + rol admin |
| (sin props) | Solo exige sesión activa |
