// app/users/[id].tsx

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function UserDetails() {
    const { id } = useLocalSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
                const data = await res.json();
                setUser(data);
            } catch (error) {
                console.error('Fout bij ophalen gebruiker:', error);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchUser();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Gebruiker niet gevonden.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gebruiker Details</Text>
            <Text>Naam: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Telefoon: {user.phone}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
