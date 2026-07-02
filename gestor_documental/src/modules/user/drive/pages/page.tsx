import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DrivePageTemplate } from '@shared/domain/drive/templates/DrivePageTemplate';
import { useDrive } from '../hooks/useDrive';
import { DriveToolbar } from '../organisms/DriveToolbar';
import { DriveBreadcrumbs } from '../organisms/DriveBreadcrumbs';
import { DriveList } from '../organisms/DriveList';
import { DrivePageModals, type DriveFormState } from '../organisms/DrivePageModals';
import type { CreateContentKind } from '../organisms/CreateContentModal';
import type { DriveItem } from '../types/drive.types';

export const DrivePage = () => {
  const drive = useDrive();
  const location = useLocation();
  const [formState, setFormState] = useState<DriveFormState>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);
  const [shareItem, setShareItem] = useState<DriveItem | null>(null);
  const [createContentKind, setCreateContentKind] = useState<CreateContentKind | null>(null);
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null);

  useEffect(() => {
    const action = (location.state as { newAction?: string } | null)?.newAction;
    if (!action) return;
    if (action === 'upload') setUploadOpen(true);
    if (action === 'folder') setFormState({ mode: 'create' });
    if (action === 'document') setCreateContentKind('document');
    if (action === 'spreadsheet') setCreateContentKind('spreadsheet');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleOpenItem = (item: DriveItem) => {
    if (item.kind === 'folder') {
      drive.openFolder(item.id);
    } else {
      drive.openFilePreview(item);
      setPreviewItem(item);
    }
  };

  return (
    <DrivePageTemplate
      toolbar={(
        <DriveToolbar
          title="Mi Unidad"
          onAdvancedSearch={() => setAdvancedOpen(true)}
          viewMode={drive.viewMode}
          onViewModeChange={drive.setViewMode}
          onCreateFolder={() => setFormState({ mode: 'create' })}
          onCreateDocument={() => setCreateContentKind('document')}
          onCreateSpreadsheet={() => setCreateContentKind('spreadsheet')}
          onUploadFile={() => setUploadOpen(true)}
        />
      )}
      breadcrumbs={(
        <DriveBreadcrumbs
          breadcrumbs={drive.breadcrumbs}
          onNavigate={drive.openFolder}
          movable
          onMoveItem={drive.moveItem}
        />
      )}
      content={(
        <DriveList
          items={drive.items}
          viewMode={drive.viewMode}
          onOpenItem={handleOpenItem}
          onToggleStar={drive.toggleStar}
          onRename={(item) => setFormState({ mode: 'rename', item })}
          onShare={setShareItem}
          onMoveToTrash={drive.moveToTrash}
          onUploadFile={() => setUploadOpen(true)}
          onMoveItem={drive.moveItem}
          onMove={setMoveItem}
        />
      )}
      modals={(
        <DrivePageModals
          formState={formState}
          setFormState={setFormState}
          uploadOpen={uploadOpen}
          setUploadOpen={setUploadOpen}
          advancedOpen={advancedOpen}
          setAdvancedOpen={setAdvancedOpen}
          previewItem={previewItem}
          setPreviewItem={setPreviewItem}
          shareItem={shareItem}
          setShareItem={setShareItem}
          createContentKind={createContentKind}
          setCreateContentKind={setCreateContentKind}
          moveItem={moveItem}
          setMoveItem={setMoveItem}
          advancedFilters={drive.advancedFilters}
          onCreateFolder={drive.createFolder}
          onRename={drive.rename}
          onUploadFile={drive.uploadFile}
          onApplyAdvancedFilters={drive.applyAdvancedFilters}
          onRefresh={drive.refresh}
          onToggleStar={drive.toggleStar}
          onMoveToTrash={drive.moveToTrash}
          onCreateDocument={drive.createDocument}
          onCreateSpreadsheet={drive.createSpreadsheet}
          saveShareSettings={drive.saveShareSettings}
          getShareLink={drive.getShareLink}
        />
      )}
    />
  );
};
