import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import AuthProvider from "@/app/AuthContext";
import { useAuth } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SanFransciscoRegular: require("../assets/fonts/SFUIDisplay-Regular.otf"),
    SanFransciscoBlack: require("../assets/fonts/SFUIDisplay-Black.otf"),
    SanFransciscoBold: require("../assets/fonts/SFUIDisplay-Bold.ttf"),
    SanFransciscoHeavy: require("../assets/fonts/SFUIDisplay-Heavy.otf"),
    SanFransciscoMedium: require("../assets/fonts/SFUIDisplay-Medium.otf"),
    SanFransciscoSemibold: require("../assets/fonts/SFUIDisplay-Semibold.otf"),
    SanFransciscoThin: require("../assets/fonts/SFUIDisplay-Thin.otf"),
  });

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  }, [loaded, loading]);

  // Redirecionamento com base no estado de autenticação
  useEffect(() => {
    if (isAppReady) {
      if (isAuthenticated) {
        router.replace("/(tabs)/feed");
      } else {
        router.replace("/login");
      }
    }
  }, [isAppReady, isAuthenticated, router]);

  if (!isAppReady || loading) {
    return null; // Ou uma tela de splash pode ser mostrada
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          {/* Definindo a tela de login como a tela inicial se o usuário não estiver autenticado */}
          <Stack.Screen
            name="login"
            options={{ headerShown: false, gestureEnabled: false }}
          />

          {/* Tela principal (tabs) carregada somente após a autenticação */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="person" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="postDetails" options={{ headerShown: false }} />
          <Stack.Screen
            name="likedPublications"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
