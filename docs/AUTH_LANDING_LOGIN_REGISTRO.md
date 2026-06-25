# Landing, inicio de sesión y registro

Documentación de las tres pantallas públicas de **Infinity Vault** y cómo se conectan entre sí.

---

## Resumen rápido

| Pantalla | Ruta | Archivo principal |
|----------|------|-------------------|
| Landing | `/` | `features/landing/pages/Landing.jsx` |
| Login | `/login` | `features/login/pages/Login.jsx` |
| Registro | `/registro` | `features/register/pages/Register.jsx` |

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
    │ /registro  │  │  /login    │
    └──────┬─────┘  └──────┬─────┘
           │               │
           │  éxito        │ credenciales OK
           └──────► Login ◄┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        /usuario (rol: user)      /admin (rol: admin)
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

```
features/landing/
├── pages/Landing.jsx              # Orquestador (~60 líneas)
└── components/
    ├── LandingHeroSection.jsx
    ├── LandingFeaturesSection.jsx
    ├── LandingBenefitsSection.jsx
    ├── LandingCtaSection.jsx
    ├── LandingFooter.jsx
    └── SectionHeading.jsx

hooks/useLandingNavigation.js      # Navegación a login/registro
constants/landingContent.js        # Textos e iconos de cada sección
components/AuthTopBar.jsx          # Barra fija superior
```

### Lógica de navegación (`useLandingNavigation`)

| Acción | Comportamiento |
|--------|----------------|
| **Iniciar sesión** | Si hay sesión activa → redirige a `/usuario` o `/admin`. Si no → va a `/login` |
| **Comenzar gratis / Comenzar ahora** | Navega a `/registro` |
| **Estado `pendingAction`** | Evita doble clic mientras carga |

### Contenido editable

Los textos, estadísticas y tarjetas de funciones viven en:

`src/modules/auth/constants/landingContent.js`

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

### Archivos involucrados

```
features/login/
├── pages/Login.jsx                # Estado del formulario
└── components/
    ├── LoginForm.jsx              # UI del formulario
    └── LoginPromoPanel.jsx        # Panel derecho promocional

hooks/useLogin.js                  # Lógica de submit y redirección
constants/loginContent.js          # Textos del panel promo
```

### Componentes reutilizables usados

- `InputText` — campos con icono de correo y candado
- `Checkbox` — "Recordarme"
- `AuthGradientButton` — botón principal
- `AuthFormError` — mensaje de error
- `GoogleIcon` — botón social (solo visual, sin OAuth real)
- `InfinityVaultLogo`

### Flujo de inicio de sesión

```
1. Usuario envía email + contraseña
2. useLogin → AuthContext.login()
3. authStorage.findAccount() busca en:
   - Usuarios hardcodeados (credentials.js)
   - Usuarios registrados (localStorage)
4. Si coincide la contraseña:
   - Guarda sesión en localStorage (vault_auth_user)
   - Redirige según rol:
     - admin → /admin
     - user  → /usuario
5. Si falla → muestra error en pantalla
```

### Credenciales de prueba

| Rol | Correo | Contraseña | Destino |
|-----|--------|------------|---------|
| Usuario | `usuario@gmail.com` | `User123` | `/usuario` |
| Admin | `admin@gmail.com` | `Admin123` | `/admin` |

También pueden iniciar sesión usuarios creados desde `/registro`.

### Guard de ruta

`RequireGuest` envuelve la ruta `/login`:

- Si ya hay sesión → redirige al home del rol
- En rutas públicas no bloquea la UI esperando verificación de sesión

---

## 3. Registro (`/registro`)

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

```
features/register/
├── pages/Register.jsx             # Estado y validación
└── components/
    ├── RegisterForm.jsx           # Formulario completo
    └── RegisterSuccess.jsx        # Pantalla post-registro

hooks/useRegister.js               # Llamada a AuthContext.register()
validations/registerValidationSchema.js
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

Se validan en `registerValidationSchema.js` y se muestran con `PasswordRequirementsChecklist` al escribir:

- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un carácter especial

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

### AuthContext (`core/context/AuthContext.jsx`)

Expone el estado global:

| Método / propiedad | Descripción |
|--------------------|-------------|
| `user` | Usuario autenticado o `null` |
| `authLoading` | Cargando sesión (solo bloquea en rutas privadas) |
| `login(email, password)` | Inicia sesión |
| `register(formData)` | Crea cuenta nueva |
| `logout()` | Cierra sesión |
| `restoreSession()` | Lee sesión de localStorage |

### Guards (`routing/AuthGuards.jsx`)

| Guard | Uso |
|-------|-----|
| `RequireAuth` | Rutas `/usuario` y `/admin` — exige sesión |
| `RequireGuest` | Rutas `/login` y `/registro` — redirige si ya hay sesión |
| `RequireRole` | Separa admin de usuario normal |
| `NotFoundRoute` | Página 404 con botón contextual |

### Utilidades compartidas entre las 3 pantallas

| Archivo | Función |
|---------|---------|
| `utils/authTheme.js` | `setupAuthPage()` — carga fuentes y tema claro |
| `constants/theme.js` | Gradientes, colores de marca, estilos de labels |
| `components/InfinityVaultLogo.jsx` | Logo usado en login, registro y top bar |
| `components/AuthGradientButton.jsx` | Botón primario con gradiente azul → morado |

---

## Cómo probar el flujo completo

```bash
cd gestor_documental
npm run dev
```

1. Abre **http://localhost:5173/** — explora la landing
2. Pulsa **Comenzar gratis** → completa el registro
3. Tras "Cuenta creada", ve al login con tu nuevo correo
4. O usa `usuario@gmail.com` / `User123` para área usuario
5. O usa `admin@gmail.com` / `Admin123` para panel admin

---

## Extender en el futuro

| Cambio | Dónde actuar |
|--------|--------------|
| Conectar API real | `AuthContext`, nuevos archivos en `auth/api/` |
| OAuth con Google | `LoginForm.jsx` + endpoint backend |
| Recuperar contraseña | Nueva feature `auth/features/forgot-password/` |
| Verificación de email | Pantalla post-registro + hook similar a horarios |
| Traducciones i18n | Mover textos de `constants/` a archivos de locale |
