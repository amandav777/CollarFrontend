import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from './AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext) || {};
  const router = useRouter();

  if (isAuthenticated === undefined) {
    // Exibe um indicador de carregamento enquanto verificamos a autenticação
    return <ActivityIndicator size="large" />;
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado, redirecione para a tela de login
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
