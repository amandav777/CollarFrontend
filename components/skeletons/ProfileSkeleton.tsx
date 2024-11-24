import React from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";

const ProfileSkeleton = () => {
  // Usando animação de opacidade
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Skeleton para imagem */}
      <Animated.View
        style={[styles.skeletonImage, { opacity: fadeAnim }]}
      />
      {/* Skeleton para texto (nome) */}
      <Animated.View
        style={[styles.skeletonText, { opacity: fadeAnim }]}
      />
      {/* Skeleton para texto (email) */}
      <Animated.View
        style={[styles.skeletonText, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 30,
  },
  skeletonImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  skeletonText: {
    width: "60%",
    height: 20,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ProfileSkeleton;
