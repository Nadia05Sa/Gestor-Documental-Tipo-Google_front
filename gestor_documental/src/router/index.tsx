import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { AppNotFoundScreen } from '@shared/pages/AppNotFoundScreen';
import { AuthRoutes } from './AuthRoutes';
import { AppRoutes } from './AppRoutes';
import { AdminRoutes } from './AdminRoutes';

const NotFoundRoute = () => {
  const navigate = useNavigate();

  return (
    <AppNotFoundScreen
      buttonLabel="Ir al inicio"
      onButtonClick={() => navigate('/', { replace: true })}
    />
  );
};

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {AuthRoutes}
      {AppRoutes}
      {AdminRoutes}
      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  </BrowserRouter>
);
