import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

// Tipagem das props
interface SearchBarProps {
  data: Array<any>; // Ou pode tipar melhor o array conforme sua necessidade, por exemplo: Array<Post>
  onSearch: (query: string) => void; // Função que recebe a string da pesquisa
}

export default function SearchBar({ data, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);  // Chama a função de pesquisa recebida nas props
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar..."
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
});
