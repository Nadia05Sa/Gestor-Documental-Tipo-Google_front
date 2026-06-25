export const getHomePathByRole = (role) => {
  const normalizedRole = String(role || '').toLowerCase();
  return normalizedRole.includes('admin') ? '/admin' : '/usuario';
};
