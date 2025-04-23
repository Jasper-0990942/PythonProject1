import React from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

function Login(props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
        <Pressable style={styles.buttonContainer}>
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
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
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
