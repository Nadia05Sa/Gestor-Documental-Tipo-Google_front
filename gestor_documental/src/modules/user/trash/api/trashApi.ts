import { driveApi } from '../../drive/api/driveApi';

/**
 * API de la Papelera. Reutiliza el store del Drive filtrando por `isDeleted`.
 * Backend objetivo: `drive_items` + `drive_trash_details`
 * (ver `.docs/05-modules/user/sidebar-views.md`).
 */
export const trashApi = {
  list: () => driveApi.listTrash(),
  restore: (id: string) => driveApi.restore(id),
  deletePermanent: (id: string) => driveApi.deletePermanent(id),
  emptyTrash: () => driveApi.emptyTrash(),
  retentionDays: () => driveApi.getTrashRetentionDays(),
};
