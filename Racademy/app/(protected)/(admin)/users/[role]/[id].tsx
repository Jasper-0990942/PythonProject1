// app/users/[id].tsx

import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform , Pressable, Alert} from 'react-native';

export default function UserDetails() {
    const { id, role } = useLocalSearchParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`http://localhost:5000/users/${role}/${id}`);
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
            const res = await fetch(`http://localhost:5000/users/${role}/${id}/block`, {method: 'PATCH',});
            if (!res.ok) {
            Alert.alert("Gebruiker is nu geblokkeerd.");
            setUser({ ...user, status: 'geblokkeerd' });
            } else {
                Alert.alert("Gebruiker blokkeren in niet gelukt.");
            }
        } catch (error) {
            console.error("Fout bij blokkeren van gebruiker:", error);
            Alert.alert("Gebruiker blokkeren in niet gelukt.");}};

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#b30000" />
            </View>
        );}

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
            <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
                <View className="items-center mb-6">
                    <Text className="text-4xl font-bold text-hrRed">Gebruiker</Text>
                </View>
                <View className="w-full max-w-md self-center space-y-4">
                    <View>
                        <Text className="text-base text-gray-700">Naam:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">
                            {user.fname} {user.infix ? user.infix + ' ' : ''}{user.lname}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-700">Geboortedatum:</Text>
                        <Text className="border border-hrRed rounded-md p-2 bg-gray-50">{user.dateofbirth}</Text>
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
                <View className="w-full max-w-md self-center mt-6">
                    <Pressable onPress={blockUser} className="bg-hrRed p-3 rounded-xl">
                        <Text className="text-white text-center font-semibold">Blokkeer Gebruiker</Text>
                    </Pressable>
                </View>
                <View className="w-full max-w-md self-center mb-4">
                    <Pressable onPress={() => router.push('http://localhost:8081/gebruikersoverzicht')} className="flex-row items-center">
                        <Text className="text-hrRed text-base">&larr; Terug</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );}