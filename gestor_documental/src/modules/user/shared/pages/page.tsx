import { Users } from 'lucide-react';
import { useShared } from '../hooks/useShared';
import { DriveVaultViewPage } from '../../drive/components/DriveVaultViewPage';
import { DriveVaultList } from '@shared/components/drive/DriveVaultList';

export const SharedPage = () => {
  const shared = useShared();

  return (
    <DriveVaultViewPage
      title="Compartidos conmigo"
      itemCount={shared.items.length}
      defaultViewMode="list"
      previewItem={shared.previewItem}
      setPreviewItem={shared.setPreviewItem}
      detailHandlers={shared.detailHandlers}
      onRefresh={shared.refresh}
    >
      {({ viewMode, onMove }) => (
        <DriveVaultList
          items={shared.items}
          viewMode={viewMode}
          tableVariant="shared"
          showSharedIcon
          emptyState={{
            icon: Users,
            title: 'Nada compartido contigo aún',
            description: 'Los archivos que otras personas compartan contigo aparecerán aquí.',
          }}
          onOpenItem={shared.openItem}
          onToggleStar={shared.toggleStar}
          onMoveToTrash={shared.moveToTrash}
          onMove={onMove}
        />
      )}
    </DriveVaultViewPage>
  );
};
