# Landing, inicio de sesión y registro

Documentación de las tres pantallas públicas de **Infinity Vault** y cómo se conectan entre sí.

---

## Resumen rápido

| Pantalla | Ruta | Archivo principal |
|----------|------|-------------------|
| Landing | `/` | `modules/auth/landing/pages/page.tsx` |
| Login | `/login` | `modules/auth/login/pages/page.tsx` |
| Registro | `/register` | `modules/auth/register/pages/page.tsx` |

> **Nota:** La ruta de registro es `/register` (no `/registro`).

---

## Diagrama de navegación

```
                    ┌─────────────┐
                    │   Landing   │  /
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    Comenzar gratis   Iniciar sesión   Nav: #funciones
           │               │               #cta
           ▼               ▼
    ┌────────────┐  ┌────────────┐
    │  Registro  │  │   Login    │
    │ /register  │  │  /login    │
    └──────┬─────┘  └──────┬─────┘
           │               │
           │  éxito        │ credenciales OK
           └──────► Login ◄┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        /drive (rol: user)      /admin/users (rol: admin)
```

---

## 1. Landing (`/`)

### Propósito

Página de presentación del producto. Muestra las ventajas de Infinity Vault y guía al usuario hacia el registro o el inicio de sesión.

### Estructura visual

La landing se compone de **5 secciones** más la barra superior:

1. **AuthTopBar** — Logo, navegación por anclas y botón "Iniciar sesión"
2. **Hero** — Título principal, descripción, CTAs e imagen con badge AES-256
3. **Funciones** (`#funciones`) — Grid de 6 tarjetas con iconos
4. **Beneficios** — Lista con checks + estadísticas en grid
5. **CTA** (`#cta`) — Banner con gradiente y botón "Comenzar ahora"
6. **Footer** — Copyright y enlaces legales

### Archivos involucrados

```text
modules/auth/landing/
├── pages/page.tsx                    # Orquestador; usa LandingTemplate
├── hooks/useLanding.ts               # Navegación a login/registro
├── types/landing.types.ts            # Textos, stats e iconos de cada sección
├── organisms/
│   ├── LandingHeroSection.tsx
│   ├── LandingFeaturesSection.tsx
│   ├── LandingBenefitsSection.tsx
│   ├── LandingCtaSection.tsx
│   └── LandingFooter.tsx
├── molecules/
│   └── SectionHeading.tsx

shared/components/templates/LandingTemplate.tsx
shared/components/organisms/AuthTopBar.tsx   # Barra fija superior
shared/utils/authTheme.ts             # Tema, gradientes y setupAuthPage()
```

### Lógica de navegación (`useLanding`)

| Acción | Comportamiento |
|--------|----------------|
| **Iniciar sesión** | Si hay sesión activa (en memoria o `localStorage`) → redirige a `/drive` o `/admin/users`. Si no → va a `/login` |
| **Comenzar gratis / Comenzar ahora** | Navega a `/register` |
| **Estado `pendingAction`** | Evita doble clic mientras carga (`isBusy`, `isLoginLoading`, `isRegisterLoading`) |

### Contenido editable

Los textos, estadísticas y tarjetas de funciones viven en:

`gestor_documental/src/modules/auth/landing/types/landing.types.ts`

Constantes exportadas: `LANDING_HERO`, `LANDING_FEATURES`, `LANDING_BENEFITS`, `LANDING_CTA`, `LANDING_FOOTER_LINKS`.

Para cambiar copy o métricas sin tocar JSX, edita ese archivo.

---

## 2. Inicio de sesión (`/login`)

### Propósito

Permitir que un usuario existente acceda a su área según su rol (`user` o `admin`).

### Diseño

Pantalla **split-screen** en escritorio:

| Panel izquierdo | Panel derecho |
|-----------------|---------------|
| Formulario de login | Panel promocional con gradiente |
| Logo, email, contraseña | 3 tarjetas de características |
| Recordarme, olvidé contraseña | Solo visible en `lg+` |
| Botón gradiente + Google | |

En móvil solo se muestra el formulario.

La ruta está envuelta en `AuthLayout` + `ProtectedRoute guestOnly`.

### Archivos involucrados

```text
modules/auth/login/
├── pages/page.tsx                    # Estado del formulario; usa AuthSplitTemplate
├── hooks/useLogin.ts                 # Lógica de submit y redirección
├── api/loginApi.ts                   # Credenciales mock y utilidades de sesión
├── types/login.types.ts              # Tipos y textos del panel promo (LOGIN_PROMO)
└── organisms/
    ├── LoginForm.tsx                 # UI del formulario
    └── LoginPromoPanel.tsx           # Panel derecho promocional

modules/auth/layout/AuthLayout.tsx    # Layout contenedor
shared/components/templates/AuthSplitTemplate.tsx
```

### Componentes reutilizables usados

- `InputText` — campos con icono de correo y candado
- `Checkbox` — "Recordarme"
- `AuthGradientButton` — botón principal
- `AuthFormError` — mensaje de error
- `GoogleIcon` — botón social (solo visual, sin OAuth real)
- `InfinityVaultLogo`

Todos en `@shared/components/atoms/` y `@shared/components/molecules/` (ver tabla abajo).

### Flujo de inicio de sesión

```
1. Usuario envía email + contraseña
2. useLogin → AuthContext.login()
3. loginApi.findAccount() busca en:
   - Usuarios hardcodeados (HARDCODED_USERS en loginApi.ts)
   - Usuarios registrados (localStorage: vault_registered_users)
4. Si coincide la contraseña:
   - Guarda sesión en localStorage (vault_auth_user)
   - Redirige según rol:
     - admin → /admin/users
     - user  → /drive
5. Si falla → muestra error en pantalla
```

### Credenciales de prueba

| Rol | Correo | Contraseña | Destino |
|-----|--------|------------|---------|
| Usuario | `usuario@gmail.com` | `User123` | `/drive` |
| Admin | `admin@gmail.com` | `Admin123` | `/admin/users` |

También pueden iniciar sesión usuarios creados desde `/register`.

### Guard de ruta

`ProtectedRoute guestOnly` envuelve la ruta `/login`:

- Si ya hay sesión → redirige al home del rol (`getHomePathByRole`)
- En rutas públicas no bloquea la UI esperando verificación de sesión (salvo `/login` y `/register`, que sí esperan el bootstrap)

---

## 3. Registro (`/register`)

### Propósito

Crear una cuenta nueva de tipo `user`. Tras el registro exitoso, el usuario puede iniciar sesión con sus credenciales.

### Diseño

Pantalla **centrada** con tarjeta blanca sobre fondo con gradiente suave:

- Logo y título "Crear cuenta en **VAULT**"
- Formulario en grid 2 columnas (nombre / apellido, contraseña / confirmar)
- Checkbox de términos y condiciones
- Botón "Registrarse" con gradiente
- Enlace a "Inicia sesión"
- Pantalla de éxito con icono y botón para ir al login

### Archivos involucrados

```text
modules/auth/register/
├── pages/page.tsx                    # Estado y validación; usa RegisterTemplate
├── hooks/useRegister.ts              # Llamada a AuthContext.register()
├── api/registerApi.ts                # Persistencia en localStorage
├── validations/registerSchema.ts     # Reglas de validación
├── types/register.types.ts           # Tipos del formulario
└── organisms/
    ├── RegisterForm.tsx              # Formulario completo
    └── RegisterSuccess.tsx           # Pantalla post-registro

shared/components/templates/RegisterTemplate.tsx
```

### Campos del formulario

| Campo | Obligatorio | Validación |
|-------|-------------|------------|
| Nombre(s) | Sí | No vacío |
| Apellido paterno | Sí | No vacío |
| Correo electrónico | Sí | No vacío; no duplicado |
| Contraseña | Sí | Ver requisitos abajo |
| Confirmar contraseña | Sí | Debe coincidir |
| Términos y condiciones | Sí | Checkbox marcado |

### Requisitos de contraseña

Se validan en `registerSchema.ts` y se muestran con `PasswordRequirementsChecklist` al escribir:

- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un carácter especial

Funciones clave: `evaluatePasswordRequirements`, `arePasswordRequirementsMet`, `validateRegisterForm`.

### Flujo de registro

```
1. Usuario completa el formulario
2. validateRegisterForm() valida en cliente
3. useRegister → AuthContext.register()
4. Si el email ya existe → error en campo email
5. Si es válido:
   - Guarda cuenta en localStorage (vault_registered_users)
   - Muestra pantalla "Cuenta creada"
6. Usuario pulsa "Ir a iniciar sesión" → /login
```

### Almacenamiento

| Clave localStorage | Contenido |
|--------------------|-----------|
| `vault_registered_users` | Objeto con cuentas registradas (email → datos + password) |
| `vault_auth_user` | Sesión activa tras login (sin contraseña) |

> **Nota:** Es un mock para desarrollo. En producción las contraseñas nunca deben guardarse en texto plano en el cliente.

---

## Autenticación compartida

### AuthContext (`core/context/AuthContext.tsx`)

Expone el estado global:

| Método / propiedad | Descripción |
|--------------------|-------------|
| `user` | Usuario autenticado o `null` |
| `authLoading` | Cargando sesión (bloquea en rutas privadas y guest auth) |
| `login(email, password)` | Inicia sesión |
| `register(formData)` | Crea cuenta nueva |
| `logout()` | Cierra sesión |
| `restoreSession()` | Lee sesión de localStorage |

Hook de consumo: `useAuth()` desde `@context/AuthContext`.

### Guards (`router/ProtectedRoute.tsx`)

Un solo componente con props configurables:

| Prop | Uso |
|------|-----|
| `guestOnly` | Rutas `/login` y `/register` — redirige si ya hay sesión |
| `allowedRole="user"` | Rutas de usuario — exige sesión y rol user |
| `allowedRole="admin"` | Rutas admin — exige sesión y rol admin |
| (sin props + `<Outlet />`) | Solo exige sesión activa |

Utilidades relacionadas en `loginApi.ts`:

- `getHomePathByRole(role)` — devuelve `/admin/users` o `/drive`
- `shouldBlockForAuthBootstrap(pathname)` — decide si mostrar loading al iniciar
- `isPrivateRoute(pathname)` / `isGuestAuthRoute(pathname)`

### Utilidades compartidas entre las 3 pantallas

| Archivo | Función |
|---------|---------|
| `shared/utils/authTheme.ts` | `setupAuthPage()`, gradientes, colores de marca, estilos de labels |
| `shared/components/atoms/InfinityVaultLogo.tsx` | Logo usado en login, registro y top bar |
| `shared/components/molecules/AuthGradientButton.tsx` | Botón primario con gradiente azul → morado |
| `shared/components/organisms/AuthTopBar.tsx` | Barra superior de la landing |
| `shared/components/molecules/PasswordRequirementsChecklist.tsx` | Checklist de requisitos de contraseña |

---

## Cómo probar el flujo completo

```bash
cd gestor_documental
npm run dev
```

1. Abre **http://localhost:5173/** — explora la landing
2. Pulsa **Comenzar gratis** → completa el registro en `/register`
3. Tras "Cuenta creada", ve al login con tu nuevo correo
4. O usa `usuario@gmail.com` / `User123` para área usuario (`/drive`)
5. O usa `admin@gmail.com` / `Admin123` para panel admin (`/admin/users`)

---

## Extender en el futuro

| Cambio | Dónde actuar |
|--------|--------------|
| Conectar API real | `AuthContext`, archivos en `auth/*/api/` |
| OAuth con Google | `LoginForm.tsx` + endpoint backend |
| Recuperar contraseña | Nueva feature `auth/forgot-password/` |
| Verificación de email | Pantalla post-registro + hook dedicado |
| Traducciones i18n | Mover textos de `types/` a archivos de locale |
| Validación con Zod | Reemplazar funciones manuales en `validations/` |

---

## Documentación relacionada

- [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) — Estructura general, router, módulos y convenciones del repositorio.
