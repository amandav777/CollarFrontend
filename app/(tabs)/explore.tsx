import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import SearchBar from '@/components/SearchBar'; // Supondo que você já tenha este componente de barra de pesquisa
import axios from 'axios';

interface Post {
  id: number;
  description: string;
  images: string[];
  user: {
    username: string;
  };
  likeCount: number;
  status: string;
}

export default function TabTwoScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Função para buscar publicações do backend
  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/publications`);
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleSearch = async (query: string) => {
    if (query === '') {
      setFilteredPosts(posts);
    } else {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/publications/search?q=${query}`);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{item.description}</Text>
        <Text style={styles.postUser}>{item.user.username}</Text>
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
    backgroundColor: '#fff',
  },
  list: {
    padding: 10,
  },
  postContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
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
    justifyContent: 'center',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postUser: {
    fontSize: 14,
    color: '#666',
  },
  postLikeCount: {
    fontSize: 12,
    color: '#999',
  },
});
