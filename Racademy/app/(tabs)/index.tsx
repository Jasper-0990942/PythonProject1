import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@/components/Login';
import ProfileScreen from '@/components/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
