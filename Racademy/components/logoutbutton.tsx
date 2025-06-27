import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  return (
    <Pressable onPress={handleLogout} style={styles.button}>
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    color: '#d2214b',
    fontWeight: '600',
    fontSize: 16,
  },
});
