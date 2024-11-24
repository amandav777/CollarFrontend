import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { createPost, pickImages } from "@/services/publicationService";
import StepIndicator from "@/components/StepIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function CreatePostScreen() {
  const [currentStep, setCurrentStep] = useState(1); 
  const [newPost, setNewPost] = useState({
    info: "",
    user: "",
    details: "",
    status: "publicado",
    images: [],
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePickImages = async () => {
    setIsLoading(true);
    try {
      const selectedImages = await pickImages(newPost.images);
      if (selectedImages && selectedImages.length > 0) {
        setNewPost((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...selectedImages].slice(0, 4),
        }));
      }
      setIsLoading(false);
    } catch (err) {
      setError("Erro ao selecionar imagens");
      setIsLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (newPost.details && newPost.info && newPost.images.length > 0) {
      const user = (await AsyncStorage.getItem("userId")) ?? "";
      const response = await createPost(newPost, user);

      if (response?.status === 201) {
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
        setCurrentStep(1);
        router.push("/feed");
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao criar a publicação.");
      }
    } else {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
    }
  };

  const removeImage = (index: number) => {
    setNewPost((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };

  const renderImageItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <View style={styles.imageWrapper}>
      <TouchableOpacity style={styles.image}>
        <Image source={{ uri: item }} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.containerNewPub}>
          <SafeAreaView />
          <StepIndicator currentStep={currentStep} totalSteps={2} />

          <Text style={styles.newPublicationText}>Nova Publicação</Text>

          {currentStep === 1 && (
            <View style={{ height: screenHeight, flex: 1, marginTop: 30 }}>
              <Text style={styles.imagesHeader}>Imagens:</Text>
              <View style={styles.carouselContainer}>
                {newPost.images.length > 0 ? (
                  <>
                    <FlatList
                      data={newPost.images}
                      horizontal
                      renderItem={renderImageItem}
                      keyExtractor={(_, index) => index.toString()}
                      pagingEnabled={true}
                      style={{ width: screenWidth - 40 }}
                      showsHorizontalScrollIndicator={false}
                    />
                  </>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={50} color="gray" />
                    <Text
                      style={{
                        color: "#696969",
                        marginTop: 10,
                        fontFamily: "SanFransciscoSemibold",
                      }}
                    >
                      Nenhuma imagem selecionada
                    </Text>
                  </View>
                )}
                {isLoading && (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{
                      position: "absolute",
                      top: "50%",
                      borderRadius: 40,
                      backgroundColor: "rgb(255,255,255)",
                      padding: 10,
                    }}
                  />
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Text
                  style={{
                    fontFamily: "SanFransciscoMedium",
                    color: "#D6D6D6",
                    marginTop: 10,
                  }}
                >
                  {newPost.images.length}/4
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handlePickImages}
                >
                  <Ionicons name="images" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  newPost.images.length === 0 && { opacity: 0.5 },
                ]}
                onPress={() => setCurrentStep(2)}
                disabled={newPost.images.length === 0}
              >
                <Ionicons name="arrow-forward" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Passo 2: Preenchimento de Dados */}
          {currentStep === 2 && (
            <>
              <View
                style={{
                  height: screenHeight,
                  flex: 1,
                  marginTop: 50,
                  marginHorizontal: 20,
                }}
              >
                <Text style={styles.label}>Situação do animal:</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      newPost.status === "Animal perdido" &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setNewPost({ ...newPost, status: "Animal perdido" })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        newPost.status === "Animal perdido" &&
                          styles.optionButtonTextActive,
                      ]}
                    >
                      Animal perdido
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      newPost.status === "Para adoção" &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() =>
                      setNewPost({ ...newPost, status: "Para adoção" })
                    }
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        newPost.status === "Para adoção" &&
                          styles.optionButtonTextActive,
                      ]}
                    >
                      Para adoção
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Detalhes:</Text>
                <TextInput
                  style={styles.input}
                  value={newPost.details}
                  onChangeText={(text) =>
                    setNewPost({ ...newPost, details: text })
                  }
                  placeholder="Informe os detalhes para publicação"
                />

                <Text style={styles.label}>Informações para contato:</Text>
                <TextInput
                  style={styles.input}
                  value={newPost.info}
                  onChangeText={(text) =>
                    setNewPost({ ...newPost, info: text })
                  }
                  placeholder="Digite o nome do usuário"
                />
              </View>
              <TouchableOpacity
                style={styles.prevButton}
                onPress={() => setCurrentStep(1)}
              >
                <Ionicons name="arrow-back" size={24} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPub}
                onPress={handleSavePost}
              >
                <Text style={styles.buttonText}>Publicar</Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  newPublicationText: {
    fontFamily: "SanFransciscoBold",
    fontSize: 20,
    textAlign: "left",
    marginHorizontal: 20,
    color: "#313131",
    marginTop: 20,
  },

  carouselContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  flatListContent: {
    paddingHorizontal: screenWidth * 0.1,
    alignItems: "center",
    flexGrow: 1,
    flexDirection: "row",
  },
  imageWrapper: {
    flexDirection: "row",
    gap: 10,
    width: screenWidth - 50,
    height: screenWidth - 50,
    borderRadius: 10,
  },
  image: {
    width: screenWidth - 50,
    height: screenWidth - 50,
    borderRadius: 10,
    zIndex: 2,
  },
  imagesHeader: {
    marginHorizontal: 20,
    fontFamily: "SanFransciscoSemibold",
    fontSize: 14,
    textAlign: "left",
    color: "gray",
  },
  containerNewPub: {
    flex: 1,
    backgroundColor: "#fff",
    height: screenHeight,
  },

  flatList: {
    flexDirection: "row",
    flexGrow: 1,
  },
  carouselContent: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,0,0,0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  placeholderContainer: {
    borderRadius: 15,
    backgroundColor: "#F2F2F2",
    width: screenWidth - 50,
    height: screenWidth - 50,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageButton: {
    backgroundColor: "#D94509",
    padding: 10,
    borderRadius: 100,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forms: {
    height: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  prevButton: {
    position: "absolute",
    top: "70%",
    left: "10%",
    width: 40,
    height: 40,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  nextButton: {
    position: "absolute",
    top: "67%",
    right: "10%",
    width: 40,
    height: 40,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    borderRadius: 100,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonPub: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: "70%",
    right: "10%",
    backgroundColor: "#D94509",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  optionButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  optionButtonTextActive: {
    color: "#fff",
  },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 8,
  //   padding: 10,
  //   marginBottom: 20,
  // },
});
