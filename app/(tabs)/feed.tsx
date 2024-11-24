import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "@/components/Header";
import Publication from "@/components/Publication";
import PublicationSkeleton from "@/components/skeletons/PublicationSkeleton"; // Corrigido para o nome do SkeletonLoader
import {
  fetchPublications,
  PublicationData,
} from "@/services/publicationService";
import { router } from "expo-router";

const HomeScreen = () => {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  console.log(publications);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder] = useState<"asc" | "desc">("desc");

  const loadPublications = async () => {
    const controller = new AbortController();
    try {
      const result = await fetchPublications(controller);
      const sortedResult = sortPublications(result);
      setPublications(sortedResult);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const sortPublications = (publications: PublicationData[]) => {
    return publications.sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPublications();
  }, []);

  useEffect(() => {
    loadPublications();
  }, [sortOrder]);

  const renderPublication = ({ item }: { item: any }) => (
    // <TouchableOpacity
    //   onPress={() =>
    //     router.push({
    //       pathname: "/postDetails",
    //       params: item,
    //     })
    //   }
    //   children={
    <Publication
      id={item.id}
      description={item.description}
      images={item.images}
      contactInfos={item.contactInfos}
      status={item.status}
      user={item.user}
      createdAt={item.createdAt}
      location={item.location}
      likes={item.likeCount}
    />
    //   }
    // ></TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        // Exibindo o SkeletonLoader enquanto as publicações estão carregando
        <PublicationSkeleton />
      ) : publications.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          <Text style={styles.emptyMessage}>
            Nenhuma publicação disponível.
          </Text>
          <Text style={styles.refreshText}>Puxe para atualizar.</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPublication}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
  },
  emptyMessage: {
    marginTop: 15,
    fontSize: 16,
    color: "#888",
  },
  refreshText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
});

export default HomeScreen;
