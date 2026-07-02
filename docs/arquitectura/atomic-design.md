# Atomic Design — Infinity Vault Frontend

Guía de organización de componentes UI del proyecto `gestor_documental/`. Complementa [ESTRUCTURA_PROYECTO.md](../ESTRUCTURA_PROYECTO.md) con reglas concretas sobre **dónde colocar** cada pieza de interfaz.

---

## 1. Resumen

El frontend combina dos ideas:

1. **Atomic Design** — niveles de composición: átomos → moléculas → organismos → templates → pages.
2. **Arquitectura modular por feature** — cada pantalla vive en `modules/[rol]/[feature]/` con `api/`, `hooks/`, `organisms/`, `pages/`, etc.

| Capa | Ubicación principal | Responsabilidad |
|---|---|---|
| Átomos, moléculas, organismos genéricos | `shared/components/` | UI reutilizable entre auth, user y admin |
| Dominio Drive | `shared/domain/drive/` | UI y tipos de archivos/carpetas |
| Organismos de feature | `modules/*/organisms/` | UI con lógica de presentación del módulo |
| Templates | `shared/components/templates/` y `shared/domain/drive/templates/` | Layout sin datos de API |
| Pages | `modules/*/pages/page.tsx` | Hooks, estado, rutas, ensamblaje |

---

## 2. Los cinco niveles

### 2.1 Átomos

Elementos mínimos de UI. Sin lógica de negocio ni llamadas a API.

**Ubicación:** `shared/components/atoms/`

| Ejemplos | Archivo |
|---|---|
| Campo de texto | `InputText.tsx` |
| Botón | `ActionButton.tsx` |
| Tarjeta contenedora | `VaultCard.tsx` |
| Badge, alerta, tooltip | `VaultBadge.tsx`, `VaultAlert.tsx`, `Tooltip.tsx` |
| Logo / icono | `InfinityVaultLogo.tsx`, `GoogleIcon.tsx` |

**Reglas:**

- No importan organismos ni pages.
- Props genéricas (variant, label, onClick…).
- Pueden usar utilidades de tema (`authTheme`, variables CSS).

```tsx
import { InputText } from '@shared/components/atoms/InputText';
import { VaultCard } from '@shared/components/atoms/VaultCard';
// o desde el barrel:
import { InputText, VaultCard } from '@shared/components';
```

---

### 2.2 Moléculas

Combinaciones simples de átomos con una función UI concreta.

**Ubicación:** `shared/components/molecules/`

| Ejemplos | Descripción |
|---|---|
| `PageSectionHeader` | Título + acción principal |
| `ConfirmModal` | Diálogo de confirmación |
| `EmptyStatePanel` | Estado vacío con icono y CTA |
| `VaultModal` | Shell de modal reutilizable |
| `AuthFormError` | Mensaje de error en formularios |
| `Pagination` | Controles de paginación |

**Dominio drive (moléculas):** `shared/domain/drive/molecules/` — p. ej. `ViewModeToggle`.

---

### 2.3 Organismos

Secciones completas de interfaz: formularios, tablas, sidebars, modales con contexto.

**Ubicación genérica:** `shared/components/organisms/`  
**Dominio drive:** `shared/domain/drive/organisms/`  
**Por feature:** `modules/[rol]/[feature]/organisms/`

| Ámbito | Ejemplos |
|---|---|
| Shared | `Sidebar`, `AppNavbar`, `AuthTopBar`, `Toast`, `EntityListItem` |
| Drive | `DriveItemsTable`, `DriveVaultList`, `MoveItemModal`, `DriveDetail` |
| Auth | `LoginForm`, `LandingHeroSection` |
| User drive | `DriveToolbar`, `DriveList`, `DrivePageModals`, `ShareModal` |
| User trash | `TrashList`, `TrashDetail` |

**Reglas:**

- Pueden importar átomos y moléculas de `shared`.
- Organismos de módulo **no** deben importar pages.
- La lógica de negocio pesada va en `hooks/`, no en el organismo.

```tsx
// Organismo de módulo
import { LoginForm } from '../organisms/LoginForm';

// Organismo de dominio drive
import { DriveVaultList } from '@shared/domain/drive/organisms/DriveVaultList';
```

---

### 2.4 Templates

Estructuras de pantalla con **slots** (`children` o props `ReactNode`). No conocen APIs ni rutas.

**Ubicación:**

| Template | Ruta |
|---|---|
| Shell autenticado | `shared/components/templates/AuthenticatedLayout.tsx` |
| Vistas vault (encabezado + toggle) | `shared/components/templates/VaultViewPageLayout.tsx` |
| Login split (form + promo) | `shared/components/templates/AuthSplitTemplate.tsx` |
| Landing pública | `shared/components/templates/LandingTemplate.tsx` |
| Registro centrado | `shared/components/templates/RegisterTemplate.tsx` |
| Colección drive (layout puro) | `shared/domain/drive/templates/DriveVaultCollectionTemplate.tsx` |
| Colección drive (shell con modales) | `shared/domain/drive/organisms/DriveVaultCollectionShell.tsx` |
| Mi Unidad (toolbar + migas + modales) | `shared/domain/drive/templates/DrivePageTemplate.tsx` |

**Ejemplo — vista lateral de archivos:**

```tsx
<DriveVaultCollectionShell title="Destacados" itemCount={items.length} ...>
  {({ viewMode, onMove }) => (
    <DriveVaultList items={items} viewMode={viewMode} onMove={onMove} ... />
  )}
</DriveVaultCollectionShell>
```

`DriveVaultViewPage` es un **alias** de `DriveVaultCollectionShell` (misma implementación en
`shared/domain/drive/organisms/DriveVaultCollectionShell.tsx`). Las vistas laterales lo
importan desde `modules/user/drive/organisms/DriveVaultViewPage.tsx`, que re-exporta el shell del dominio.

**Ejemplo — layout puro (sin estado):**

```tsx
<DriveVaultCollectionTemplate
  title="Destacados"
  itemCount={items.length}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  overlays={<DriveDetail ... />}
>
  <DriveVaultList ... />
</DriveVaultCollectionTemplate>
```

**Ejemplo — Mi Unidad:**

```tsx
<DrivePageTemplate
  toolbar={<DriveToolbar ... />}
  breadcrumbs={<DriveBreadcrumbs ... />}
  content={<DriveList ... />}
  modals={<DrivePageModals ... />}
/>
```

---

### 2.5 Pages

Pantallas finales conectadas al router. Orquestan hooks, estado local y ensamblan templates/organismos.

**Ubicación:** `modules/[rol]/[feature]/pages/page.tsx`

**Reglas:**

- Importan desde `../organisms/`, templates de `shared` y hooks de `../hooks/`.
- Evitar JSX de layout extenso inline; usar templates.
- Export nombrado (`export const DrivePage = ...`) registrado en el router.

```tsx
// modules/user/favorites/pages/page.tsx
export const FavoritesPage = () => {
  const favorites = useFavorites();
  return (
    <DriveVaultCollectionShell title="Destacados" ...>
      {({ viewMode, onMove }) => (
        <DriveVaultList items={favorites.items} viewMode={viewMode} ... />
      )}
    </DriveVaultCollectionShell>
  );
};
```

Pantallas globales fuera de módulos: `shared/pages/` (`AppLoadingScreen`, `AppNotFoundScreen`).

---

## 3. Árbol de carpetas actual

```text
gestor_documental/src/
├── shared/
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   ├── vault-utils.ts
│   │   └── index.ts
│   ├── domain/
│   │   └── drive/
│   │       ├── types/drive.types.ts    # fuente única DriveItem, ViewMode, …
│   │       ├── atoms/
│   │       ├── molecules/
│   │       ├── organisms/
│   │       ├── templates/
│   │       ├── utils/
│   │       ├── hooks/
│   │       └── index.ts
│   ├── pages/
│   ├── hooks/
│   └── utils/
│
└── modules/
    └── [rol]/[feature]/
        ├── api/
        ├── hooks/
        ├── molecules/          # opcional: moléculas solo del feature
        ├── organisms/          # UI del feature
        ├── types/              # solo tipos propios del feature (no Drive)
        ├── validations/
        └── pages/
```

---

## 4. Dónde va cada cosa (decision tree)

```text
¿Se reutiliza en auth, user Y admin?
├── Sí → ¿Es UI de archivos/carpetas?
│   ├── Sí → shared/domain/drive/[nivel]/
│   └── No → shared/components/[atoms|molecules|organisms|templates]/
└── No → modules/[rol]/[feature]/organisms/

¿Es solo wiring de ruta + hooks?
└── Sí → modules/.../pages/page.tsx

¿Es layout con slots sin fetch?
└── Sí → shared/.../templates/

¿Es api, validación o tipos de negocio del feature?
└── Sí → api/, hooks/, validations/, types/ (no components/)
```

---

## 5. Tipos del dominio Drive

**Fuente única:** `shared/domain/drive/types/drive.types.ts`

Incluye `DriveItem`, `ViewMode`, `Breadcrumb`, `AdvancedSearchFilters`, etc.

**Compatibilidad:** `modules/user/drive/types/drive.types.ts` re-exporta desde shared. Preferir:

```typescript
import type { DriveItem } from '@shared/domain/drive/types/drive.types';
// o
import type { DriveItem } from '@shared/domain/drive';
```

---

## 6. Imports (rutas canónicas)

Tras la Fase 6 de limpieza, usar **solo** estas rutas:

| Necesitas | Import |
|---|---|
| Átomo | `@shared/components/atoms/...` |
| Molécula | `@shared/components/molecules/...` |
| Organismo genérico | `@shared/components/organisms/...` |
| Template | `@shared/components/templates/...` |
| UI drive | `@shared/domain/drive/...` |
| Organismo de feature | `../organisms/...` desde pages/hooks |
| Barrel shared | `@shared/components` o `@shared/domain/drive` |

**Alias:** `@shared/*` → `src/shared/*`

Las carpetas `@shared/components/inputs/`, `layout/`, `auth/`, `tables/` y `drive/` **ya no existen** (eliminadas en Fase 6).

---

## 8. Anti-patrones (prohibidos)

| Anti-patrón | Alternativa |
|---|---|
| Stubs `export const X = () => null` | No crear archivo hasta implementar |
| Carpetas `List/`, `Detail/`, `Form/` vacías por convención | Usar `organisms/` con nombres descriptivos |
| Átomos que importan organismos | Invertir dependencia |
| Lógica de API dentro de átomos/moléculas | Mover a `hooks/` o `api/` |
| Duplicar `DriveItem` en cada módulo | Importar desde `@shared/domain/drive` |
| Layout inline de 100+ líneas en `pages/` | Extraer template u organismo |

---

## 9. Checklist al crear UI nueva

- [ ] Identificar nivel atómico (átomo / molécula / organismo / template / page).
- [ ] Colocar en la carpeta correcta según §4.
- [ ] Pages solo ensamblan; estado de negocio en hooks.
- [ ] Tipos Drive desde `@shared/domain/drive`.
- [ ] No añadir carpetas legacy (`inputs/`, `components/` por feature).
- [ ] Actualizar doc de pantalla en `docs/pantallas/` si cambia composición relevante.

---

## 10. Estado de la migración

| Fase | Estado | Contenido |
|---|---|---|
| 0 — Limpieza | Hecho | Eliminados placeholders `List/Detail/Form` vacíos |
| 1 — Shared atómico | Hecho | `shared/components/{atoms,molecules,organisms,templates}/` |
| 2 — Dominio drive | Hecho | `shared/domain/drive/` + tipos centralizados |
| 3 — Módulos | Hecho | `modules/*/organisms/` (sin carpeta `components/`) |
| 4 — Templates | Hecho | `AuthSplitTemplate`, `DrivePageTemplate`, `DrivePageModals` |
| 5 — Documentación | Hecho | Este documento |
| 6 — Limpieza final | Hecho | Imports migrados; eliminados re-exports legacy en `shared/components` |
| 7 — Refinamiento | Hecho | Templates auth, split drive shell/template, `DriveDetail` unificado, `EntityListItem` → organisms |

---

## 11. Ejemplos por pantalla

| Pantalla | Pages | Templates | Organismos clave |
|---|---|---|---|
| Login | `auth/login/pages/` | `AuthSplitTemplate` | `LoginForm`, `LoginPromoPanel` |
| Landing | `auth/landing/pages/` | `LandingTemplate` | `LandingHeroSection`, … |
| Registro | `auth/register/pages/` | `RegisterTemplate` | `RegisterForm`, `RegisterSuccess` |
| Mi Unidad | `user/drive/pages/` | `DrivePageTemplate` | `DriveToolbar`, `DriveList`, `DrivePageModals` |
| Destacados | `user/favorites/pages/` | `DriveVaultCollectionShell` (vía `DriveVaultViewPage`) | `DriveVaultList` (domain) |
| Papelera | `user/trash/pages/` | `VaultViewPageLayout` | `TrashList`, `TrashDetail` |
| Configuración | `user/settings/pages/` | `VaultViewPageLayout` | `SettingsForm` |

---

## 12. Excepciones documentadas

| Componente | Nivel actual | Notas |
|---|---|---|
| `InputText` | Átomo | Incluye label + error; aceptable como primitivo del design system |
| `SelectableListField` | Molécula | Alta complejidad; no subir a organismo salvo que crezca más |
| `DriveVaultCollectionShell` | Organismo | Orquesta template + modales; antes vivía como “template” con estado |
| `DriveDetail` | Organismo (drive) | Base configurable vía `actions`, `infoRows`, `preview` |
| `TrashDetail` | Organismo (trash) | Wrapper sobre `DriveDetail` con acciones/filas de papelera |
| `SectionHeading` | Molécula (`auth/landing/molecules/`) | Solo usada en landing; no shared |
| `EntityListItem` | Organismo (shared) | Fila admin completa con switch y acciones |

---

## 13. Patrón Admin (pendiente de implementación)

Al implementar pantallas admin, seguir el mismo esquema que `user/`:

```text
modules/admin/[feature]/
├── api/
├── hooks/
├── organisms/     # Listados, formularios, paneles de detalle (aún no creados)
├── types/
├── validations/
└── pages/page.tsx # Delgada: hook + template/organismos
```

**Estado actual (2026):** `user-management` y `moderation` tienen placeholder en
`pages/page.tsx` y hooks vacíos (`() => ({})`). `audit` no tiene `pages/`. Ningún
módulo admin tiene carpeta `organisms/` ni `components/` en disco.

Reutilizar de shared:

- `EntityListItem` + `EntityListStateRenderer` para tablas administrables
- `PageSectionHeader`, `ConfirmModal`, `SideDrawer`
- `AuthenticatedLayout` como shell de rutas admin

No crear carpetas `components/` por feature.

---

## 14. Documentación relacionada

- [ESTRUCTURA_PROYECTO.md](../ESTRUCTURA_PROYECTO.md) — Router, módulos, stack, checklist de features.
- [AUTH_LANDING_LOGIN_REGISTRO.md](../AUTH_LANDING_LOGIN_REGISTRO.md) — Flujo auth en detalle.
- [pantallas/README.md](../pantallas/README.md) — Índice por pantalla.
