import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';


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
  createdAt: string;
};

const { width } = Dimensions.get('window');

const Publication: React.FC<PublicationProps> = ({ id, description, images, status, user, createdAt }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [city, setCity] = useState<string | null>(null); // Cidade será armazenada aqui
  const router = useRouter();
  const userId = user.id;

  useEffect(() => {
    const fetchCityFromNominatim = async (latitude: number, longitude: number) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        if (response.data && response.data.address) {
          return response.data.address.city || response.data.address.town || response.data.address.village;
        }
        return null;
      } catch (error) {
        console.error('Erro ao buscar a cidade:', error);
        return null;
      }
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para acessar a localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const fetchedCity = await fetchCityFromNominatim(location.coords.latitude, location.coords.longitude);
      setCity(fetchedCity);
    };

    getLocation();
  }, []);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
  );

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
            <Text style={styles.cityText}>{city ? city : 'Aguardando localização...'}</Text> 
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
      <Text style={styles.title}>1.000 likes</Text>
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
  image: {
    width: width,
    height: 320,
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
