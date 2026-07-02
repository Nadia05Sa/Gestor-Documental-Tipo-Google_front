import type { ReactNode } from 'react';
import { INTER_STYLE, REGISTER_PAGE_GRADIENT } from '@shared/utils/authTheme';

type RegisterTemplateProps = {
  children: ReactNode;
};

/** Layout centrado del flujo de registro con fondo en gradiente. */
export function RegisterTemplate({ children }: RegisterTemplateProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ ...INTER_STYLE, background: REGISTER_PAGE_GRADIENT }}
    >
      <div className="w-full max-w-[560px]">{children}</div>
    </div>
  );
}
