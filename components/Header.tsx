import React from 'react';
import { Image, StyleSheet, useColorScheme } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function Header() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <ThemedView style={[styles.titleContainer, isDarkMode ? styles.dark : styles.light]}>
      <Image
        source={require('@/assets/images/LogoEscrita.png')}
        style={styles.reactLogo}
      />
     
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    padding: 10,
    borderBottomColor: "#F3F3F3",
    borderBottomWidth:1
  },
  reactLogo: {
    marginLeft: 5,
    height: 26,
    width: 100,
  },
  light: {
    backgroundColor: '#fff',
    color: '#000',
  },
  dark: {
    backgroundColor: '#000',
    color: '#fff',
  },
});
