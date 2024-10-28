import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewPost } from "@/interfaces/newPost";
import { createPost, pickImages } from "@/services/publicationService";

export default function CreatePostScreen() {
  const [newPost, setNewPost] = useState<NewPost>({
    info: "",
    user: "",
    details: "",
    status: "publicado",
    images: [],
    location: "",
  });

  const handleTitleChange = (text: string) => {
    setNewPost({ ...newPost, details: text });
  };

  const handleInfoChange = (text: string) => {
    setNewPost({ ...newPost, info: text });
  };

  const handleStatusChange = (text: string) => {
    setNewPost({ ...newPost, status: text });
  };

  const handlePickImages = async () => {
    const selectedImages = await pickImages(newPost.images);
    if (selectedImages) {
      setNewPost((prevState: any) => ({
        ...prevState,
        images: selectedImages,
      }));
    }
  };

  const removeImage = (index: number) => {
    setNewPost((prevState: any) => ({
      ...prevState,
      images: prevState.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSavePost = async () => {
    if (newPost.details && newPost.info && newPost.images.length > 0) {
      const user = (await AsyncStorage.getItem("userId")) ?? "";
      const response = await createPost(newPost, user);

      if (response.ok) {
        Alert.alert(
          "Publicação Criada",
          "Sua publicação foi criada com sucesso!"
        );
        setNewPost({
          details: "",
          user: "",
          info: "",
          status: "publicado",
          images: [],
          location: "",
        });
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao criar a publicação.");
      }
    } else {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Nova publicação</Text>

          <Text style={styles.label}>Imagens (até 4):</Text>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handlePickImages}
          >
            <Text style={styles.imageButtonText}>Escolher Imagens</Text>
          </TouchableOpacity>

          <View style={styles.imagePreviewContainer}>
            {newPost.images.map(
              (imageUri: any, index: React.Key | null | any) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>

          <Text style={styles.label}>Situação do animal:</Text>
          <TextInput
            style={styles.input}
            value={newPost.status}
            onChangeText={handleStatusChange}
            placeholder="Animal perdido"
          />

          <Text style={styles.label}>Detalhes:</Text>
          <TextInput
            style={styles.input}
            value={newPost.details}
            onChangeText={handleTitleChange}
            placeholder="Informe os detalhes para publicação"
          />

          <Text style={styles.label}>Informações para contato:</Text>
          <TextInput
            style={styles.input}
            value={newPost.info}
            onChangeText={handleInfoChange}
            placeholder="Digite o nome do usuário"
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.buttonPub} onPress={handleSavePost}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
  label: {
    color: "gray",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: "#D94509",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#ff0000",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonPub: {
    backgroundColor: "#D94509",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
