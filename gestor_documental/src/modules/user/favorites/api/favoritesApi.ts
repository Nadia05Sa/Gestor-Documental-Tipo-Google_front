import { driveApi } from '../../drive/api/driveApi';

/**
 * API de Favoritos. Reutiliza el store del Drive filtrando por `isStarred`.
 * Backend objetivo: tabla `item_favorites` (ver `.docs/05-modules/user/sidebar-views.md`).
 */
export const favoritesApi = {
  list: () => driveApi.listStarred(),
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
