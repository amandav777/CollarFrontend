import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { login } from "@/services/authService";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation error", "Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      router.push("/feed");
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error.message === "Request timed out"
          ? "The request took too long, please try again."
          : "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerLogin}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          style={[styles.input, email ? styles.inputFocused : {}]}
          placeholder="Email"
          value={email}
          placeholderTextColor="#D94509"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, password ? styles.inputFocused : {}]}
          placeholder="Password"
          value={password}
          placeholderTextColor="#D94509"
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF3E1",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#D94509",
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderColor: "#D94509",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFF3E1",
    color: "#D94509",
  },
  inputFocused: {
    borderColor: "#FF6A2E",
    backgroundColor: "#FFCFBB",
  },
  button: {
    backgroundColor: "#E9622C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#E9622C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#FF9900",
  },
});

export default LoginScreen;
