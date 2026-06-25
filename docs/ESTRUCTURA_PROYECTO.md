# Estructura del proyecto — Infinity Vault (`gestor_documental`)

Frontend de **Infinity Vault**, gestor documental tipo Google Drive. Construido con **React 19**, **Vite 7**, **TypeScript/JavaScript**, **Tailwind CSS 4** y **React Router 7**.

---

## Árbol de directorios

```
gestor_documental/
├── docs/                          # Documentación del proyecto
├── public/                        # Archivos estáticos públicos
├── src/
│   ├── assets/                    # Imágenes y recursos estáticos
│   ├── core/                      # Núcleo de la aplicación
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Estado global de autenticación
│   │   └── routes/
│   │       ├── AppRouter.jsx      # Router principal
│   │       ├── AdminRouter.jsx    # Rutas del área admin
│   │       └── UserRouter.jsx     # Rutas del área usuario
│   ├── modules/                   # Módulos por dominio
│   │   ├── admin/                 # Panel de administración
│   │   │   ├── features/
│   │   │   │   ├── moderation/pages/
│   │   │   │   └── user-management/pages/
│   │   │   └── layout/
│   │   │       └── AdminLayout.jsx
│   │   ├── auth/                  # Autenticación y páginas públicas
│   │   │   ├── components/        # UI compartida de auth
│   │   │   ├── constants/         # Contenido y estilos estáticos
│   │   │   ├── features/
│   │   │   │   ├── landing/       # Página de inicio pública
│   │   │   │   ├── login/         # Inicio de sesión
│   │   │   │   └── register/      # Registro de usuario
│   │   │   ├── hooks/             # Lógica reutilizable de auth
│   │   │   ├── routing/           # Guards de rutas
│   │   │   ├── utils/             # Utilidades de auth
│   │   │   └── validations/       # Validaciones de formularios
│   │   └── user/                  # Área de usuario autenticado
│   │       ├── feactures/         # Features del usuario (drive, favoritos, etc.)
│   │       └── layout/
│   │           └── UserLayout.jsx
│   ├── shared/                    # Código compartido entre módulos
│   │   ├── components/
│   │   │   ├── inputs/            # Campos, botones, checkbox, etc.
│   │   │   ├── layout/            # Header, sidebar, paneles
│   │   │   └── tables/            # Listas, paginación, estados vacíos
│   │   ├── hooks/
│   │   ├── pages/                 # Pantallas globales (loading, 404)
│   │   └── utils/
│   ├── App.tsx                    # Componente raíz
│   ├── main.tsx                   # Punto de entrada
│   └── index.css                  # Estilos globales y variables CSS
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## Capas y responsabilidades

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **Entrada** | `main.tsx`, `App.tsx` | Montar React, envolver con `AuthProvider` y `AppRouter` |
| **Core** | `src/core/` | Contexto global, definición de rutas |
| **Módulos** | `src/modules/` | Lógica de negocio por dominio (auth, user, admin) |
| **Shared** | `src/shared/` | Componentes y utilidades reutilizables en toda la app |
| **Features** | `modules/*/features/` | Pantallas y componentes de una funcionalidad concreta |

---

## Alias de importación (Vite)

| Alias | Ruta |
|-------|------|
| `@shared` | `src/shared` |
| `@context` | `src/core/context` |

Ejemplo:

```js
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { useAuth } from '@context/AuthContext';
```

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing page |
| `/login` | Invitado | Inicio de sesión |
| `/registro` | Invitado | Registro de cuenta |
| `/usuario` | Usuario | Área principal del usuario |
| `/usuario/drive` | Usuario | Drive (placeholder) |
| `/usuario/favoritos` | Usuario | Favoritos (placeholder) |
| `/usuario/ajustes` | Usuario | Ajustes (placeholder) |
| `/admin` | Admin | Panel de administración |
| `*` | — | Página 404 |

---

## Módulo `auth` (detalle)

```
modules/auth/
├── components/
│   ├── AuthTopBar.jsx             # Barra superior de la landing
│   ├── AuthFormError.jsx          # Mensaje de error en formularios
│   ├── AuthGradientButton.jsx     # Botón con gradiente de marca
│   ├── InfinityVaultLogo.jsx      # Logo del producto
│   ├── GoogleIcon.jsx             # Icono de Google (login social)
│   ├── PasswordRequirementsChecklist.jsx
│   └── index.js                   # Barrel export
├── constants/
│   ├── theme.js                   # Colores, gradientes, tipografías
│   ├── landingContent.js          # Textos de la landing
│   ├── loginContent.js            # Textos del panel promo del login
│   └── credentials.js             # Usuarios de prueba hardcodeados
├── features/
│   ├── landing/
│   │   ├── pages/Landing.jsx
│   │   └── components/            # Hero, Features, Benefits, CTA, Footer
│   ├── login/
│   │   ├── pages/Login.jsx
│   │   └── components/            # LoginForm, LoginPromoPanel
│   └── register/
│       ├── pages/Register.jsx
│       └── components/            # RegisterForm, RegisterSuccess
├── hooks/
│   ├── useLogin.js
│   ├── useRegister.js
│   └── useLandingNavigation.js
├── routing/
│   └── AuthGuards.jsx             # RequireAuth, RequireGuest, RequireRole
├── utils/
│   ├── authRoutes.js              # getHomePathByRole()
│   ├── authStorage.js             # localStorage y cuentas
│   └── authTheme.js               # setupAuthPage()
└── validations/
    └── registerValidationSchema.js
```

---

## Módulo `shared` (detalle)

```
shared/
├── components/
│   ├── inputs/        # InputText, ActionButton, Checkbox, Select, Switch...
│   ├── layout/        # Header, Sidebar, SideDrawer, SurfacePanel...
│   ├── tables/        # EntityListItem, Pagination, EmptyStatePanel...
│   ├── VaultCard.jsx  # Componentes de diseño "Vault"
│   ├── VaultModal.jsx
│   └── vault-utils.js # Iconos y helpers de renderizado
├── hooks/
│   └── useRequestDeduper.js
├── pages/
│   ├── AppLoadingScreen.jsx
│   └── AppNotFoundScreen.jsx
└── utils/
    └── universityContext.js
```

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo (http://localhost:5173)
npm run build     # Compilación de producción
npm run preview   # Vista previa del build
npm run lint      # ESLint
```

---

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| React 19 | UI y componentes |
| Vite 7 | Bundler y dev server |
| React Router 7 | Navegación y rutas protegidas |
| Tailwind CSS 4 | Estilos utilitarios |
| lucide-react | Iconos |
| prop-types | Validación de props en componentes JS |
| TypeScript | Tipado en archivos `.tsx` y configuración |

---

## Flujo de arranque

```
main.tsx
  └── App.tsx
        ├── AuthProvider          (contexto de sesión)
        └── AppRouter             (rutas + guards)
              ├── Landing         (público)
              ├── Login/Register  (invitado)
              └── User/Admin      (autenticado + rol)
```

---

## Notas

- La autenticación actual es **mock**: usuarios hardcodeados + registro en `localStorage` (sin backend).
- Los layouts de usuario y admin son básicos; las features internas están en construcción.
- El directorio `user/feactures` mantiene el nombre histórico con typo (`feactures` en lugar de `features`).
