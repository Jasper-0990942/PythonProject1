import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';

type User = {
    id: number;
    email: string;
    fname: string;
    infix?: string;
    lname: string;
    status: string;
    role: 'user' | 'admin'; };

export default function OverzichtUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                console.log('Fetching users');
                const res = await fetch('http://mijn-ip:5050/users/');
                const json = await res.json();
                console.log('gebruikersdata ontvangen', json.users);
                setUsers(json.users);
            } catch (error) {
                console.error('Fout bij het ophalen van gebruikers:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <Text style={styles.userName}>
                {item.fname} {item.infix ?? ''} {item.lname}
            </Text>
            <Text style={styles.userEmail}>{item.email} ({item.role})</Text>
            <Button title="Details" onPress={() => router.push(`/users/${item.id}`)} />
        </View>
    );


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Overzicht van alle gebruikers</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    list: {
        gap: 10,
    },
    userCard: {
        padding: 15,
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});
