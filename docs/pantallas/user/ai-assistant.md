# Pantalla User: Asistente IA (`/assistant`)

Chat con el asistente inteligente de VAULT ("VAULT AI Assistant"). Ayuda al usuario a
encontrar archivos, resumir documentos y resolver dudas sobre su Drive mediante lenguaje
natural. Visible para el rol `user`.

---

## Ruta y acceso

| Atributo | Valor |
|---|---|
| Ruta | `/assistant` (además, panel flotante accesible desde cualquier vista) |
| Acceso | `ProtectedRoute allowedRole="user"` |
| Layout | `UserLayout` |
| Registro de ruta | `router/AppRoutes.tsx` |

> En el diseño VAULT el asistente aparece como **panel/chat lateral** invocable desde un
> botón global. Puede vivir como pantalla propia (`/assistant`) y/o como overlay montado en
> `AuthenticatedLayout`. Recomendado: un componente de panel reutilizable que ambas usen.

---

## Estado de implementación

**No implementada (propuesta de diseño).** Aún no existe el módulo
`modules/user/assistant/`. Esta ficha documenta el diseño VAULT y el prompt para
construirla siguiendo el patrón del repositorio.

```text
modules/user/assistant/        (propuesto)
├── api/assistantApi.ts         # envío de mensajes (mock → apiClient.ts)
├── components/
│   ├── AssistantPanel.tsx      # contenedor del chat (header + lista + input)
│   ├── MessageList.tsx         # historial de mensajes
│   ├── MessageBubble.tsx       # burbuja (usuario / asistente)
│   └── MessageComposer.tsx     # input + enviar
├── hooks/useAssistant.ts       # estado de la conversación y envío
├── pages/page.tsx              # exporta AssistantPage
└── types/assistant.types.ts    # ChatMessage, ChatRole, etc.
```

---

## Funcionalidad objetivo

(Basado en el diseño VAULT "VAULT AI Assistant".)

- Conversación tipo chat: mensajes del **usuario** y del **asistente**, con autor, inicial,
  color de autor y marca de tiempo (`timestamp`).
- Input con placeholder **"Escribe tu pregunta..."** y envío (Enter o botón).
- Subtítulo/encabezado: **"Chat con el asistente inteligente de VAULT"**.
- Estado "procesando": mientras responde, se muestra un indicador (el diseño usa textos del
  tipo *"Estoy procesando tu solicitud..."*).
- Casos de uso: buscar archivos, resumir/responder sobre documentos del Drive, sugerir
  acciones (crear carpeta, compartir, etc.).

---

## Contrato backend objetivo (propuesto)

> No hay endpoint definido aún en la documentación maestra. Propuesta para cuando exista
> el servicio de IA:

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/assistant/chat` | Envía el mensaje + contexto y devuelve la respuesta |
| `GET` | `/assistant/history` | Historial de la conversación (opcional) |

> El asistente NO debe exponer IDs internos ni binarios; opera sobre metadatos del Drive del
> usuario respetando sus permisos (ACL). En backend real, la respuesta puede llegar por
> streaming (SSE/WebSocket).

---

## Guía de construcción

1. Tipos en `types/assistant.types.ts` (`ChatMessage { id, role: 'user' | 'assistant', content, timestamp, author?, authorColor?, authorInitial? }`).
2. `assistantApi.ts` con `apiClient.ts` (mock inicial que simula respuesta diferida); el envío como mutación con `useRequestDeduper`.
3. `useAssistant` orquesta la lista de mensajes, el estado `isProcessing` y el envío.
4. Componentes de UI puros (`AssistantPanel`, `MessageList`, `MessageBubble`, `MessageComposer`).
5. Registrar `/assistant` en `AppRoutes.tsx` y/o montar el panel en `AuthenticatedLayout`.

---

## Prompt para IA

> Prompt listo para construir esta pantalla con un asistente de IA. Basado en el diseño
> **VAULT** (Figma "VAULT AI Assistant") y en la arquitectura real del repositorio. Las
> **reglas de arquitectura** y los **componentes reutilizables** son obligatorios.

```text
Construye la pantalla/panel "Asistente IA" (/assistant) del frontend Infinity Vault.

CONTEXTO
- SPA React 19 + TypeScript + Vite 7 + React Router 7 + Tailwind CSS 4. Iconos: lucide-react.
- Rol `user`, dentro de UserLayout. La feature es NUEVA: crea modules/user/assistant/.
- Persistencia/respuesta: mock inicial (simula respuesta diferida); misma firma de API para apiClient.ts.

DISEÑO (VAULT, copys reales del Figma) — "VAULT AI Assistant"
- Cabecera del chat: título "VAULT AI Assistant" y subtítulo "Chat con el asistente
  inteligente de VAULT".
- Historial de mensajes en burbujas diferenciadas: usuario (alineado a la derecha) vs
  asistente (izquierda, con avatar/inicial y color de autor). Cada mensaje muestra hora.
- Composer inferior: textarea con placeholder "Escribe tu pregunta..." + botón enviar
  (también con Enter). Se deshabilita si el texto está vacío.
- Estado "procesando": indicador/burbuja temporal mientras llega la respuesta
  (texto tipo "Estoy procesando tu solicitud...").
- Puede usarse como pantalla (/assistant) y como panel lateral flotante invocable desde
  cualquier vista; comparte el mismo componente de chat.

REGLAS DE ARQUITECTURA (OBLIGATORIAS)
- Patrón de módulos: modules/user/assistant/{api,hooks,components,pages,types}.
  - api/assistantApi.ts: envío de mensaje (mock → apiClient.ts).
  - hooks/useAssistant.ts: lista de mensajes, isProcessing y envío. Sin lógica en componentes.
  - components/: AssistantPanel, MessageList, MessageBubble, MessageComposer (UI pura).
  - pages/page.tsx: compone hook + componentes; exporta `AssistantPage`.
  - types/assistant.types.ts: ChatMessage, ChatRole.
- Con backend real: HTTP vía apiClient.ts; el envío como mutación con useRequestDeduper.
  No exponer IDs internos; respetar permisos del usuario. Permitir respuesta por streaming.
- Importa con alias @shared/* y @context/AuthContext (para el avatar/inicial del usuario).
- Registrar la ruta en router/AppRoutes.tsx (y/o montar el panel en AuthenticatedLayout).

COMPONENTES REUTILIZABLES (NO reinventar)
- @shared/components/inputs/Textarea para el composer e InputText si procede.
- @shared/components/inputs/ActionButton para enviar (icon, loading, disabled).
- @shared/components/layout/SurfacePanel para encuadrar el chat; PageSectionHeader para el título.
- @shared/components/VaultSidePanel si se usa como overlay lateral.
- toast() de @shared/components/Toast para errores de envío.

ESTILOS
- Solo tokens CSS del tema (var(--text-primary), var(--text-secondary), var(--accent),
  var(--accent-subtle), var(--bg-elevated), var(--bg-surface), var(--border-default)). Sin colores hardcodeados.

CRITERIOS DE ACEPTACIÓN
- Enviar un mensaje añade la burbuja del usuario, muestra estado "procesando" y luego la
  respuesta del asistente con hora; el input se limpia y se re-enfoca.
- Funciona como pantalla y como panel lateral compartiendo el mismo componente; reutiliza
  Textarea/ActionButton/SurfacePanel y los tokens del tema.
```

---

## Referencias

- Flujo user: [../../flujos/user/flujo-usuario.md](../../flujos/user/flujo-usuario.md)
- Pantallas relacionadas: [drive.md](./drive.md) · [shared-drives.md](./shared-drives.md)
