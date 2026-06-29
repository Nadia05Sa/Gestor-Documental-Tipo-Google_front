const INVALID_CHARS = /[\\/:*?"<>|]/;

/**
 * Valida el nombre de un archivo o carpeta. Devuelve el mensaje de error o
 * `null` si el nombre es válido.
 */
export const validateItemName = (rawName: string): string | null => {
  const name = rawName.trim();
  if (!name) return 'El nombre es obligatorio.';
  if (name.length > 120) return 'El nombre no puede superar los 120 caracteres.';
  if (INVALID_CHARS.test(name)) return 'El nombre contiene caracteres no permitidos.';
  return null;
};
