import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'


const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

type ProfileType = {
  email?: string;
  fname: string;
  lname: string;
  infix?: string;
  dateofbirth?: string;
  status?: string;
  studentnr?: string;
  display_name?: string;
  password: string;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileType>({
    email: '',
    fname: '',
    lname: '',
    infix: '',
    dateofbirth: '',
    status: '',
    studentnr: '',
    display_name: '',
    password: '',
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [originalIdentifier, setOriginalIdentifier] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const tokenValue = await AsyncStorage.getItem('authToken');
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = userDataString ? JSON.parse(userDataString) : null;

        if (!tokenValue || !userData) {
          Alert.alert('Error', 'Geen token gevonden. Log opnieuw in.');
          router.push('/' as const);
          return;
        }

        setIsAdmin(userData.type === 'admin');

        const resp = await fetch(`${apiBaseUrl}/profile`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${tokenValue}` },
        });

        const json = await resp.json();

        if (json.success) {
          const data = json.profile;
          setProfile({
            email: data.email || '',
            fname: data.fname || '',
            lname: data.lname || '',
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
    const tokenValue = await AsyncStorage.getItem('authToken');

    if (!tokenValue) {
      Alert.alert('Error', 'Geen token beschikbaar, log opnieuw in.');
      return;
    }

    const body: Record<string, string> = {
      fname: profile.fname,
      lname: profile.lname,
      dateofbirth: profile.dateofbirth || '',
    };

    if (profile.password) body.password = profile.password;
    if (profile.infix) body.infix = profile.infix;
    if (profile.status) body.status = profile.status;

    if (isAdmin) {
      body.original_email = originalIdentifier;
      if (profile.email) body.email = profile.email;
    } else {
      body.original_display_name = originalIdentifier;
      if (profile.display_name) body.display_name = profile.display_name;
      if (profile.studentnr) body.studentnr = profile.studentnr;
    }

    try {
      console.log('Sending token:', tokenValue);
      const resp = await fetch(`${apiBaseUrl}/update_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenValue}`,
        },
        body: JSON.stringify(body),
      });

      const json = await resp.json();

      if (json.success) {
        setOriginalIdentifier(isAdmin ? profile.email! : profile.display_name!);
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
      <Text style={styles.title}>Profiel Bewerken</Text>


        <TextInput style={styles.input} placeholder="Email" value={profile.email} onChangeText={email => setProfile(p => ({ ...p, email }))} />
        <>
          <TextInput style={styles.input} placeholder="Gebruikersnaam" value={profile.display_name} onChangeText={display_name => setProfile(p => ({ ...p, display_name }))} />
          <TextInput style={styles.input} placeholder="Studentnummer" value={profile.studentnr} onChangeText={studentnr => setProfile(p => ({ ...p, studentnr }))} />
        </>

      <TextInput style={styles.input} placeholder="Voornaam" value={profile.fname} onChangeText={fname => setProfile(p => ({ ...p, fname }))} />
      <TextInput style={styles.input} placeholder="Tussenvoegsel" value={profile.infix} onChangeText={infix => setProfile(p => ({ ...p, infix }))} />
      <TextInput style={styles.input} placeholder="Achternaam" value={profile.lname} onChangeText={lname => setProfile(p => ({ ...p, lname }))} />
      <TextInput style={styles.input} placeholder="Geboortedatum" value={profile.dateofbirth} onChangeText={dateofbirth => setProfile(p => ({ ...p, dateofbirth }))} />
      <TextInput style={styles.input} placeholder="Wachtwoord " secureTextEntry value={profile.password} onChangeText={password => setProfile(p => ({ ...p, password }))} />

      <Pressable style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fdf3e8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#03193c',
    marginBottom: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#03193c',
  },
  button: {
    backgroundColor: '#d2214b',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

