import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { register } from "@/services/authService";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const router = useRouter();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Registration failed", "Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePicture) {
        const fileName = profilePicture.split("/").pop() || "profile.jpg";
        formData.append("profilePicture", {
          uri: profilePicture,
          name: fileName,
          type: "image/jpeg",
        } as any); // Para corrigir tipos
      }

      await register(formData);
      Alert.alert("Success", "Registration successful. Please log in.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Registration failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePickerText}>Pick Profile Picture</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#007BFF",
  },
  imagePicker: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  imagePickerText: {
    color: "#888",
    textAlign: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});

export default RegisterScreen;
