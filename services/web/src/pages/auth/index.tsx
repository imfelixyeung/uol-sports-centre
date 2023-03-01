import React from 'react';
import {useAuth} from '~/providers/auth/hooks/useAuth';

const AuthPage = () => {
  const auth = useAuth();
  return (
    <div>
      <pre>
        <code>{JSON.stringify(auth, null, 2)}</code>
      </pre>
    </div>
  );
};

export default AuthPage;
