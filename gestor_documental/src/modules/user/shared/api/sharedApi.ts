import { driveApi } from '../../drive/api/driveApi';

/**
 * API de "Compartidos conmigo". Reutiliza el store del Drive filtrando por
 * `isShared`. Backend objetivo: `item_permissions`
 * (ver `.docs/05-modules/user/sharing-permissions.md`).
 */
export const sharedApi = {
  list: () => driveApi.listShared(),
  toggleStar: (id: string) => driveApi.toggleStar(id),
  touchRecent: (id: string) => driveApi.touchRecent(id),
  moveToTrash: (id: string) => driveApi.moveToTrash(id),
};
