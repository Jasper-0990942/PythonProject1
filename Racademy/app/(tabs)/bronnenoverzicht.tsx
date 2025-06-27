import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

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
};

export default function BronnenOverzichtScreen() {
  const [bronnen, setBronnen] = useState<Bron[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={bronnen}
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
    // Remove alignItems and justifyContent to allow list full width
  },
  card: {
    backgroundColor: '#fff', // make card white to stand out
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 16,
    // optional: add shadow for iOS/Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24, // smaller than 32 to fit list items better
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
});