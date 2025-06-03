import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';




export default function ProfileScreen({ route }) {
  const userData = route?.params?.userData;

  const [profile, setProfile] = useState({
    email: '',
    voornaam: '',
    achternaam: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [resources, setResources] = useState([]);
  const [editedResourceTitle, setEditedResourceTitle] = useState('');
const [editingResourceId, setEditingResourceId] = useState(null);



  useEffect(() => {
    if (userData) {
      setProfile({
        email: userData.email || '',
        voornaam: userData.voornaam || '',
        achternaam: userData.achternaam || '',
      });
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


 const handleSaveProfile = async () => {
  setIsEditing(false);
  try {
    const response = await fetch('http://localhost:3000/update_profile', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(profile)
    });

    const json = await response.json();
    if (json.success) {
      console.log('Profile successfully updated', profile);
    } else {
      console.log('Profile failed with error', json.message);
    }
  } catch (error) {
    console.error('Error while saving profile', error);
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
  onPress={() => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  }}
>
  <Text style={styles.primaryButtonText}>
    {isEditing ? 'Opslaan' : 'Bewerken'}
  </Text>
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
            // Save changes
            setResources(prev =>
              prev.map(r =>
                r.id === resource.id ? { ...r, title: editedResourceTitle } : r
              )
            );
            setEditingResourceId(null);
          }}
        >
          <Text style={styles.buttonText}>Opslaan</Text>
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
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
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resourceText: {
    fontSize: 16,
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