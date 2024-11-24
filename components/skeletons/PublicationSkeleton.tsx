import React, { useEffect } from "react";
import { StyleSheet, View, Animated, Easing, ScrollView, RefreshControl } from "react-native";

const PublicationSkeleton = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true, // Usando o driver nativo
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true, // Usando o driver nativo
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <ScrollView style={styles.skeletonContainer}>

      <Animated.View style={[styles.skeleton, { opacity: fadeAnim }]} />
      <Animated.View
        style={[styles.skeleton, { marginTop: 10, opacity: fadeAnim }]}
      />
      <Animated.View
        style={[styles.skeleton, { marginTop: 10, opacity: fadeAnim }]}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
  },
  skeleton: {
    height: 350,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    width: "100%",
  },
});

export default PublicationSkeleton;
