import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, Alert, Pressable} from 'react-native';

export default function Registratiescherm() {
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    const [studentnr, setStudentnr] = useState<number | undefined>(undefined);
    const [geboortedatum, setGeboortedatum] = useState('');
    const [voornaam, setVoornaam] = useState('');
    const [achternaam, setAchternaam] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const aanmaakRegistratie = async () => {
        if (!studentnr || !geboortedatum || !password || !confirmPassword || !voornaam || !achternaam) {
            Alert.alert("Vul alle velden in.")
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Wachtwoorden komen niet overeen.");
            return;
        }
        if (!studentnr || studentnr.toString().length !== 7) {
            Alert.alert("Studentnummer moet precies 7 cijfers bevatten.");
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({
                    voornaam: voornaam,
                    achternaam: achternaam,
                    studentnummer: studentnr,
                    geboortedatum: geboortedatum,
                    wachtwoord: password,
                }),
            });
            if (!response.ok) {
                throw new Error('Registratie mislukt');
            }

            Alert.alert('Gelukt!', `Welkom ${voornaam}!`);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Fout', 'Er ging iets mis bij het registreren.');
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registreren</Text>
            {/*<Text className="text-s">Naam:</Text>*/}
            {/*<TextInput style={styles.input}*/}
            {/*placeholder={'Naam'}*/}
            {/*value={name}*/}
            {/*onChangeText={setName}>*/}
            {/*</TextInput>*/}
            {/*<Text className="text-s">Email:</Text>*/}
            {/*<TextInput style={styles.input}*/}
            {/*placeholder={'Email'}*/}
            {/*value={email}*/}
            {/*onChangeText={setEmail}>*/}
            {/*</TextInput>*/}
            <Text className="text-s">Studentnummer:</Text>
            <TextInput
                style={styles.input}
                placeholder={"Studentnummer"}
                value={studentnr?.toString() || ''}
                onChangeText={(text) => {
                    const filtered = text.replace(/[^0-9]/g, '');
                    if (filtered.length <= 7) {
                        setStudentnr(filtered ? parseInt(filtered, 10) : undefined);}}}
                keyboardType="numeric"/>
            <Text className="text-s">Geboortedatum:</Text>
            <TextInput style={styles.input}
                       placeholder={'Geboortedatum'}
                       value={geboortedatum}
                       onChangeText={setGeboortedatum}>
            </TextInput>
            <Text className="text-s">Voornaam:</Text>
            <TextInput style={styles.input}
                       placeholder={'Voornaam'}
                       value={voornaam}
                       onChangeText={setVoornaam}>
            </TextInput>
            <Text className="text-s">Achternaam:</Text>
            <TextInput style={styles.input}
                       placeholder={'Achternaam'}
                       value={achternaam}
                       onChangeText={setAchternaam}>
            </TextInput>
            <Text className="text-s">Wachtwoord:</Text>
            <TextInput style={styles.input}
            placeholder={'Wachtwoord'}
            value={password}
            onChangeText={setPassword}>
            </TextInput>
            <Text className="text-s">Herhaal uw wachtwoord:</Text>
            <TextInput style={styles.input}
            placeholder={'Wachtwoord'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}>
            </TextInput>

            <Pressable className="bg-amber-300 justify-center items-center w-40 h-10" onPress={aanmaakRegistratie}>
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

