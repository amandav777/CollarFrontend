import { StyleSheet, View, FlatList, Text, Image } from 'react-native';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

// Definindo a estrutura de cada Post
interface Post {
  id: string;
  title: string;
  image: string;
  user: string;
  status: string;  // Novo campo de status
}

export default function TabTwoScreen() {
  const allPosts: Post[] = [
    { id: '1', title: 'Caminhada no Parque', image: 'https://via.placeholder.com/150', user: 'User1', status: 'Publicado' },
    { id: '2', title: 'Almoço Saudável', image: 'https://via.placeholder.com/150', user: 'User2', status: 'Rascunho' },
    { id: '3', title: 'Viagem para a Praia', image: 'https://via.placeholder.com/150', user: 'User3', status: 'Publicado' },
    // Adicione mais publicações aqui
  ];

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(allPosts);

  const handleSearch = (query: string) => {
    if (query === '') {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post => {
        const lowerQuery = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerQuery) ||   
          post.user.toLowerCase().includes(lowerQuery) ||    
          post.status.toLowerCase().includes(lowerQuery)     
        );
      });
      setFilteredPosts(filtered);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postDetails}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postUser}>{item.user}</Text>
        {/* <Text style={styles.postStatus}>{item.status}</Text> Exibir o status */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar data={allPosts} onSearch={handleSearch} />
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
      />
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
  postStatus: {
    fontSize: 12,
    color: '#999',
  },
});
