import type { Dispatch, SetStateAction } from 'react';
import { MoveItemModal } from '@shared/domain/drive/organisms/MoveItemModal';
import type {
  AdvancedSearchFilters,
  DriveItem,
  PermissionLevel,
  ShareAccess,
} from '../types/drive.types';
import { AdvancedSearchModal } from './AdvancedSearchModal';
import { CreateContentModal, type CreateContentKind } from './CreateContentModal';
import { DriveDetail } from './DriveDetail';
import { DriveForm } from './DriveForm';
import { ShareModal } from './ShareModal';
import { UploadFileModal } from './UploadFileModal';

export type DriveFormState =
  | { mode: 'create' }
  | { mode: 'rename'; item: DriveItem }
  | null;

type DrivePageModalsProps = {
  formState: DriveFormState;
  setFormState: Dispatch<SetStateAction<DriveFormState>>;
  uploadOpen: boolean;
  setUploadOpen: Dispatch<SetStateAction<boolean>>;
  advancedOpen: boolean;
  setAdvancedOpen: Dispatch<SetStateAction<boolean>>;
  previewItem: DriveItem | null;
  setPreviewItem: Dispatch<SetStateAction<DriveItem | null>>;
  shareItem: DriveItem | null;
  setShareItem: Dispatch<SetStateAction<DriveItem | null>>;
  createContentKind: CreateContentKind | null;
  setCreateContentKind: Dispatch<SetStateAction<CreateContentKind | null>>;
  moveItem: DriveItem | null;
  setMoveItem: Dispatch<SetStateAction<DriveItem | null>>;
  advancedFilters: AdvancedSearchFilters;
  onCreateFolder: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onUploadFile: (name: string, size: number) => void;
  onApplyAdvancedFilters: (filters: AdvancedSearchFilters) => void;
  onRefresh: () => void;
  onToggleStar: (item: DriveItem) => void;
  onMoveToTrash: (item: DriveItem) => void;
  onCreateDocument: (name: string) => void;
  onCreateSpreadsheet: (name: string) => void;
  saveShareSettings: (
    itemId: string,
    settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel },
  ) => void;
  getShareLink: (itemId: string) => string;
};

export const DrivePageModals = ({
  formState,
  setFormState,
  uploadOpen,
  setUploadOpen,
  advancedOpen,
  setAdvancedOpen,
  previewItem,
  setPreviewItem,
  shareItem,
  setShareItem,
  createContentKind,
  setCreateContentKind,
  moveItem,
  setMoveItem,
  advancedFilters,
  onCreateFolder,
  onRename,
  onUploadFile,
  onApplyAdvancedFilters,
  onRefresh,
  onToggleStar,
  onMoveToTrash,
  onCreateDocument,
  onCreateSpreadsheet,
  saveShareSettings,
  getShareLink,
}: DrivePageModalsProps) => (
  <>
    <DriveForm
      open={formState?.mode === 'create'}
      title="Nueva carpeta"
      label="Nombre de la carpeta"
      confirmLabel="Crear"
      onClose={() => setFormState(null)}
      onSubmit={onCreateFolder}
    />

    <DriveForm
      open={formState?.mode === 'rename'}
      title="Renombrar"
      label="Nuevo nombre"
      confirmLabel="Guardar"
      initialValue={formState?.mode === 'rename' ? formState.item.name : ''}
      onClose={() => setFormState(null)}
      onSubmit={(name) => {
        if (formState?.mode === 'rename') onRename(formState.item.id, name);
      }}
    />

    <UploadFileModal
      open={uploadOpen}
      onClose={() => setUploadOpen(false)}
      onUpload={onUploadFile}
    />

    <AdvancedSearchModal
      open={advancedOpen}
      initialFilters={advancedFilters}
      onClose={() => setAdvancedOpen(false)}
      onApply={onApplyAdvancedFilters}
    />

    <ShareModal
      item={shareItem}
      onClose={() => setShareItem(null)}
      onSave={saveShareSettings}
      getShareLink={getShareLink}
    />

    <CreateContentModal
      kind={createContentKind}
      onClose={() => setCreateContentKind(null)}
      onSubmit={(name) => {
        if (createContentKind === 'document') onCreateDocument(name);
        if (createContentKind === 'spreadsheet') onCreateSpreadsheet(name);
      }}
    />

    <MoveItemModal
      item={moveItem}
      onClose={() => setMoveItem(null)}
      onMoved={onRefresh}
    />

    <DriveDetail
      item={previewItem}
      onClose={() => setPreviewItem(null)}
      onToggleStar={(item) => {
        onToggleStar(item);
        setPreviewItem((current) => (current ? { ...current, isStarred: !current.isStarred } : current));
      }}
      onMoveToTrash={onMoveToTrash}
    />
  </>
);
