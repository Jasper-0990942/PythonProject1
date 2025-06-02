import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import {defaultProps as resource} from "react-native-web/src/modules/forwardedProps";




export default function ProfileScreen() {

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    voornaam: 'Luuk',
    achternaam: 'De jong',
    email: '0990941@hr.nl'
  });

  const [resources, setresources] = useState([
    {id: 1, title: 'Javascript cursus'}
  ]);

  const handleEditResource = (id) => {
    console.log('Edit resource, id');
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
      setresources((prev) => prev.filter((r) => r.id !== id));
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
    const response = await fetch('http://localhost:3000/update-profile', {
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
    console.error('Error while saving profile', error)
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Luuk</Text>

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


      <View style={styles.card}>
        <Text style={styles.subheading}>Door mij toegevoegde bronnen:</Text>

        <View style={styles.resourceRow}>
          <Text style={styles.resourceText}>{resource.title}</Text>
          <View style={styles.buttonGroup}>
            <Pressable style={styles.secondaryButton}
              onPress={() => {handleEditResource(resource.id)}}
              >
              <Text style={styles.buttonText}>Bewerken</Text>
            </Pressable>
            <Pressable style={styles.dangerButton}
              onpress={() => {handleDeleteResource(resource.id)}}
              >
              <Text style={styles.buttonText}>Verwijderen</Text>
            </Pressable>
          </View>
        </View>
      </View>
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