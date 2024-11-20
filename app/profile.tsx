import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserData } from "@/services/userService";
import LogoutButton from "@/components/LogoutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type UserProps = {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
};

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error("Error getting userId from AsyncStorage:", error);
      }
    };

    const fetchData = async () => {
      if (userId === null) return;
      try {
        const data: UserProps = await fetchUserData(userId);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserId();
    fetchData();
  }, [userId]);

  const handleSettings = () => {
    Alert.alert("Configurações", "Tela de configurações.");
  };

  const backRoute = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <TouchableOpacity style={styles.backButton} onPress={backRoute}>
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={styles.perfil}>Perfil</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Image
            source={{ uri: userData?.profilePicture }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Configurações</Text>
          </TouchableOpacity>
          <LogoutButton />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  perfil: { fontFamily: "SanFransciscoBold", fontSize: 24 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 10,top:"-5%" },
  container: {
    // alignItems: "center",
    height:"100%",
    // marginTop: 20,
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor:"white"
  },
  profileImage: {
    marginTop:50,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontFamily: "SanFransciscoSemibold",
    fontSize: 24,
    fontWeight: "bold",
    textAlign:"center",
    width:"70%",
  },
  email: {
    marginTop:10,
    fontSize: 16,
    color: "#696969",
  },
  phone: {
    fontSize: 16,
    color: "#696969",
    marginTop: 5,
  },
  buttonsContainer: {
    marginTop: 100,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "SanFransciscoSemibold",

    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#FF4500",
  },
});

export default ProfileScreen;
