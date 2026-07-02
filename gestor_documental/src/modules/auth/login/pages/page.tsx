import { useEffect, useState, type FormEvent } from 'react';

import { useLogin } from '../hooks/useLogin';

import { setupAuthPage } from '@shared/utils/authTheme';

import { AuthSplitTemplate } from '@shared/components/templates/AuthSplitTemplate';

import { LoginForm } from '../organisms/LoginForm';

import { LoginPromoPanel } from '../organisms/LoginPromoPanel';



export const Login = () => {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [rememberMe, setRememberMe] = useState(false);

  const { loading, error, loginUser } = useLogin();



  useEffect(() => {

    setupAuthPage();

  }, []);



  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    await loginUser(email, password);

  };



  return (

    <AuthSplitTemplate promo={<LoginPromoPanel />}>

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

    </AuthSplitTemplate>

  );

};

