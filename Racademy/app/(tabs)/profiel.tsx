import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const userData = router.userData ? JSON.parse(router.userData) : null;
  const isAdmin = userData?.type === 'admin' || userData?.type === 'beheerder';

  const [profile, setProfile] = useState({
    email: '',
    fname: '',
    lname: '',
    password: '',
  });

  const [originalIdentifier, setOriginalIdentifier] = useState('');

  useEffect(() => {
    if (userData) {
      setProfile({
        email: userData.email || '',
        fname: userData.fname || userData.first_name || '',
        lname: userData.lname || userData.last_name || '',
        password: '',
      });

      setOriginalIdentifier(isAdmin ? userData.email : userData.display_name || '');
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    const body = {
      fname: profile.fname,
      lname: profile.lname,
      password: profile.password,
    };

    if (isAdmin) {
      body.original_email = originalIdentifier;
      body.email = profile.email;
    } else {
      body.original_display_name = originalIdentifier;
    }

    try {
      const resp = await fetch('http://127.0.0.1:5000/update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await resp.json();

      if (json.success) {
        setOriginalIdentifier(isAdmin ? profile.email : originalIdentifier);
        setProfile(prev => ({ ...prev, password: '' }));
        Alert.alert('Success', 'Profiel succesvol bijgewerkt.');
      } else {
        Alert.alert('Fout', json.message || 'Bijwerken mislukt.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Netwerkfout.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profiel</Text>

      {isAdmin && (
        <TextInput
          style={styles.input}
          placeholder="E-mailadres"
          value={profile.email}
          onChangeText={text => setProfile({ ...profile, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Voornaam"
        value={profile.fname}
        onChangeText={text => setProfile({ ...profile, fname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Achternaam"
        value={profile.lname}
        onChangeText={text => setProfile({ ...profile, lname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Wachtwoord"
        value={profile.password}
        onChangeText={text => setProfile({ ...profile, password: text })}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fdf3e8' },
  header: {
    fontSize: 32, fontWeight: '700', marginBottom: 24, textAlign: 'center', color: '#03193c'
  },
  input: {
    height: 48, borderBottomWidth: 2, borderColor: '#03193c',
    marginBottom: 24, fontSize: 16, paddingHorizontal: 8, color: '#03193c'
  },
  button: {
    backgroundColor: '#d2214b',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
