import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

type User = {
    id: number;
    studentnr?: number;
    email: string;
    fname: string;
    infix?: string;
    lname: string;
    status: string;
    role: 'user' | 'admin';
};

export default function OverzichtUsers() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'user' | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [pickerZien, setPickerZien] = useState(false);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [studentNummerFilter, setStudentNummerFilter] = useState<string>('');

    const roles = ['user', 'admin'];

    async function fetchUsers() {
        try {
            console.log('Fetching users apart');
            console.log('API URL:', apiBaseUrl);

            const res = await fetch(`${apiBaseUrl}/users/apart`);
            const json = await res.json();
            const combined = [...json.admins, ...json.users];
            console.log('Gebruikersdata ontvangen', combined);
            setUsers(combined);
        } catch (error) {
            console.error('Fout bij het ophalen van gebruikers:', error);
        } finally {
            setLoading(false);
        }}

    useEffect(() => {
        const fetchUserRoleAndUsers = async () => {
            const storedRole = await AsyncStorage.getItem('userType');
            if (storedRole === 'admin' || storedRole === 'user') {
                setCurrentUserRole(storedRole);}
            await fetchUsers();};

        fetchUserRoleAndUsers();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#b30000" />
            </View>
        );}

    const filteredUsers = users.filter((user) => {
        const fullName = `${user.fname} ${user.infix ?? ''} ${user.lname}`.toLowerCase();
        const matchesName = fullName.includes(nameFilter.toLowerCase());
        const matchesRole = roleFilter === '' || user.role === roleFilter;
        const matchesStudentNummer =
            studentNummerFilter === '' ||
            (typeof user.studentnr === 'number' &&
                user.studentnr.toString().includes(studentNummerFilter));
        return matchesName && matchesRole && matchesStudentNummer;});

    return (
        <ScrollView className="flex-1 bg-white px-6 pt-6">
            <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-hrRed">Gebruikersoverzicht</Text>
            </View>
            {currentUserRole === 'admin' && (
                <View className="mb-4">
                    <Pressable
                        onPress={() => router.push('/newadmin')}
                        className="bg-hrRed px-4 py-2 rounded-md mt-4 items-center">
                        <Text className="text-white font-semibold">Nieuwe admin aanmaken</Text>
                    </Pressable>
                </View>)}
            <View className="flex-row flex-wrap gap-2 mb-6">
                <TextInput
                    placeholder="Filter op naam"
                    value={nameFilter}
                    placeholderTextColor="#7f7f7f"
                    onChangeText={setNameFilter}
                    className="border rounded-md p-2 border-hrRed flex-1 min-w-[48%]" />
                <TextInput
                    placeholder="Filter op studentnummer"
                    value={studentNummerFilter}
                    placeholderTextColor="#7f7f7f"
                    onChangeText={setStudentNummerFilter}
                    keyboardType="numeric"
                    className="border rounded-md p-2 border-hrRed flex-1 min-w-[48%]" />
                <Pressable
                    onPress={() => setPickerZien(true)}
                    className="border border-gray-300 p-2 rounded-md flex-1 min-w-[45%] bg-gray-100">
                    <Text className={`text-gray-700 ${!roleFilter ? 'text-gray-400' : ''}`}>
                        {roleFilter ? `Rol: ${roleFilter}` : 'Filter op rol'}
                    </Text>
                </Pressable>
            </View>
            <Modal visible={pickerZien} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-center items-center bg-black/50"
                    onPressOut={() => setPickerZien(false)}>
                    <TouchableOpacity activeOpacity={1} className="bg-white p-4 rounded-xl w-64 shadow-lg">
                        <Text className="text-lg font-semibold mb-2">Selecteer rol</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setRoleFilter('');
                                setPickerZien(false);}}
                            className={`py-2 px-3 rounded-md ${roleFilter === '' ? 'bg-hrRed/10' : 'hover:bg-gray-100'}`}>
                            <Text className={`${roleFilter === '' ? 'text-hrRed font-bold' : ''}`}>Alle rollen</Text>
                        </TouchableOpacity>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role}
                                onPress={() => {
                                    setRoleFilter(role);
                                    setPickerZien(false);}}
                                className={`py-2 px-3 rounded-md ${roleFilter === role ? 'bg-hrRed/10' : 'hover:bg-gray-100'}`}>
                                <Text className={`${roleFilter === role ? 'text-hrRed font-bold capitalize' : 'capitalize'}`}>
                                    {role}
                                </Text>
                            </TouchableOpacity>))}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <View className="space-y-4">
                {filteredUsers.map((user) => (
                    <View key={`${user.role}-${user.id}`} className="border border-hrRed rounded-xl p-4 bg-gray-50 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800">
                            {user.fname} {user.infix ?? ''} {user.lname}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            {user.email} ({user.role})
                        </Text>
                        {currentUserRole === 'admin' && (
                            <Pressable
                                onPress={() => router.push(`/users/${user.role}/${user.id}`)}
                                className="mt-3 bg-hrRed py-2 px-4 rounded-md items-center">
                                <Text className="text-white font-medium">Bekijk details</Text>
                            </Pressable>)}
                    </View>))}
            </View>
        </ScrollView>);}