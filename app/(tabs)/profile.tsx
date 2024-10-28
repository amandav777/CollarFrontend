// src/screens/ProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '@/components/LogoutButton';
import SkeletonLoader from '@/components/SkeletonLoader';
import { fetchUserData } from '@/services/userService'; // Importando o serviço

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

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [publications, setPublications] = useState<PublicationProps[]>([]);
  const [likedPublications, setLikedPublications] = useState<number[]>([]);
  const [savedPublications, setSavedPublications] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'liked' | 'saved'>('liked');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error getting userId from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId === null) return;

    const fetchData = async () => {
      try {
        const data: UserProps = await fetchUserData(userId);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    const fakePublications: PublicationProps[] = [
      {
        id: 1,
        description: 'Publicação 1',
        images: ['https://via.placeholder.com/400', 'https://via.placeholder.com/400'],
        status: 'Em andamento',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        description: 'Publicação 2',
        images: ['https://via.placeholder.com/400'],
        status: 'Concluída',
        createdAt: new Date().toISOString(),
      }
    ];

    setPublications(fakePublications);
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

  const publicationsToDisplay = activeTab === 'liked' ? publications.filter(pub => likedPublications.includes(pub.id)) : publications.filter(pub => savedPublications.includes(pub.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.containerProfile}>
          <Image
            source={{ uri: userData?.profileImage || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>(14) 98806-9926</Text>
            <Text style={styles.userEmail}>{userData?.email || 'email@example.com'} </Text>
          </View>
          <Ionicons style={styles.editIcon} name="brush" size={18} color="gray" />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'liked' && styles.activeTab]}
          onPress={() => setActiveTab('liked')}
        >
          <Text style={styles.tabText}><Ionicons style={styles.editIcon} name="images" size={18} color="gray" /></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={styles.tabText}><Ionicons style={styles.editIcon} name="bookmarks" size={18} color="gray" /></Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={publicationsToDisplay}
        renderItem={renderPublication}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <LogoutButton />
    </View>
  );
};

const styles = StyleSheet.create({
  containerProfile: { flexDirection: "row", marginTop: 30, justifyContent: "flex-start", marginLeft: 20 },
  profileTextContainer: { marginLeft: 20 },
  editIcon: { marginLeft: 70, marginTop: 15 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#D94509',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderColor: "#f3f3f3",
    alignItems: 'flex-start',
    paddingVertical: 20,
    marginTop: 10,
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

export default ProfileScreen;
