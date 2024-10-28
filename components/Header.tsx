import React from 'react';
import { Image, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

export default function Header() {
  const colorScheme = useColorScheme();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={[styles.titleContainer, colorScheme === 'dark' ? styles.dark : styles.light]}>
        <Image
          source={require('@/assets/images/LogoEscrita.png')}
          style={styles.reactLogo}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0, 
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
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
