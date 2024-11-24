import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import Carousel from "react-native-snap-carousel"; // Importando o carrossel

const PostDetailsScreen = () => {
  const searchParams = useSearchParams();
  const [id, setId] = useState<string>(searchParams.get("id") || "");
  const [title, setTitle] = useState<string>(searchParams.get("title") || "");
  const [description, setDescription] = useState<string>(
    searchParams.get("description") || ""
  );
  const [contactInfos, setContactInfos] = useState<string>(
    searchParams.get("contactInfos") || ""
  );
  const [imageUrl, setImageUrl] = useState<string[]>(
    searchParams.get("images")?.split(",") || []
  );
  const [createdAt, setCreatedAt] = useState<string>(
    searchParams.get("createdAt") || ""
  );
  const [location, setLocation] = useState<string>(
    searchParams.get("location") || ""
  );
  const [likes, setLikes] = useState<number>(
    parseInt(searchParams.get("likeCount") || "0")
  );

  const handleLike = () => {
    setLikes(likes + 1);
  };

  // Função para renderizar cada item do carrossel
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <Image key={index} source={{ uri: item }} style={styles.carouselImage} />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
      >
        {imageUrl.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>
      <View style={styles.detailsContainer}>
        {/* Título */}
        <Text style={styles.title}>{title}</Text>

        {/* Informações sobre data e local */}
        <View style={styles.metaContainer}>
          <Text style={styles.date}>
            Publicado em {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.location}>Localização: {location}</Text>
        </View>

        {/* Descrição */}
        <Text style={styles.description}>{description}</Text>

        {/* Informações de contato */}
        {contactInfos && (
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Contato:</Text>
            <Text style={styles.contact}>{contactInfos}</Text>
          </View>
        )}

        {/* Likes */}
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likes}>👍 {likes} Likes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  detailsContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  metaContainer: {
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  location: {
    fontSize: 16,
    color: "#444",
    fontStyle: "italic",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    color: "#555",
  },
  likeButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  likes: {
    fontSize: 18,
    color: "#ff6347",
    fontWeight: "bold",
  },
  carouselContainer: {
    // marginBottom: 20,
  },
  carouselImage: {
    width: 300,
    height: 300,
    borderRadius: 5,
    // marginRight: 12,
    // marginBottom: 16,
  },
});

export default PostDetailsScreen;
