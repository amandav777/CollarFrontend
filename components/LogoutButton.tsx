import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/app/AuthContext';

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext) || {};
  const router = useRouter();

  const handleLogout = async () => {
    if (logout) {
      await logout();
      // Navegue de volta para a tela de login
      router.push('/login');
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
