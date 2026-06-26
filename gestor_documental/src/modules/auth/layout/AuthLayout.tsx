import type { ReactNode } from 'react';

type AuthLayoutOptions = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutOptions) => (
  <div className="min-h-screen bg-[var(--bg-base,#ffffff)]">{children}</div>
);
