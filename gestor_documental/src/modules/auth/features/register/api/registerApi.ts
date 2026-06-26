import { readRegisteredUsers } from '../../login/api/loginApi';
import type { AuthAccount } from '../../login/types/login.types';

const REGISTERED_USERS_KEY = 'vault_registered_users';

export const saveRegisteredUser = (email: string, account: AuthAccount) => {
  const registeredUsers = readRegisteredUsers();
  registeredUsers[email] = account;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
};
