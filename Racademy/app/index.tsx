import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import asyncstorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import logo from '../assets/images/hogeschool-rotterdam.png';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const body = {
      loginInput: login.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.success) {
        await asyncstorage.multiSet([
            ['authToken', data.token],
            ['userType', data.type],
          ['userData', JSON.stringify(data.user)],
        
        ]);
        
        Alert.alert('Succes', `ingelogd als ${data.type}!`);

        router.push('/gebruikersoverzicht');

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
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.registerContainer}>
  <Pressable onPress={() => router.push('/registration')} style={styles.registerLink}>
    <Text style={styles.registerText}>Nog geen account? Registreer hier</Text>
  </Pressable>
</View>


      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or username"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
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
    backgroundColor: '#fdf3e8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  logo: {
    width: 60,
    height: 60,
  },
  card: {
    backgroundColor: '#fdf3e8',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
    color: '#03193c',
  },
  input: {
    width: '100%',
    height: 48,
    borderBottomWidth: 2,
    borderColor: '#03193c',
    fontSize: 16,
    marginBottom: 32,
    backgroundColor: 'transparent',
    color: '#03193c',
  },
  buttonContainer: {
    backgroundColor: '#d2214b',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  registerContainer: {
  marginTop: 20,
  alignItems: 'center',
},

registerLink: {
  flexDirection: 'row',
  alignItems: 'center',
},

registerText: {
  color: '#d2214b',
  fontSize: 16,
},


  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;
