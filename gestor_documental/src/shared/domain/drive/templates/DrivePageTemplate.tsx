import type { ReactNode } from 'react';

type DrivePageTemplateProps = {
  toolbar: ReactNode;
  breadcrumbs: ReactNode;
  content: ReactNode;
  modals: ReactNode;
};

/** Layout estándar de la vista Mi Unidad (toolbar, migas, contenido y modales). */
export function DrivePageTemplate({
  toolbar,
  breadcrumbs,
  content,
  modals,
}: DrivePageTemplateProps) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      {toolbar}
      {breadcrumbs}
      {content}
      {modals}
    </div>
  );
}
