# Pantalla User: Unidades compartidas (`/shared-drives`)

Espacios colaborativos donde **los archivos pertenecen al equipo** (no a una persona).
Cada unidad tiene miembros, roles e invitaciones. Es distinta de "Compartidos conmigo"
(que lista ítems individuales compartidos con el usuario).

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/shared-drives` |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

---

## Estado de implementación

**No implementada (propuesta de diseño).** Aún no existe el módulo
`modules/user/shared-drives/`. Esta ficha documenta el diseño VAULT y el prompt para
construirla siguiendo el patrón del repositorio.

```text
modules/user/shared-drives/      (propuesto)
├── api/sharedDrivesApi.ts        # CRUD de unidades, miembros e invitaciones (mock → apiClient.ts)
├── components/
│   ├── SharedDrivesList.tsx      # cuadrícula de unidades (tarjetas)
│   ├── SharedDriveCard.tsx       # tarjeta de unidad (nombre, miembros, mi rol)
│   ├── SharedDriveForm.tsx       # crear / editar unidad
│   ├── MembersPanel.tsx          # pestañas Miembros / Invitaciones
│   └── InviteMemberModal.tsx     # invitar nuevo miembro
├── hooks/useSharedDrives.ts      # lista, crear, editar, eliminar, miembros, invitaciones
├── pages/page.tsx                # exporta SharedDrivesPage
├── types/shared-drives.types.ts  # SharedDrive, DriveMember, DriveRole, Invitation
└── validations/sharedDriveSchema.ts # validateDriveName
```

---

## Funcionalidad objetivo

(Basado en el diseño VAULT "Unidades compartidas".)

- **Listado** de unidades del usuario en tarjetas: nombre, descripción, nº de miembros
  (`memberCount`), propietario (`owner`) y **mi rol** (`myRole`). Buscador
  ("Buscar unidades compartidas...").
- **Crear unidad** ("Crear unidad" / "Nueva unidad compartida"): nombre ("Nombre de la
  unidad"), descripción ("Describe el propósito de esta unidad compartida...", ej.
  "Marketing, Desarrollo, Diseño..."). Texto guía: *"Crea un espacio colaborativo donde los
  archivos pertenecen al equipo"*.
- **Editar** nombre y descripción; **eliminar** unidad (confirmación
  "¿Estás seguro de que deseas eliminar esta unidad compartida?").
- **Gestionar miembros** con pestañas **"Miembros (N)"** e **"Invitaciones (N)"**:
  - Roles: **Control total de la unidad**, **Puede editar**, **Puede comentar**,
    **Solo visualizar**.
  - **Invitar miembro** ("Invitar nuevo miembro"); validación "Este usuario ya es miembro
    de la unidad".
  - Acciones por miembro: cambiar rol, **"Quitar de la unidad"**; por invitación:
    reenviar / cancelar.
- Toasts reales: "Unidad compartida creada", "Unidad actualizada", "Unidad compartida
  eliminada", "Miembro eliminado", "Invitación reenviada", "Invitación cancelada".

---

## Contrato backend objetivo (propuesto)

> Apóyate en `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sharing-permissions.md`
> y en la documentación de equipos/unidades cuando exista. Propuesta:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/shared-drives` | Listar unidades del usuario |
| `POST` | `/shared-drives` | Crear unidad |
| `PATCH` | `/shared-drives/:id` | Editar nombre/descripción |
| `DELETE` | `/shared-drives/:id` | Eliminar unidad |
| `GET` | `/shared-drives/:id/members` | Miembros e invitaciones |
| `POST` | `/shared-drives/:id/invitations` | Invitar miembro |
| `PATCH` | `/shared-drives/:id/members/:userId` | Cambiar rol |
| `DELETE` | `/shared-drives/:id/members/:userId` | Quitar miembro |

Tablas sugeridas: `shared_drives`, `shared_drive_members`, `shared_drive_invitations`.

---

## Guía de construcción

1. Tipos en `types/shared-drives.types.ts` (`SharedDrive`, `DriveMember`, `DriveRole`, `Invitation`).
2. `sharedDrivesApi.ts` con `apiClient.ts`; toda mutación (crear/editar/eliminar/invitar/rol) con `useRequestDeduper`.
3. `useSharedDrives` orquesta lista, formulario, miembros e invitaciones.
4. Componentes de UI puros; `SharedDriveForm` usa `validations/sharedDriveSchema.ts`.
5. Registrar `/shared-drives` en `AppRoutes.tsx` y añadir el ítem al `Sidebar`.

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "Unidades compartidas") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla "Unidades compartidas" (/shared-drives) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `user`, dentro de UserLayout. La feature es NUEVA: crea modules/user/shared-drives/.
- Distinta de "Compartidos conmigo": aquí los archivos pertenecen al EQUIPO, no a una persona.
- Persistencia: mock (localStorage) con la misma firma de API para pasar a apiClient.ts.

DISEÑO (VAULT, copys reales del Figma)
- Encabezado "Unidades compartidas" + buscador "Buscar unidades compartidas..." + botón
  "Crear unidad". Texto guía: "Crea un espacio colaborativo donde los archivos pertenecen
  al equipo".
- Lista de unidades en tarjetas: nombre, descripción, nº de miembros (memberCount),
  propietario (owner) y mi rol (myRole). Acciones: "Gestionar miembros", "Ver equipo",
  editar, eliminar.
- Modal "Crear/Editar unidad": "Nombre de la unidad", "Describe el propósito de esta unidad
  compartida..." (ej. "Marketing, Desarrollo, Diseño..."). Editar reusa el mismo formulario
  ("Edita el nombre y descripción de esta unidad compartida").
- Eliminar: confirmación "¿Estás seguro de que deseas eliminar esta unidad compartida?".
- Gestión de miembros con PESTAÑAS "Miembros (N)" e "Invitaciones (N)":
  - Roles: "Control total de la unidad", "Puede editar", "Puede comentar", "Solo visualizar".
  - "Invitar miembro" / "Invitar nuevo miembro"; validar "Este usuario ya es miembro de la unidad".
  - Por miembro: cambiar rol y "Quitar de la unidad". Por invitación: reenviar y cancelar.
- Toasts: "Unidad compartida creada", "Unidad actualizada", "Unidad compartida eliminada",
  "Miembro eliminado", "Invitación reenviada", "Invitación cancelada".

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/user/shared-drives/{api,hooks,components,pages,types,validations}.
  - api/sharedDrivesApi.ts: CRUD de unidades, miembros e invitaciones (mock → apiClient.ts).
  - hooks/useSharedDrives.ts: TODO el estado y orquestación. Sin lógica en componentes.
  - components/: SharedDrivesList, SharedDriveCard, SharedDriveForm, MembersPanel,
    InviteMemberModal (UI pura).
  - pages/page.tsx: compone hook + componentes; exporta `SharedDrivesPage`.
  - types/shared-drives.types.ts: SharedDrive, DriveMember, DriveRole, Invitation.
  - validations/sharedDriveSchema.ts: validateDriveName.
- Con backend real: HTTP vía apiClient.ts; toda mutación con useRequestDeduper. La
  autorización por unidad/rol la valida el backend. IDs públicos UUID.
- Importa con alias @shared/*. Registrar la ruta en router/AppRoutes.tsx y el ítem en el Sidebar.

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/layout/SurfacePanel / VaultCard para las tarjetas de unidad.
- @shared/components/layout/PageSectionHeader para el encabezado + acción "Crear unidad".
- @shared/components/inputs (InputText, Textarea, Select para el rol, ActionButton).
- @shared/components/VaultModal para crear/editar y para invitar; ConfirmModal para eliminar
  unidad y quitar miembro.
- @shared/components/VaultBadge para el rol propio / contador; tablas compartidas
  (EntityListItem) para la lista de miembros si aplica.
- @shared/components/tables/EmptyStatePanel para el estado vacío; toast() para feedback.

ESTILOS
- Solo tokens CSS del tema. Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Crear/editar/eliminar unidades, listar con memberCount/owner/myRole, gestionar miembros
  e invitaciones (roles, invitar, quitar, reenviar/cancelar) con sus toasts y confirmaciones.
- Reutiliza SurfacePanel/VaultCard, VaultModal, ConfirmModal, los inputs compartidos y los
  tokens del tema; cero color hardcodeado.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Pantallas relacionadas: [shared.md](./shared.md) (compartidos conmigo) · [drive.md](./drive.md)
- Backend: `Gestor-Documental-Tipo-Google/.docs/05-modules/user/sharing-permissions.md`
