import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Login() {
  const [email, setEmail] = useState('');
  const [displayNaam, setDisplayNaam] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const body = {
      email: email.trim() || undefined,
      display_naam: displayNaam.trim() || undefined,
      wachtwoord: wachtwoord.trim(),
    };

    try {
      const response = await fetch('http://192.168.1.143:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        alert(`Login successful als ${data.type}!`);
        navigation.navigate('Profile');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email (voor beheerders)"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Gebruikersnaam (voor gebruikers)"
          autoCapitalize="none"
          value={displayNaam}
          onChangeText={setDisplayNaam}
        />
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          secureTextEntry
          value={wachtwoord}
          onChangeText={setWachtwoord}
        />
        <Pressable style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;
