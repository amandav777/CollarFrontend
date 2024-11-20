import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import SearchBar from "@/components/SearchBar";
import {
  fetchPublications,
  searchPublications,
  PublicationData,
} from "@/services/publicationService";

export default function ExploreScreen() {
  const [posts, setPosts] = useState<PublicationData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Função para buscar publicações do backend
  const loadPublications = async () => {
    setLoading(true);
    const controller = new AbortController(); // Criando o AbortController
    try {
      const data = await fetchPublications(controller);
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Erro ao buscar publicações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  const handleSearch = async (query: string) => {
    if (query === "") {
      setFilteredPosts(posts);
    } else {
      setLoading(true);
      try {
        const data = await searchPublications(query);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Erro na busca:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPost = ({ item }: { item: PublicationData }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{item.description}</Text>
        <Text style={styles.postUser}>{item.user.name}</Text>
        <Text style={styles.postLikeCount}>{item.likeCount} curtidas</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} data={[]} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 10,
  },
  postContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  postDetails: {
    marginLeft: 10,
    justifyContent: "center",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postUser: {
    fontSize: 14,
    color: "#666",
  },
  postLikeCount: {
    fontSize: 12,
    color: "#999",
  },
});
