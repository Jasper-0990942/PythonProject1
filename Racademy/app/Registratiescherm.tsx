import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export default function Registratiescherm() {
    const [email, setEmail] = useState('');
    const [studentnr, setStudentnr] = useState('');
    const [dateofbirth, setDateofBirth] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [infix, setInfix] = useState('');

    const router = useRouter();

    const aanmaakRegistratie = async () => {
        console.log("Knop is ingedrukt");
        console.log("apiBaseUrl:", apiBaseUrl);
        console.log("Check URL:", `${apiBaseUrl}/users/register`);
        if (!studentnr || !dateofbirth || !password || !confirmPassword || !fname || !lname) {
            alert("Vul alle velden in.");
            console.log("test")
            return;
        }
        if (password !== confirmPassword) {
            alert("Wachtwoorden komen niet overeen.");
            return;
        }
        if (!studentnr || studentnr.toString().length !== 7) {
            alert("Studentnummer moet precies 7 cijfers bevatten.");
            return;
        }
        if (!email.startsWith(studentnr)) {
            alert("Studentnummer komt niet overeen met het studentnummer in het mailadres.");
            return;
        }
        if (error) {
            alert("Fout");
            return;
        }
        try {
            const emailCheck = await fetch(`${apiBaseUrl}/users/checkmail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email}),
            });
            const emailCheckData = await emailCheck.json();
            if (emailCheckData.exists) {
                alert("Er bestaat al een account met dit mailadres.");
                return;
            }
        } catch (error) {
            alert("Het is niet gelukt om te checken of dit mailadres al een account heeft.");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/users/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email,
                    fname,
                    infix,
                    lname,
                    studentnr,
                    dateofbirth,
                    password,
                }),});
            if (!response.ok) {
                throw new Error('Registratie mislukt');
            }
            alert(`Gelukt! Welkom ${fname}!`);
            router.push('/');
        } catch (error) {
            console.error("FOUTTTT", error);
            alert('Er ging iets mis bij het registreren.');
        }};

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView contentContainerStyle={{padding: 24}} keyboardShouldPersistTaps="handled">
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
                    <Text className="text-base text-gray-700">Tussenvoegsel:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Tussenvoegsel"
                        onChangeText={setInfix}
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
                <View className="w-full max-w-md self-center mb-4">
                    <Pressable onPress={() => router.push('/')} className="flex-row items-center">
                        <Text className="text-hrRed text-base">&larr; Terug naar login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
