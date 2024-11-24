import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { updateUserData } from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import { useSearchParams } from "expo-router/build/hooks";

const SettingsScreen: React.FC = () => {
  const searchParams = useSearchParams();

  const [name, setName] = useState<string>(searchParams.get("name") || "");
  const [email, setEmail] = useState<string>(searchParams.get("email") || "");
  const [profilePicture, setProfilePicture] = useState<string | null>(
    searchParams.get("profilePicture") || null
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const updatedData: FormData = new FormData();

      if (name.trim() !== "") {
        updatedData.append("name", name);
      }
      if (email.trim() !== "") {
        updatedData.append("email", email);
      }

      // Enviar a imagem apenas se houver uma
      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1]; // Obtemos a extensão da imagem

        const file = {
          uri: imageUri,
          name: `profilePicture.${fileType}`,
          type: `image/${fileType}`,
        };

        updatedData.append("profilePicture", file);
      }

      // Verifique se há dados para atualizar antes de enviar
      if (updatedData.entries().next().done) {
        Alert.alert("Aviso", "Nenhum campo foi preenchido para atualização.");
        setIsSaving(false);
        return;
      }

      const updatedUser = await updateUserData(updatedData);

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("É necessário permissão para acessar a galeria.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Definindo a proporção da imagem
      quality: 1, // Qualidade da imagem
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
      setProfilePicture(pickerResult.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerText}>Configurações</Text>
        </TouchableOpacity>
      </View>

      {isSaving ? (
        // Mostra o indicador de carregamento enquanto os dados estão sendo salvos
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Salvando informações...</Text>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri: profilePicture || "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Alterar foto de perfil</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Digite seu nome"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
        />
      </View>

      {!isSaving && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "SanFransciscoBold",
    marginLeft: 10,
  },
  profileContainer: {
    marginTop: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoText: {
    color: "#1E90FF",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#007bff",
  },
});

export default SettingsScreen;
