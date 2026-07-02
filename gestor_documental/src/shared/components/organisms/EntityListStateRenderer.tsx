import { Fragment, type ReactNode } from 'react';
import { SurfacePanel } from '@shared/components/molecules/SurfacePanel';
import { LoadingStatePanel } from '@shared/components/molecules/LoadingStatePanel';
import { EmptyStatePanel } from '../molecules/EmptyStatePanel';
import { Pagination } from '../molecules/Pagination';
import type { ComponentType } from 'react';

type EmptyStateConfig = {
  icon?: ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionIcon?: ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
};

type PaginationConfig = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

type EntityListStateRendererProps<T> = {
  loading: boolean;
  loadingMessage?: string;
  items?: T[];
  getItemKey?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: EmptyStateConfig;
  pagination?: PaginationConfig;
  containerClassName?: string;
  listPanelPadding?: string;
};

/**
 * EntityListStateRenderer
 *
 * Renderiza de forma reusable los estados de lista: loading, empty y data + paginacion.
 */
export const EntityListStateRenderer = <T,>({
  loading,
  loadingMessage = 'Cargando...',
  items = [],
  getItemKey,
  renderItem,
  emptyState,
  pagination,
  containerClassName = 'space-y-4',
  listPanelPadding = 'p-0',
}: EntityListStateRendererProps<T>) => {
  if (loading) {
    return <LoadingStatePanel message={loadingMessage} />;
  }

  if (!items.length) {
    return (
      <EmptyStatePanel
        icon={emptyState?.icon}
        title={emptyState?.title}
        description={emptyState?.description}
        actionIcon={emptyState?.actionIcon}
        actionLabel={emptyState?.actionLabel}
        onAction={emptyState?.onAction}
      />
    );
  }

  return (
    <div className={containerClassName}>
      <SurfacePanel padding={listPanelPadding}>
        {items.map((item, index) => {
          const key = getItemKey ? getItemKey(item, index) : index;
          return <Fragment key={key}>{renderItem(item, index)}</Fragment>;
        })}
      </SurfacePanel>

      {pagination ? (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          hasPreviousPage={pagination.hasPreviousPage}
          hasNextPage={pagination.hasNextPage}
        />
      ) : null}
    </div>
  );
};
