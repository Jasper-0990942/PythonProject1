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
                const res = await fetch(`http://localhost:5000/users/${id}`);
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
            <Text>Naam: {user.fname} {user.infix ? user.infix + ' ' : ''}{user.lname}</Text>
            <Text>Studentnummer: {user.studentnr}</Text>
            <Text>Geboortedatum: {user.dateofbirth}</Text>
            <Text>Status: {user.status}</Text>
            <Text>Rol: {user.role}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
