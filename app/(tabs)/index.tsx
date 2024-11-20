import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
} from "react-native";
import Header from "@/components/Header";
import Publication from "@/components/Publication";
import {
  fetchPublications,
  PublicationData,
} from "@/services/publicationService";

const HomeScreen = () => {
  const [publications, setPublications] = useState<PublicationData[]>([]);
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
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadPublications();
  }, [sortOrder]);

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
      <Header></Header>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : publications.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhuma publicação disponível.</Text>
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
  emptyMessage: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});

export default HomeScreen;
