import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

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
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const router = useRouter();
  const [selectedBron, setSelectedBron] = useState<Bron | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const bronnenResponse = await fetch(`${apiBaseUrl}/bronnen`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bronnenJson = await bronnenResponse.json();

      const favoritesResponse = await fetch(`${apiBaseUrl}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoritesJson = await favoritesResponse.json();

      if (bronnenJson.success) setBronnen(bronnenJson.bronnen);
      if (favoritesJson.success) setFavorites(favoritesJson.favorites);
    } catch (e) {
      alert('Netwerkfout bij ophalen gegevens');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const toggleFavorite = async (source_id: number) => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return;

    const isFavorited = favorites.includes(source_id);
    const method = isFavorited ? 'DELETE' : 'POST';

    const response = await fetch(`${apiBaseUrl}/favorites`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source_id }),
    });

    if (response.ok) {
      setFavorites(prev =>
        isFavorited ? prev.filter(id => id !== source_id) : [...prev, source_id]
      );
    } else {
      alert('Fout bij updaten favoriet');
    }
  };

  const openBronDetails = async (source_id: number) => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return;

    setLoadingDetails(true);
    try {
      const response = await fetch(`${apiBaseUrl}/bron/${source_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSelectedBron(data.bron);
      } else {
        alert('Details niet gevonden');
      }
    } catch (e) {
      alert('Fout bij ophalen details');
    }
    setLoadingDetails(false);
  };

  const filteredBronnen = bronnen.filter(
    bron =>
      (bron.title.toLowerCase().includes(searchText.toLowerCase()) ||
        bron.description.toLowerCase().includes(searchText.toLowerCase())) &&
      (!showOnlyFavorites || favorites.includes(bron.source_id))
  );

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#d2214b" />;

  return (
    <View style={styles.container}>
      <Pressable style={styles.addButton} onPress={() => router.push('/explore')}>
        <Text style={styles.addButtonText}>Bronnen Toevoegen</Text>
      </Pressable>

      <Pressable
        style={[styles.addButton, { backgroundColor: showOnlyFavorites ? '#444' : '#d2214b' }]}
        onPress={() => setShowOnlyFavorites(prev => !prev)}
      >
        <Text style={styles.addButtonText}>
          {showOnlyFavorites ? 'Toon alles' : 'Toon alleen favorieten'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.searchInput}
        placeholder="Zoek op titel of beschrijving..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredBronnen}
        keyExtractor={item => item.source_id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => openBronDetails(item.source_id)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation(); // Prevent card press
                  toggleFavorite(item.source_id);
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {favorites.includes(item.source_id) ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text numberOfLines={2} style={styles.description}>
              {item.description}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Geen bronnen gevonden</Text>}
      />

      {/* Modal for detailed bron info */}
      <Modal
        visible={!!selectedBron}
        animationType="slide"
        onRequestClose={() => setSelectedBron(null)}
      >
        <ScrollView style={styles.modalContainer}>
          {loadingDetails ? (
            <ActivityIndicator size="large" color="#d2214b" />
          ) : (
            <>
              <Text style={styles.modalTitle}>{selectedBron?.title}</Text>

              {selectedBron?.img ? (
                <Image
                  source={{ uri: selectedBron.img }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : null}

              <Text style={styles.modalDescription}>{selectedBron?.description}</Text>


              {selectedBron?.link ? (
                <Text
                  style={styles.modalLink}
                  onPress={() => Linking.openURL(selectedBron.link)}
                >
                  {selectedBron.link}
                </Text>
              ) : null}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedBron(null)}
              >
                <Text style={styles.closeButtonText}>Sluit</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#d2214b',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
  },
  description: {
    color: '#555',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  modalLink: {
    color: '#1e90ff',
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#d2214b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
