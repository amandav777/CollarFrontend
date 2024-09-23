import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalSearchParams, useRouter } from 'expo-router';

type PublicationProps = {
  id: number;
  description: string;
  images: string[];
  status: string;
  createdAt: string;
};

type UserProps = {
  id: number;
  name: string;
  email: string;
  profileImage: string;
};

const { width } = Dimensions.get('window');

const PersonScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [publications, setPublications] = useState<PublicationProps[]>([]);
  const [likedPublications, setLikedPublications] = useState<number[]>([]);
  const [savedPublications, setSavedPublications] = useState<number[]>([]);
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Fetch user data and publications based on userId
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`);
        const userData = await userResponse.json();
        setUserData(userData);

        const publicationsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/publications/user/${userId}`);
        const publicationsData = await publicationsResponse.json();
        setPublications(publicationsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLike = (id: number) => {
    setLikedPublications((prevLiked) =>
      prevLiked.includes(id) ? prevLiked.filter((item) => item !== id) : [...prevLiked, id]
    );
  };

  const handleSave = (id: number) => {
    setSavedPublications((prevSaved) =>
      prevSaved.includes(id) ? prevSaved.filter((item) => item !== id) : [...prevSaved, id]
    );
  };

  const renderPublication = ({ item }: { item: PublicationProps }) => {
    const timeAgo = formatDistanceToNow(parseISO(item.createdAt), { addSuffix: false, locale: ptBR });
    const isLiked = likedPublications.includes(item.id);
    const isSaved = savedPublications.includes(item.id);

    return (
      <View style={styles.publicationContainer}>
        <View style={styles.imageContainer}>
          <FlatList
            data={item.images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
            )}
            keyExtractor={(image, index) => `${item.id}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
          />
          <Text style={styles.imageCount}>{item.images.length} imagens</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.iconButton}>
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={30} color={isLiked ? 'red' : 'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSave(item.id)} style={styles.iconButton}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={30} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.likes}>1.000 likes</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.timeAgo}>{timeAgo} atrás</Text>
      </View>
    );
  };

  if (!userData) {
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionsButton} onPress={() => router.back()}>
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.containerProfile}>

          <Image
            source={{ uri: userData.profileImage || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>

            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>(14) 98806-9926</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </View>
        </View>
      </View>
      {/* <View style={styles.containerPublication}>
        <View style={styles.iconWrapper}>
          <Ionicons name="images" size={25} color="#696969" />
        </View>
      </View> */}

      <FlatList
        data={publications}
        renderItem={renderPublication}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerProfile: { flexDirection: "row", marginTop: 50, justifyContent: "flex-start", marginLeft: 20 }, profileTextContainer: { marginLeft: 20 }, editIcon: { marginLeft: 70 },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: "#696969",
    borderBottomWidth: 2,
    width: '30%',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "#f3f3f3",
    alignItems: 'flex-start',
    paddingVertical: 20,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 25,
  },
  optionsButton: {
    position: 'absolute',
    top: 15,
    right: 25,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 5,
    color: 'gray',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  publicationContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 320,
  },
  imageCount: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  likes: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  description: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  timeAgo: {
    paddingHorizontal: 10,
    color: '#696969',
  },
  publicationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#696969',
    marginLeft: 10,
  },
  containerPublication: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: "#F3F3F3",
    borderBottomWidth: 1,
    padding: 15,
  },
});

export default PersonScreen;
