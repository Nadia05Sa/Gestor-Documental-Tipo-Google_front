import { Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { DriveVaultViewPage } from '../../drive/components/DriveVaultViewPage';
import { DriveVaultList } from '@shared/components/drive/DriveVaultList';

export const FavoritesPage = () => {
  const favorites = useFavorites();

  return (
    <DriveVaultViewPage
      title="Destacados"
      itemCount={favorites.items.length}
      previewItem={favorites.previewItem}
      setPreviewItem={favorites.setPreviewItem}
      detailHandlers={favorites.detailHandlers}
      onRefresh={favorites.refresh}
    >
      {({ viewMode, onMove }) => (
        <DriveVaultList
          items={favorites.items}
          viewMode={viewMode}
          emptyState={{
            icon: Star,
            title: 'No tienes archivos destacados',
            description: 'Marca archivos o carpetas con la estrella para verlos aquí.',
          }}
          onOpenItem={favorites.openItem}
          onToggleStar={favorites.toggleStar}
          onMoveToTrash={favorites.moveToTrash}
          onMove={onMove}
        />
      )}
    </DriveVaultViewPage>
  );
};
