import { StyleSheet, View } from 'react-native';

import SearchBar from '@/components/SearchBar';

export default function TabTwoScreen() {

  const data = ['Maçã', 'Banana', 'Laranja', 'Abacaxi', 'Manga'];



  return (
    <View>
      <SearchBar data={data} />

    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
