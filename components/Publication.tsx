import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PublicationProps = {
  id: number;
  description: string;
  images: string[];
  status: string;
  user: {
    name: string;
    id: number;
    profilePicture: string;
  };
  contactInfos: any,
  likes: any;
  location: string;
  createdAt: string;
};

const { width } = Dimensions.get("window");

const Publication: React.FC<PublicationProps> = ({
  id,
  description,
  images,
  status,
  user,
  contactInfos,
  createdAt,
  location,
  likes,
}) => {
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(likes || 0);
  const [lastPress, setLastPress] = useState<number | null | NodeJS.Timeout>(
    null
  );
  const [animation] = useState(new Animated.Value(0));
  const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);
  const router = useRouter();
  const userId = user.id;
  const timeAgo = formatDistanceToNow(parseISO(createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  useEffect(() => {
    if (lastPress) {
      clearTimeout(lastPress);
    }
    const checkLikeStatus = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");

      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/publications/${id}/likes?userId=${storedUserId}`
        );

        if (response.status === 200 && response.data.liked) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error("Erro ao carregar o status do like:", error);
      }
    };

    checkLikeStatus();
  }, [id, lastPress]);

  const handleNavigateToDetails = () => {
    router.push({
      pathname: "/postDetails",
      params: {
        id: id,
        description: description,
        images: images,
        status: status,
        contactInfos: contactInfos,
        createdAt: createdAt,
        location: location,
        likes: likeCount,
      },
    });
  };

  const handleLike = async () => {
    const storedUserId = await AsyncStorage.getItem("userId");
    const newLikeStatus = !liked;
    const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/publications/like`,
        {
          publicationId: id,
          userId: Number(storedUserId),
        }
      );

      if (response.status === 200 || response.status === 201) {
        setLiked(newLikeStatus);
        setLikeCount(newLikeCount);

        setShowHeart(true);
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => setShowHeart(false));
      } else {
        console.error("Erro ao atualizar o like no servidor:", response.status);
      }
    } catch (error) {
      console.error("Erro ao atualizar o like:", error);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();

    if (lastPress) {
      const lastPressNumber = lastPress as number;
      if (now - lastPressNumber < 300) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        handleLike();
      } else {
        timeoutRef.current = setTimeout(() => {
          handleNavigateToDetails();
        }, 300);
      }
    }

    setLastPress(now);
  };

  const renderImage = ({ item }: { item: string }) => (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item }}
          style={styles.image}
          resizeMode="center"
        />
        {showHeart && (
          <Animated.View
            style={[
              styles.heartContainer,
              {
                opacity: animation,
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Ionicons name="heart" size={60} color="white" />
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.containerPub}>
      <View>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            router.push({ pathname: "/person", params: { userId } });
          }}
        >
          <Image
            source={{
              uri: user?.profilePicture || "https://via.placeholder.com/30",
            }}
            style={styles.profileImage}
          />
          <View style={styles.headerContainer}>
            <View>
              <Text
                style={styles.headTittle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.name}
              </Text>
              <Text style={styles.status}>{status}</Text>
            </View>
            <Text style={styles.cityText}>{location}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.images}
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
      />
      <View style={styles.imageCountContainer}>
        <Text style={styles.imageCountText}>{images.length}</Text>
        <Ionicons name="image" size={20} color="white" />
      </View>
      <View style={styles.actionsContainer}>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {description}{" "}
        </Text>
        <View style={styles.actionButton}>
          <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "red" : "black"}
            />
            <Text
              style={{
                fontWeight: "bold",
                color: "#3D3D3D",
                fontFamily: "SanFransciscoSemibold",
              }}
            >
              {likeCount} curtidas
            </Text>
          </TouchableOpacity>
          <Text style={styles.hours}>{timeAgo} </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerPub: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#f0f0f0",
  },
  headTittle: {
    maxWidth: 150,
    fontFamily: "SanFransciscoBold",
    color: "#3D3D3D",
  },
  status: { fontFamily: "SanFransciscoMedium", color: "#3D3D3D" },
  actionButton: {
    width: "100%",
    flexDirection: "row",
    paddingBottom: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width - 60,
    height: 360,
  },
  description: {
    width: "100%",
    margin: 5,
    paddingHorizontal: 15,
    paddingTop: 5,
    borderRadius: 10,
    fontWeight: "600",
    color: "#3D3D3D",
    fontFamily: "SanFransciscoMedium",
  },
  heartContainer: {
    position: "absolute",
    top: "30%",
    left: "45%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  actionsContainer: {
    position: "absolute",
    top: "82%",
    width: "95%",
    marginHorizontal: 9,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  iconButton: {
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    padding: 1,
    alignItems: "center",
  },
  hours: {
    color: "#3D3D3D",
    paddingHorizontal: 7,
    paddingVertical: 5,
    fontWeight: "600",
    fontFamily: "SanFransciscoMedium",
    borderRadius: 10,
  },
  images: {
    borderTopColor: "#F3F3F3",
    borderTopWidth: 1,
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
    width: "100%",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  text: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  imageCountContainer: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  imageCountText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  cityText: {
    marginTop: 5,
    color: "#696969",
    fontFamily: "SanFransciscoMedium",
  },
  headerContainer: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Publication;
