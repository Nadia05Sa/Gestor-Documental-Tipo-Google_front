import { sharedApi } from '../api/sharedApi';
import { useDriveItemCollection } from '../../drive/hooks/useDriveItemCollection';

export const useShared = () =>
  useDriveItemCollection({
    api: sharedApi,
    getToggleStarMessage: (item) =>
      item.isStarred ? 'Eliminado de destacados' : 'Añadido a destacados',
    openFolder: 'navigate-drive',
  });
