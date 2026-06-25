# Vault Frontend

Frontend de **Vault** construido con **React**, **TypeScript** y **Tailwind CSS**.

## Resumen

Esta aplicación concentra la interfaz de usuario del producto: navegación, autenticación visual, exploración de documentos, vistas de detalle y componentes reutilizables de la experiencia web.

## Stack

- React
- TypeScript
- Tailwind CSS
- Node.js para desarrollo local

## Objetivo

El frontend está pensado para una interfaz rápida, modular y fácil de escalar. La base visual se apoya en componentes reutilizables y utilidades de estilo con Tailwind para mantener consistencia entre pantallas.

## Estructura esperada

- `src/` para la aplicación principal
- `src/components/` para componentes reutilizables
- `src/pages/` o `src/routes/` para pantallas y navegación
- `src/hooks/` para lógica compartida de UI
- `src/styles/` para estilos globales y configuración visual

## Configuración

1. Instala dependencias con el gestor de paquetes del proyecto.
2. Crea el archivo de variables de entorno si el frontend necesita endpoints o claves públicas.
3. Revisa la configuración de Tailwind y los archivos de entrada de React antes de levantar la app.

## Desarrollo

En local, el flujo normal es iniciar el servidor de desarrollo del frontend y trabajar sobre los componentes de la interfaz.

## Buenas prácticas

- Mantener los componentes pequeños y reutilizables.
- Usar TypeScript para tipar props, respuestas y estados.
- Centralizar clases repetidas en componentes o utilidades.
- Evitar duplicar lógica de presentación entre pantallas.

## Documentación

Si este frontend se conecta con una API o con servicios adicionales, documenta ahí mismo las variables de entorno necesarias y los flujos de integración.