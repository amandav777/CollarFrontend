import React from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const router = useRouter(); // Hook para navegação no expo-router

  const handleProfilePress = () => {
    router.push("/profile"); // Navega para a rota "/profile"
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/LogoEscrita.png")}
          style={styles.reactLogo}
        />
        <View />
        <TouchableOpacity onPress={handleProfilePress}>
          <Ionicons name="person" size={24} color="#FF8E2E" />
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingHorizontal: 20,
  },
  reactLogo: {
    height: 26,
    width: 100,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 15,
  },
});
