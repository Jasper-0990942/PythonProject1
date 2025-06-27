// app/users/[id].tsx

import {useRouter} from "expo-router";
import {useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

export default function UserDetails() {
    const {id, role} = useLocalSearchParams();
    const [user, setUser] = useState<any>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const haalGebruikerRolOp = async () => {
            const role = await AsyncStorage.getItem('userType');
            if (role) {
                setCurrentUserRole(role);
            }};
        haalGebruikerRolOp();
    }, []);


    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${apiBaseUrl}/users/${role}/${id}`);
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error('Fout bij ophalen gebruiker:', error);
            } finally {
                setLoading(false);
            }}
        if (id && role) fetchUser();
    }, [id, role]);

    const blockUser = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${apiBaseUrl}/users/${role}/${id}/block`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },});
            const data = await res.json();
            if (res.ok && data.success) {
                alert("Gebruiker is nu geblokkeerd.");
                setUser({...user, status: 'geblokkeerd'});
            } else {
                alert("Gebruiker blokkeren is niet gelukt.");}
        } catch (error) {
            console.error("Fout bij blokkeren van gebruiker:", error);
            alert("Gebruiker blokkeren is niet gelukt.");
        }};

    const unblockUser = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${apiBaseUrl}/users/${role}/${id}/unblock`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert("Gebruiker is gedeblokkeerd.");
                setUser({...user, status: 'actief'});
            } else {
                alert("Deblokkeren is niet gelukt.");}
        } catch (error) {
            console.error("Fout bij deblokkeren van gebruiker:", error);
            alert("Deblokkeren is niet gelukt.");
        }};

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#b30000"/>
            </View>
        );
    }

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-700">Gebruiker niet gevonden.</Text>
            </View>
        );}

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <ScrollView contentContainerStyle={{padding: 24}} keyboardShouldPersistTaps="handled">
                <View className="items-center mb-6">
                    <Text className="text-4xl font-bold text-hrRed">Gebruiker</Text>
                </View>
                <View className="w-full max-w-md self-center space-y-4">
                    <View>
                        <Text className="text-base text-gray-700">Voornaam:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.fname}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Tussenvoegsel:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.infix}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Achternaam:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.lname}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Displaynaam:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.display_name}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Geboortedatum:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.dateofbirth}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Studentnummer:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.studentnr}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Email:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.email}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Status:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.status}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Rol:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.role}</Text>
                    </View>
                </View>
                {currentUserRole === 'admin' && user.role !== 'admin' && (
                    <View className="w-full max-w-md self-center mt-6 space-y-4">
                        {user.status === 'actief' && (
                            <Pressable onPress={blockUser} className="bg-hrRed p-3 rounded-xl">
                                <Text className="text-white text-center font-semibold">Blokkeer gebruiker</Text>
                            </Pressable>)}
                        {user.status === 'geblokkeerd' && (
                            <Pressable onPress={unblockUser} className="bg-green-600 p-3 rounded-xl">
                                <Text className="text-white text-center font-semibold">Deblokkeer gebruiker</Text>
                            </Pressable>)}
                    </View>)}
                <View className="w-full max-w-md self-center mb-4">
                    <Pressable onPress={() => router.push('/gebruikersoverzicht')}
                               className="flex-row items-center">
                        <Text className="text-hrRed text-base">&larr; Terug naar overzicht</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );}