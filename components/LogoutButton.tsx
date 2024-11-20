import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/app/AuthContext";
import { Ionicons } from "@expo/vector-icons";


const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext) || {};
  const router = useRouter();

  const handleLogout = async () => {
    if (logout) {
      await logout();
      // Navegue de volta para a tela de login
      router.push("/login");
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, styles.logoutButton]}
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={20} color="#fff" />
      <Text style={styles.buttonText}>Sair</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    fontFamily: 'SanFransciscoSemibold', 
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4500",
  },
});

export default LogoutButton;
