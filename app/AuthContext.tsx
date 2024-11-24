import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");
        if (token && storedUserId) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        console.error("Falha ao verificar autenticação:", error);
      }
    };
    checkAuth();
  }, []);

  const login = async (token: string, userId: string) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", userId);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setUserId(null);
    } catch (error) {
      console.error("Falha no logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
