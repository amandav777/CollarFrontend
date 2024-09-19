import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View } from 'react-native';
import Header from '@/components/Header';
import Publication from '@/components/Publication';

type PublicationData = {
  id: number;
  description: string;
  images: string[];
  status: string;
  user: {
    id:number,
    name: string;
    profileImage:any
  };
  createdAt: string;
};

export default function HomeScreen() {
  const [publications, setPublications] = useState<PublicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    try {
      const response = await fetch('http://localhost:3000/publications', { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const result = await response.json();

      const sortedResult = result.sort((a: PublicationData, b: PublicationData) => {
        return sortOrder === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      setPublications(sortedResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      fetchData();
      setRefreshing(false);
    }, 2000);
  }, [sortOrder]);

  useEffect(() => {
    fetchData();
  }, [sortOrder]);

  const renderPublication = ({ item }: { item: PublicationData }) => (
    <Publication
      id={item.id}
      description={item.description}
      images={item.images}
      status={item.status}
      user={item.user}
      createdAt={item.createdAt}
    />
  );

  return (
    <View style={styles.container}>
      <Header/>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPublication}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // padding: 10,
    backgroundColor: '#fff',
  },
});
