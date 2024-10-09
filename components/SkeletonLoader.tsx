import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProfileSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.avatar} />
        <View style={styles.name} />
        <View style={styles.bio} />
        <View style={styles.row}>
          <View style={styles.stats} />
          <View style={styles.stats} />
        </View>
        <View style={styles.posts} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    width: 150,
    height: 20,
    borderRadius: 4,
    marginBottom: 5,
  },
  bio: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stats: {
    width: '30%',
    height: 20,
    borderRadius: 4,
  },
  posts: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
});

export default ProfileSkeleton;
