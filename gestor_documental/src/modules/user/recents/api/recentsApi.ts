import { driveApi } from '../../drive/api/driveApi';

/**
 * API de Recientes. Reutiliza el store del Drive ordenando por `visitedAt`.
 * Backend objetivo: tabla `item_recents` (ver `.docs/05-modules/user/sidebar-views.md`).
 */
export const recentsApi = {
  list: () => driveApi.listRecents(),
  toggleStar: (id: string) => driveApi.toggleStar(id),
  touchRecent: (id: string) => driveApi.touchRecent(id),
  moveToTrash: (id: string) => driveApi.moveToTrash(id),
  rename: (id: string, name: string) => driveApi.rename(id, name),
  updateShareSettings: (
    id: string,
    settings: Parameters<typeof driveApi.updateShareSettings>[1],
  ) => driveApi.updateShareSettings(id, settings),
  getShareLink: (id: string) => driveApi.getShareLink(id),
  listVersionHistory: (id: string) => driveApi.listVersionHistory(id),
  restoreVersion: (id: string) => driveApi.restoreVersion(id),
};
