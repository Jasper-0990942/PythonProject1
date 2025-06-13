import React, { useState } from 'react';
import {View, Text, TextInput, Alert, Pressable, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import { useRouter } from 'expo-router';

export default function Registratiescherm() {
    const [email, setEmail] = useState('');
    const [studentnr, setStudentnr] = useState('');
    const [dateofbirth, setDateofBirth] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const router = useRouter();

    const aanmaakRegistratie = async () => {
        if (!studentnr || !dateofbirth || !password || !confirmPassword || !fname || !lname) {
            Alert.alert("Vul alle velden in.");
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
            const response = await fetch(`${backendUrl}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    fname,
                    lname,
                    studentnr,
                    dateofbirth,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Registratie mislukt');
            }

            Alert.alert('Gelukt!', `Welkom ${fname}!`);
            router.push('../Login');
        } catch (error) {
            Alert.alert('Fout', 'Er ging iets mis bij het registreren.');
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
                <View className="items-center">
                    <Text className="text-4xl font-bold text-hrRed my-6">Registreren</Text>
                </View>

                <View className="w-full max-w-md self-center space-y-4">
                    <Text className="text-base text-gray-700">Email (@hr.nl):</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Email"
                        onChangeText={(text) => {
                            setEmail(text);
                            setError(!text.endsWith('@hr.nl') ? 'Alleen @hr.nl adressen zijn toegestaan' : '');
                        }}
                    />
                    {error ? <Text className="text-red-500">{error}</Text> : null}

                    <Text className="text-base text-gray-700">Studentnummer:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Studentnummer"
                        keyboardType="numeric"
                        maxLength={7}
                        onChangeText={(text) => {
                            const filtered = text.replace(/[^0-9]/g, '');
                            if (filtered.length <= 7) {
                                setStudentnr(filtered);
                            }
                        }}
                    />

                    <Text className="text-base text-gray-700">Geboortedatum:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="DD-MM-YYYY"
                        onChangeText={setDateofBirth}
                    />

                    <Text className="text-base text-gray-700">Voornaam:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Voornaam"
                        onChangeText={setFname}
                    />

                    <Text className="text-base text-gray-700">Achternaam:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Achternaam"
                        onChangeText={setLname}
                    />

                    <Text className="text-base text-gray-700">Wachtwoord:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Wachtwoord"
                        secureTextEntry
                        onChangeText={setPassword}
                    />

                    <Text className="text-base text-gray-700">Herhaal wachtwoord:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Herhaal wachtwoord"
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                    />

                    <Pressable onPress={aanmaakRegistratie} className="bg-hrRed py-3 rounded-md items-center mt-6">
                        <Text className="text-white font-semibold">Maak profiel aan</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
