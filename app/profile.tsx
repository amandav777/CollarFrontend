import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { fetchUserData } from "@/services/userService";
import LogoutButton from "@/components/LogoutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Hook para detectar foco na tela
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

type UserProps = {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
};

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userId = 1; // Substitua com lógica para buscar o ID do usuário autenticado
      const data: UserProps = await fetchUserData(userId);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza os dados sempre que a tela ganhar o foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleSettings = () => {
    if (userData) {
      router.push({
        pathname: "/settings",
        params: {
          name: userData.name,
          email: userData.email,
          profilePicture: userData.profilePicture,
        },
      });
    }
  };

  const likedPosts = () => {
    if (userData) {
      router.push({
        pathname: "/likedPublications",
        params: {
          userId: userData.id
        },
      });
    }
  };

  const backRoute = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={backRoute}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text style={styles.perfil}>Perfil</Text>
      </TouchableOpacity>
      <SafeAreaView>
        <View style={styles.header}>
          {userData?.profilePicture ? (
            <Image
              source={{
                uri: userData.profilePicture || "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />
          ) : (
            <ActivityIndicator />
          )}
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={likedPosts}>
            <Ionicons name="heart" size={20} color="red" />
            <Text style={styles.buttonTextHeart}>Publicações curtidas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Ionicons name="pencil-outline" size={20} color="gray" />
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <LogoutButton />
        </View>
      </SafeAreaView>
    </View>
  );
};

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  perfil: { fontFamily: "SanFransciscoBold", fontSize: 24 },
  backButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    top: "5%",
    left: "5%",
  },
  container: {
    height: screenHeight,
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "white",
  },
  profileImage: {
    borderWidth:1,
    borderColor: "gray",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontFamily: "SanFransciscoSemibold",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: "70%",
  },
  email: {
    marginTop: 10,
    fontSize: 16,
    color: "#696969",
  },
  buttonsContainer: {
    marginTop: 50,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "gray",
    fontFamily: "SanFransciscoSemibold",
    fontSize: 18,
    marginLeft: 10,
  },
  buttonTextHeart: {
    color: "gray",
    fontFamily: "SanFransciscoSemibold",
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4500",
  },
});

export default ProfileScreen;
