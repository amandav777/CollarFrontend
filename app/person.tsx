import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Pressable, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Publication {
  id: number;
  images: string[];
}

export default function PersonScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };

  const renderPublicationImage = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={styles.publicationImage}
    />
  );

  const fetchUserData = async () => {
    try {
      if (userId) {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        const result = await response.json();
        setUserData(result);

        // Fetch user publications
        const publicationsResponse = await fetch(`http://localhost:3000/publications/user/${userId}`);
        const publicationsResult = await publicationsResponse.json();
        setPublications(publicationsResult);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário ou publicações:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={toggleTooltip}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
      </TouchableOpacity>

      {tooltipVisible && (
        <TouchableWithoutFeedback onPress={closeTooltip}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {tooltipVisible && (
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltip}>
            <Pressable style={styles.tooltipOption} onPress={() => console.log('Opção 1')}>
              <Text style={styles.tooltipOptionText}>Denunciar Perfil</Text>
            </Pressable>
            <Pressable style={styles.tooltipOption} onPress={() => console.log('Opção 2')}>
              <Text style={styles.tooltipOptionText}>Opção 2</Text>
            </Pressable>
            
          </View>
        </View>
      )}

      <Image
        source={{ uri: userData.profileImage || 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.title}>{userData.name || 'Usuário'}</Text>
      <Text style={styles.detail}>{userData.email || 'Não disponível'}</Text>
      <FlatList
        data={publications.flatMap(pub => pub.images)}
        renderItem={renderPublicationImage}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.publicationsGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 18,
    color: 'gray',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  optionsButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 45, // Ajuste conforme necessário
    right: 10, // Ajuste conforme necessário
    zIndex: 2,
    width: 180, // Ajuste a largura conforme necessário
  },
  tooltip: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    width: 180,
  },
  tooltipOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tooltipOptionText: {
    fontSize: 16,
  },
  publicationsGrid: {
    marginTop: 50,
  },
  publicationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 2,
  },
});
