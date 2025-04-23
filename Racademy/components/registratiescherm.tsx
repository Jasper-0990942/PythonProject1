import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, Alert, Pressable} from 'react-native';

export default function Registratiescherm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const aanmaakRegistratie = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Vul alle velden in.")
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Wachtwoorden komen niet overeen.");
            return;
        }

        Alert.alert('Gelukt!', `Welkom ${name}!`);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registreren</Text>
            <TextInput style={styles.input}
            placeholder={'Naam'}
            value={name}
            onChangeText={setName}>
            </TextInput>
            <TextInput style={styles.input}
            placeholder={'Email'}
            value={email}
            onChangeText={setEmail}>
            </TextInput>
            <TextInput style={styles.input}
            placeholder={'Wachtwoord'}
            value={password}
            onChangeText={setPassword}>
            </TextInput>
            <TextInput style={styles.input}
            placeholder={'Wachtwoord'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}>
            </TextInput>

            <Pressable className="bg-amber-300 flex-1 justify-center items-center w-40 h-3"  onPress={aanmaakRegistratie}>
                <Text>Maak profiel aan</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        margin: 20,
    },
    input: {
        width: '50%',
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'blue',
        margin: 20,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10,
        borderColor: 'red',
        color: 'white',
        width: '20%',
        height: 40,
        textAlign: 'center',
    }
})

