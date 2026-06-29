import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type DriveSearchContextValue = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const DriveSearchContext = createContext<DriveSearchContextValue | null>(null);

export const DriveSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery }),
    [searchQuery],
  );

  return <DriveSearchContext.Provider value={value}>{children}</DriveSearchContext.Provider>;
};

export const useDriveSearch = () => useContext(DriveSearchContext);
