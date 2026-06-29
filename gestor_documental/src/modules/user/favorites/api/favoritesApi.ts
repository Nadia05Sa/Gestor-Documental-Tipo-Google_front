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
};
