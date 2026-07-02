import type { ReactNode } from 'react';
import { INTER_STYLE } from '@shared/utils/authTheme';

type AuthSplitTemplateProps = {
  children: ReactNode;
  promo?: ReactNode;
};

/** Layout de autenticación: formulario a la izquierda y panel promocional a la derecha. */
export function AuthSplitTemplate({ children, promo }: AuthSplitTemplateProps) {
  return (
    <div className="flex min-h-screen w-full" style={INTER_STYLE}>
      <div className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        {children}
      </div>
      {promo}
    </div>
  );
}
