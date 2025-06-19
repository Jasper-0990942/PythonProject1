import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { token, userType } = useRouter();

  const [profile, setProfile] = useState({
    email: '',
    fname: '',
    lname: '',
    password: '',
    infix: '',
    dateofbirth: '',
    status: '',
    studentnr: '',
    display_name: '',
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalIdentifier, setOriginalIdentifier] = useState('');

useEffect(() => {
  const initialize = async () => {
    try {
      const tokenValue = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (!tokenValue || !userData) {
        Alert.alert('Error', 'Geen token gevonden. Log opnieuw in.');
        router.push('/login');
        return;
      }

      setIsAdmin(userData.type === 'admin' || userData.type === 'beheerder');

      // Fetch profile
      const resp = await fetch('http://127.0.0.1:5000/get_profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenValue}` },
      });

      const json = await resp.json();

      if (json.success) {
        const data = json.profile;
        setProfile({
          email: data.email || '',
          fname: data.fname || data.first_name || '',
          lname: data.lname || data.last_name || '',
          infix: data.infix || '',
          dateofbirth: data.dateofbirth || '',
          status: data.status || '',
          studentnr: data.studentnr || '',
          display_name: data.display_name || '',
          password: '',
        });
        setOriginalIdentifier(data.email || data.display_name || '');
      } else {
        Alert.alert('Fout', json.message || 'Profiel laden mislukt');
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Fout', 'Netwerkfout bij laden profiel');
      setLoading(false);
    }
  };

  initialize();
}, []);


  const handleSaveProfile = async () => {
    const body = {
      fname: profile.fname,
      lname: profile.lname,
      infix: profile.infix,
      dateofbirth: profile.dateofbirth,
      status: profile.status,
      password: profile.password,
    };

    if (isAdmin) {
      body.original_email = originalIdentifier;
      body.email = profile.email;
    } else {
      body.original_display_name = originalIdentifier;
      body.display_name = profile.display_name;
      body.studentnr = profile.studentnr;
    }

    try {
      const resp = await fetch('http://127.0.0.1:5000/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await resp.json();

      if (json.success) {
        setOriginalIdentifier(isAdmin ? profile.email : profile.display_name);
        setProfile(prev => ({ ...prev, password: '' }));
        Alert.alert('Succes', 'Profiel succesvol bijgewerkt.');
      } else {
        Alert.alert('Fout', json.message || 'Bijwerken mislukt.');
      }
    } catch (error) {
      Alert.alert('Fout', 'Netwerkfout bij opslaan profiel');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#d2214b" />
      </View>
    );
  }

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

      {!isAdmin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={profile.display_name}
            onChangeText={text => setProfile({ ...profile, display_name: text })}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Studentnummer"
            value={profile.studentnr}
            onChangeText={text => setProfile({ ...profile, studentnr: text })}
            keyboardType="numeric"
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Voornaam"
        value={profile.fname}
        onChangeText={text => setProfile({ ...profile, fname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Tussenvoegsel"
        value={profile.infix}
        onChangeText={text => setProfile({ ...profile, infix: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Achternaam"
        value={profile.lname}
        onChangeText={text => setProfile({ ...profile, lname: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Geboortedatum (YYYY-MM-DD)"
        value={profile.dateofbirth}
        onChangeText={text => setProfile({ ...profile, dateofbirth: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Status"
        value={profile.status}
        onChangeText={text => setProfile({ ...profile, status: text })}
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
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#03193c',
  },
  input: {
    height: 48,
    borderBottomWidth: 2,
    borderColor: '#03193c',
    marginBottom: 24,
    fontSize: 16,
    paddingHorizontal: 8,
    color: '#03193c',
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
