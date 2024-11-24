import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSearchParams } from "expo-router/build/hooks";
import { getAllLikedPublications } from "@/services/likeService";
import Publication from "@/components/Publication";
import { PublicationData } from "@/services/publicationService";

const LikedPublicationsScreen: React.FC<{ userId: number }> = ({}) => {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string>(
    searchParams.get("userId") || ""
  );

  useEffect(() => {
    const fetchLikedPublications = async () => {
      try {
        const data = await getAllLikedPublications(Number(userId));
        setPublications(data);
      } catch (err) {
        setError("Não foi possível carregar as publicações curtidas.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPublications();
  }, [userId]);

  const renderPublication = ({ item }: { item: PublicationData }) => (
    <Publication
      id={item.id}
      description={item.description}
      images={item.images}
      status={item.status}
      user={item.user}
      createdAt={item.createdAt}
      location={item.location}
      likes={item.likeCount}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Publicações Curtidas</Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : publications.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhuma publicação curtida encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPublication}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default LikedPublicationsScreen;
