import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  tone: ToastTone;
  message: string;
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;

const emit = () => {
  listeners.forEach((listener) => listener(toasts));
};

const remove = (id: number) => {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
};

const push = (tone: ToastTone, message: string) => {
  const id = ++counter;
  toasts = [...toasts, { id, tone, message }];
  emit();
  setTimeout(() => remove(id), 3500);
};

export const toast = {
  success: (message: string) => push('success', message),
  error: (message: string) => push('error', message),
  info: (message: string) => push('info', message),
};

const TONE_CONFIG: Record<ToastTone, { icon: typeof Info; color: string }> = {
  success: { icon: CheckCircle2, color: 'var(--success-600, #16a34a)' },
  error: { icon: XCircle, color: 'var(--danger-600, #dc2626)' },
  info: { icon: Info, color: 'var(--accent, #2563eb)' },
};

export const ToastHost = () => {
  const [items, setItems] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    const listener: Listener = (next) => setItems([...next]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (items.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[60] flex w-80 max-w-[calc(100vw-2.5rem)] flex-col gap-2">
      {items.map((item) => {
        const { icon: Icon, color } = TONE_CONFIG[item.tone];
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-[var(--radius-card,0.75rem)] border p-3 shadow-[var(--shadow-card)]"
            style={{ backgroundColor: 'var(--bg-elevated, #ffffff)', borderColor: 'var(--border-default, #d1d5db)' }}
            role="status"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} />
            <p className="flex-1 text-sm text-[var(--text-primary)]">{item.message}</p>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
};
