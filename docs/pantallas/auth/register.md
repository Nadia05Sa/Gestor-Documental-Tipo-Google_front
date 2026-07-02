# Pantalla: Registro (`/register`)

Crea una cuenta nueva de tipo `user`. Tras el registro exitoso, el usuario puede
iniciar sesión con sus credenciales.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/register` |
| Acceso | Solo invitado (`ProtectedRoute guestOnly`) |
| Layout | `AuthLayout` |
| Registro de ruta | `router/AuthRoutes.tsx` |

---

## Estado de implementación

**Implementada** (mock con `localStorage`, sin backend real).

---

## Diseño y secciones

Pantalla **centrada** con tarjeta blanca sobre fondo con gradiente suave:

- Logo y título "Crear cuenta en **VAULT**".
- Formulario en grid 2 columnas (nombre / apellido, contraseña / confirmar).
- Checkbox de términos y condiciones.
- Botón "Registrarse" con gradiente.
- Enlace a "Inicia sesión".
- Pantalla de éxito (`RegisterSuccess`) con icono y botón hacia el login.

---

## Archivos involucrados

```text
modules/auth/register/
├── pages/page.tsx                    # Estado y validación; RegisterTemplate
├── hooks/useRegister.ts              # Llamada a AuthContext.register()
├── api/registerApi.ts                # Persistencia en localStorage
├── validations/registerSchema.ts     # Reglas de validación
├── types/register.types.ts           # Tipos del formulario
└── organisms/
    ├── RegisterForm.tsx              # Formulario completo
    └── RegisterSuccess.tsx           # Pantalla post-registro

shared/components/templates/RegisterTemplate.tsx
```

---

## Campos y validación

| Campo | Obligatorio | Validación |
|---|---|---|
| Nombre(s) | Sí | No vacío |
| Apellido paterno | Sí | No vacío |
| Correo electrónico | Sí | No vacío; no duplicado |
| Contraseña | Sí | Mín. 8, una mayúscula, un carácter especial |
| Confirmar contraseña | Sí | Debe coincidir |
| Términos y condiciones | Sí | Checkbox marcado |

Funciones clave en `registerSchema.ts`: `evaluatePasswordRequirements`,
`arePasswordRequirementsMet`, `validateRegisterForm`. Los requisitos se muestran
en vivo con `PasswordRequirementsChecklist`.

---

## Flujo de registro (mock)

```
1. Usuario completa el formulario
2. validateRegisterForm() valida en cliente
3. useRegister → AuthContext.register()
4. Si el email ya existe → error en campo email
5. Si es válido:
   - Guarda cuenta en localStorage (vault_registered_users)
   - Muestra pantalla "Cuenta creada"
6. "Ir a iniciar sesión" → /login
```

---

## Contrato backend objetivo

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de usuario nuevo |

> En producción, las contraseñas se hashean (`bcrypt`/`argon2`) en `svc-auth` y
> nunca se almacenan en el cliente. Ver `.docs/05-modules/system/auth.md`.

---

## Guía de construcción / migración a API

1. Sustituir `registerApi` por `apiClient.post('/auth/register', ...)`.
2. Considerar verificación de email (pantalla + hook dedicado).
3. Migrar validaciones manuales a Zod manteniendo las mismas reglas.

---

## Referencias

- Flujo completo: [../../flujos/auth/flujo-autenticacion.md](../../flujos/auth/flujo-autenticacion.md)
- Backend Auth: `Gestor-Documental-Tipo-Google/.docs/05-modules/system/auth.md`
