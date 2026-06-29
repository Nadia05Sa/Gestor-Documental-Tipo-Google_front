import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrive } from '../hooks/useDrive';
import { DriveToolbar } from '../components/DriveToolbar';
import { DriveBreadcrumbs } from '../components/DriveBreadcrumbs';
import { DriveList } from '../components/DriveList';
import { DriveForm } from '../components/DriveForm';
import { UploadFileModal } from '../components/UploadFileModal';
import { DriveDetail } from '../components/DriveDetail';
import { AdvancedSearchModal } from '../components/AdvancedSearchModal';
import { ShareModal } from '../components/ShareModal';
import { CreateContentModal, type CreateContentKind } from '../components/CreateContentModal';
import { MoveItemModal } from '@shared/components/drive/MoveItemModal';
import type { DriveItem } from '../types/drive.types';

type FormState =
  | { mode: 'create' }
  | { mode: 'rename'; item: DriveItem }
  | null;

export const DrivePage = () => {
  const drive = useDrive();
  const location = useLocation();
  const [formState, setFormState] = useState<FormState>(null);
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
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
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

      <DriveBreadcrumbs
        breadcrumbs={drive.breadcrumbs}
        onNavigate={drive.openFolder}
        movable
        onMoveItem={drive.moveItem}
      />

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

      <DriveForm
        open={formState?.mode === 'create'}
        title="Nueva carpeta"
        label="Nombre de la carpeta"
        confirmLabel="Crear"
        onClose={() => setFormState(null)}
        onSubmit={drive.createFolder}
      />

      <DriveForm
        open={formState?.mode === 'rename'}
        title="Renombrar"
        label="Nuevo nombre"
        confirmLabel="Guardar"
        initialValue={formState?.mode === 'rename' ? formState.item.name : ''}
        onClose={() => setFormState(null)}
        onSubmit={(name) => {
          if (formState?.mode === 'rename') drive.rename(formState.item.id, name);
        }}
      />

      <UploadFileModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={drive.uploadFile}
      />

      <AdvancedSearchModal
        open={advancedOpen}
        initialFilters={drive.advancedFilters}
        onClose={() => setAdvancedOpen(false)}
        onApply={drive.applyAdvancedFilters}
      />

      <ShareModal
        item={shareItem}
        onClose={() => setShareItem(null)}
        onSave={drive.saveShareSettings}
        getShareLink={drive.getShareLink}
      />

      <CreateContentModal
        kind={createContentKind}
        onClose={() => setCreateContentKind(null)}
        onSubmit={(name) => {
          if (createContentKind === 'document') drive.createDocument(name);
          if (createContentKind === 'spreadsheet') drive.createSpreadsheet(name);
        }}
      />

      <MoveItemModal
        item={moveItem}
        onClose={() => setMoveItem(null)}
        onMoved={drive.refresh}
      />

      <DriveDetail
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onToggleStar={(item) => {
          drive.toggleStar(item);
          setPreviewItem((current) => (current ? { ...current, isStarred: !current.isStarred } : current));
        }}
        onMoveToTrash={drive.moveToTrash}
      />
    </div>
  );
};
