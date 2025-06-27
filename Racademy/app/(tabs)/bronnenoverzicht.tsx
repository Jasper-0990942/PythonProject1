import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter} from "expo-router";

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

type Bron = {
  source_id: number;
  user_id: number;
  sourcetype_id: number;
  title: string;
  description: string;
  link: string;
  ISBN: string;
  img: string;
  date_created: string;
  tag: string;
};

export default function BronnenOverzichtScreen() {
  const [bronnen, setBronnen] = useState<Bron[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');



  useEffect(() => {
    const fetchBronnen = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          return;
        }
        const response = await fetch(`${apiBaseUrl}/bronnen`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        if (json.success) {
          setBronnen(json.bronnen);
        } else {
          alert('Fout bij laden bronnen');
        }
      } catch (e) {
        alert('Netwerkfout');
      }
      setLoading(false);
    };

    fetchBronnen();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#d2214b" />;

  const filteredBronnen = bronnen.filter((bron) =>
  bron.title.toLowerCase().includes(searchText.toLowerCase()) ||
  bron.description.toLowerCase().includes(searchText.toLowerCase())
);

  return (
    <View style={styles.container}>
            <Pressable style={styles.addButton} onPress={() => router.push('/explore')}>
        <Text style={styles.addButtonText}>Bronnen Toevoegen</Text>
      </Pressable>

      <TextInput
        style={styles.searchInput}
        placeholder="Zoek op titel of beschrijving..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredBronnen}
        keyExtractor={(item) => item.source_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Geen bronnen gevonden</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf3e8',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#03193c',
  },
  description: {
    fontSize: 16,
    color: '#444',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
    addButton: {
    backgroundColor: '#d2214b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
    searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});