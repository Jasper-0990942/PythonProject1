import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OverzichtUsers() {
    const [users, setUsers] = useState([
        { id: '1', name: 'Johan Bakayoko', email: 'johan@bakayoko.com' },
        { id: '2', name: 'Ricardo Pepi', email: 'ricardo@pepi.com' },
        { id: '3', name: 'Malik Tillman', email: 'malik@tillman.com' },
    ]);

    const renderItem = ({ item } : {item: any}) => (
        <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Overzicht van alle gebruikers</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
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
