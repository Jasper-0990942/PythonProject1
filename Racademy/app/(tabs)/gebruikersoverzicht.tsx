import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

type User = {
    id: number;
    email: string;
    fname: string;
    infix?: string;
    lname: string;
    status: string;
    role: 'user' | 'admin';
};

export default function OverzichtUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                console.log('Fetching users apart');
                const res = await fetch('http://localhost:5000/users/apart');
                const json = await res.json();
                const combined = [...json.admins, ...json.users];

                console.log('Gebruikersdata ontvangen', combined);
                setUsers(combined);
            } catch (error) {
                console.error('Fout bij het ophalen van gebruikers:', error);
            } finally {
                setLoading(false);
            }}
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#b30000" />
            </View>
        );}

    return (
        <ScrollView className="flex-1 bg-white px-6 pt-6">
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-hrRed">Gebruikersoverzicht</Text>
            </View>
            <View className="space-y-4">
                {users.map((user) => (
                    <View
                        key={user.id}
                        className="border border-hrRed rounded-xl p-4 bg-gray-50 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800">
                            {user.fname} {user.infix ?? ''} {user.lname}
                        </Text>
                        <Text className="text-sm text-gray-600">{user.email} ({user.role})</Text>
                        <Pressable
                            onPress={() => router.push(`/users/${user.role}/${user.id}`)}
                            className="mt-3 bg-hrRed py-2 px-4 rounded-md items-center">
                            <Text className="text-white font-medium">Bekijk details</Text>
                        </Pressable>
                    </View>))}
            </View>
        </ScrollView>
    );}