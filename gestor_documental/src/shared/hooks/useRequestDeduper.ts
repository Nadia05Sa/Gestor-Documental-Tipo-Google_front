import { useCallback, useRef } from 'react';

const normalizeValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  return String(value);
};

export const buildRequestSignature = (
  params: Record<string, unknown> = {},
  keys: string[] = [],
): string => {
  if (!Array.isArray(keys) || keys.length === 0) {
    return JSON.stringify(params);
  }

  return keys
    .map((key) => `${key}:${normalizeValue(params[key])}`)
    .join('|');
};

export const useRequestDeduper = ({ windowMs = 150 }: { windowMs?: number } = {}) => {
  const lastRequestRef = useRef({ key: '', ts: 0 });

  const shouldRun = useCallback((signature: string): boolean => {
    const now = Date.now();

    if (
      lastRequestRef.current.key === signature
      && now - lastRequestRef.current.ts < windowMs
    ) {
      return false;
    }

    lastRequestRef.current = { key: signature, ts: now };
    return true;
  }, [windowMs]);

  return {
    shouldRun,
  };
};
