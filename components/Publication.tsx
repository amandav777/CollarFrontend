import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PublicationProps = {
  id: number;
  description: string;
  images: string[];
  status: string;
  user: {
    name: string;
    profileImage: any;
    id: number;
  };
  likes: any;
  location: string;
  createdAt: string;
};

const { width } = Dimensions.get('window');

const Publication: React.FC<PublicationProps> = ({ id, description, images, status, user, createdAt, location, likes }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(likes || 0);
  const [lastPress, setLastPress] = useState<number | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();
  const userId = user.id;

  useEffect(() => {
    const checkLikeStatus = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');

      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/publications/${id}/likes?userId=${storedUserId}`);

        if (response.status === 200 && response.data.liked) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error('Erro ao carregar o status do like:', error);
      }
    };

    checkLikeStatus();
  }, [id]); // Executa novamente quando o `id` da publicação mudar



  // Função para lidar com o like
  const handleLike = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const newLikeStatus = !liked;
    const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/publications/like`, {
        publicationId: id,
        userId: Number(storedUserId),
      });

      if (response.status === 200 || response.status===201) {
        setLiked(newLikeStatus);
        setLikeCount(newLikeCount);
        
        // Animar o coração ao dar like
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
        console.error('Erro ao atualizar o like no servidor:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar o like:', error);
    }
  };

  // Verifica se o usuário deu like ao dar duplo toque
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastPress && (now - lastPress) < 300) {
      handleLike();
    }
    setLastPress(now);
  };

  // Função para salvar a publicação
  const handleSave = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    setSaved(!saved); // Alterna o estado de salvo
  };

  // Renderiza a imagem
  const renderImage = ({ item }: { item: string }) => (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        {showHeart && (
          <Animated.View style={[
            styles.heartContainer,
            {
              opacity: animation,
              transform: [
                { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) },
              ],
            }
          ]}>
            <Ionicons name="heart" size={60} color="white" />
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  // Formata o tempo de criação
  const timeAgo = formatDistanceToNow(parseISO(createdAt), { addSuffix: false, locale: ptBR });

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            router.push({ pathname: '/person', params: { userId } });
          }}
        >
          <Image
            source={{ uri: user.profileImage || 'https://via.placeholder.com/30' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.headTittle}>{user.name}</Text>
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
        <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={30} color={liked ? 'red' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={30} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{likeCount} curtidas</Text>
      <Text style={styles.title}>{status}</Text>
      <Text style={styles.text}>{description}</Text>
      <Text style={styles.hours}>{timeAgo} atrás</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headTittle: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 320,
  },
  heartContainer: {
    position: 'absolute',
    top: '30%',
    left: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  iconButton: {
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  hours: {
    color: '#696969',
    paddingHorizontal: 15,
  },
  images: {
    borderTopColor: '#F3F3F3',
    borderTopWidth: 1,
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
  },
  text: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  imageCountContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCountText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  cityText: {
    color: "#696969"
  }
});

export default Publication;
