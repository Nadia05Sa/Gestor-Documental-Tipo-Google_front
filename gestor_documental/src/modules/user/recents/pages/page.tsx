import { Clock } from 'lucide-react';
import { EmptyStatePanel } from '@shared/components/molecules/EmptyStatePanel';
import { DriveVaultSectionList } from '@shared/domain/drive/organisms/DriveVaultList';
import { DriveVaultViewPage } from '../../drive/organisms/DriveVaultViewPage';
import { useRecents } from '../hooks/useRecents';

export const RecentsPage = () => {
  const recents = useRecents();
  const itemCount = recents.sections.reduce((total, section) => total + section.items.length, 0);

  return (
    <DriveVaultViewPage
      title="Archivos recientes"
      itemCount={itemCount}
      previewItem={recents.previewItem}
      setPreviewItem={recents.setPreviewItem}
      detailHandlers={recents.detailHandlers}
      onRefresh={recents.refresh}
    >
      {({ viewMode, onMove }) =>
        recents.hasItems ? (
          <DriveVaultSectionList
            sections={recents.sections.map((section) => ({
              key: section.group,
              title: section.group,
              items: section.items,
            }))}
            viewMode={viewMode}
            onOpenItem={recents.openItem}
            onToggleStar={recents.toggleStar}
            onMoveToTrash={recents.moveToTrash}
            onMove={onMove}
            getFooterRight={recents.getRelativeLabel}
          />
        ) : (
          <EmptyStatePanel
            icon={Clock}
            title="Aún no hay archivos recientes"
            description="Los archivos que abras aparecerán aquí."
          />
        )
      }
    </DriveVaultViewPage>
  );
};
