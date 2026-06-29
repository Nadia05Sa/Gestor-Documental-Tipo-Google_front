import { favoritesApi } from '../api/favoritesApi';
import { useDriveItemCollection } from '../../drive/hooks/useDriveItemCollection';

export const useFavorites = () =>
  useDriveItemCollection({
    api: favoritesApi,
    getToggleStarMessage: () => 'Eliminado de destacados',
    openFolder: 'navigate-drive',
    closePreviewOnToggleStar: true,
  });
