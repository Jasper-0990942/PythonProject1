// app/admin/newadmin.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export default function NieuweAdminAanmaken() {
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [infix, setInfix] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [status, setStatus] = useState('actief');
    const [error, setError] = useState('');

    const router = useRouter();

    const maakAdmin = async () => {
        if (!email || !fname || !lname || !password || !confirmPassword || !dateOfBirth) {
            alert('Vul alle verplichte velden in.');
            return;}
        if (password !== confirmPassword) {
            alert('Wachtwoorden komen niet overeen.');
            return;}
        try {
            const emailCheck = await fetch(`${apiBaseUrl}/users/checkmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const emailCheckData = await emailCheck.json();
            if (emailCheckData.exists) {
                alert('Er bestaat al een account met dit mailadres.');
                return;
            }
        } catch (error) {
            alert('Fout bij het checken van het emailadres.');
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/users/add_admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',},
                body: JSON.stringify({
                    email,
                    fname,
                    infix,
                    lname,
                    password,
                    dateofbirth: dateOfBirth,
                    status,
                }),
            });

            if (!response.ok) throw new Error('Fout bij aanmaken van een nieuw admin account');

            alert(`Admin ${fname} succesvol aangemaakt.`);
            router.push('/gebruikersoverzicht');
        } catch (error) {
            alert('Er ging iets mis bij het aanmaken van de admin.');
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
                <View className="items-center mb-6">
                    <Text className="text-3xl font-bold text-hrRed">Nieuwe admin aanmaken</Text>
                </View>

                <View className="space-y-4">
                    <Text>Email:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Email"
                        onChangeText={(text) => {
                            setEmail(text);
                            setError('');}}
                        value={email}/>
                    {error ? <Text className="text-red-500">{error}</Text> : null}
                    <Text>Geboortedatum:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="DD-MM-YYYY"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}/>
                    <Text>Status:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="actief"
                        value={status}
                        onChangeText={setStatus}/>
                    <Text>Voornaam:</Text>
                    <TextInput className="border border-hrRed rounded-md p-2" placeholder="Voornaam" onChangeText={setFname} />
                    <Text>Tussenvoegsel:</Text>
                    <TextInput className="border border-hrRed rounded-md p-2" placeholder="Tussenvoegsel" onChangeText={setInfix} />
                    <Text>Achternaam:</Text>
                    <TextInput className="border border-hrRed rounded-md p-2" placeholder="Achternaam" onChangeText={setLname} />
                    <Text>Wachtwoord:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Wachtwoord"
                        secureTextEntry
                        onChangeText={setPassword}/>
                    <Text>Herhaal wachtwoord:</Text>
                    <TextInput
                        className="border border-hrRed rounded-md p-2"
                        placeholder="Herhaal wachtwoord"
                        secureTextEntry
                        onChangeText={setConfirmPassword}/>
                    <Pressable onPress={maakAdmin} className="bg-hrRed py-3 rounded-md items-center mt-6">
                        <Text className="text-white font-semibold">Admin aanmaken</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push('/gebruikersoverzicht')} className="mt-4">
                        <Text className="text-hrRed">&larr; Terug</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
