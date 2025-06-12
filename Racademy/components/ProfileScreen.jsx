import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';

export default function ProfileScreen({ route }) {
  const userData = route?.params?.userData;
  console.log('userData ontvangen:', userData);

  const [profile, setProfile] = useState({
    email: '',
    voornaam: '',
    achternaam: '',
  });

  const [resources, setResources] = useState([]);
  const [editedResourceTitle, setEditedResourceTitle] = useState('');
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    if (userData) {
      setProfile({
        email: userData.email || '',
        voornaam: userData.voornaam || '',
        achternaam: userData.achternaam || '',
      });
      setOriginalEmail(userData.email || '');
      fetchResources(userData.email);
    }
  }, [userData]);

  const handleEditResource = (id) => {
    const resource = resources.find(r => r.id === id);
    setEditingResourceId(id);
    setEditedResourceTitle(resource.title);
  };

  const handleDeleteResource = async (id) => {
    try {
      const response = await fetch('delete_resource', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ resource_id: id }),
      });

      const json = await response.json();
      if (json.success) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else {
        console.log('Failed to delete:', json.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const fetchResources = async (email) => {
    try {
      const response = await fetch('http://192.168.1.143:5000/get_resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();

      if (json.success) {
        setResources(json.resources);
      } else {
        console.error('Fout bij ophalen van resources:', json.message);
      }
    } catch (err) {
      console.error('Network error bij resources ophalen:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://192.168.1.143:5000/update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_email: originalEmail,
          email: profile.email,
          voornaam: profile.voornaam,
          achternaam: profile.achternaam,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Non-OK response:", text);
        Alert.alert("Fout", `Server reageerde met status ${response.status}`);
        return;
      }

      const json = await response.json();

      if (json.success) {
        setOriginalEmail(profile.email);
        Alert.alert("Succes", "Profiel succesvol aangepast.");
      } else {
        Alert.alert("Fout", json.message || "Profiel bijwerken mislukt.");
      }
    } catch (error) {
      console.error('Fout bij opslaan profiel:', error);
      Alert.alert("Fout", "Er is een fout opgetreden bij het opslaan van het profiel.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profiel</Text>

      <TextInput
        style={styles.input}
        value={profile.voornaam}
        onChangeText={(text) => setProfile({...profile, voornaam: text})}
      />
      <TextInput
        style={styles.input}
        value={profile.achternaam}
        onChangeText={(text) => setProfile({...profile, achternaam: text})}
      />
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(text) => setProfile({...profile, email: text})}
      />

      <Pressable
        style={styles.primaryButton}
        onPress={handleSaveProfile}
      >
        <Text style={styles.primaryButtonText}>Opslaan</Text>
      </Pressable>

      {resources.map(resource => (
        <View key={resource.id} style={styles.resourceRow}>
          {editingResourceId === resource.id ? (
            <TextInput
              style={styles.input}
              value={editedResourceTitle}
              onChangeText={setEditedResourceTitle}
            />
          ) : (
            <Text style={styles.resourceText}>{resource.title}</Text>
          )}

          <View style={styles.buttonGroup}>
            {editingResourceId === resource.id ? (
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  setResources(prev =>
                    prev.map(r =>
                      r.id === resource.id ? { ...r, title: editedResourceTitle } : r
                    )
                  );
                  setEditingResourceId(null);
                }}
              >
                <Text style={styles.primaryButtonText}>Opslaan</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => handleEditResource(resource.id)}
              >
                <Text style={styles.buttonText}>Bewerken</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.dangerButton}
              onPress={() => handleDeleteResource(resource.id)}
            >
              <Text style={styles.buttonText}>Verwijderen</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 8,
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
