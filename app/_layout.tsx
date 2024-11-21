import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import 'react-native-reanimated';

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
    // SanFransciscoLigth:require('../assets/fonts/SFUIDisplay-Ligth.ttf'),
    SanFransciscoMedium: require("../assets/fonts/SFUIDisplay-Medium.otf"),
    SanFransciscoSemibold: require("../assets/fonts/SFUIDisplay-Semibold.otf"),
    SanFransciscoThin: require("../assets/fonts/SFUIDisplay-Thin.otf"),
  });

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }
  }, [loaded, loading, isAuthenticated, router]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="person" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
