import { useEffect, useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { INTER_STYLE, setupAuthPage } from '@shared/utils/authTheme';
import { LoginForm } from '../components/LoginForm';
import { LoginPromoPanel } from '../components/LoginPromoPanel';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, error, loginUser } = useLogin();

  useEffect(() => {
    setupAuthPage();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await loginUser(email, password);
  };

  return (
    <div className="flex min-h-screen w-full" style={INTER_STYLE}>
      <div className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <LoginForm
          email={email}
          password={password}
          rememberMe={rememberMe}
          error={error}
          loading={loading}
          onEmailChange={(event) => setEmail(event.target.value)}
          onPasswordChange={(event) => setPassword(event.target.value)}
          onRememberMeChange={(event) => setRememberMe(event.target.checked)}
          onSubmit={handleSubmit}
        />
      </div>
      <LoginPromoPanel />
    </div>
  );
};
