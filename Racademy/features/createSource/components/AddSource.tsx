import {Text, View, Pressable, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useState} from 'react';
import Input from '@/features/createSource/components/Input';
import ImagePicker from '@/features/createSource/components/ImagePicker';
import {useRouter} from 'expo-router';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

function AddSource() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [sourceType, setSourceType] = useState<'link' | 'book'>('link');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [isbn, setIsbn] = useState('');
    const [tags, setTags] = useState('');

    async function handleSubmit() {
        try {
            console.log('Sending POST to:', `${apiBaseUrl}/sources/makesource`);

            const response = await fetch(`${apiBaseUrl}/sources/makesource`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    link: sourceType === 'link' ? link : '',
                    isbn: sourceType === 'book' ? isbn : '',
                    image,
                    tags,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push('/explore');
            } else {
                console.error('Fout bij opslaan:', data);
            }
        } catch (err) {
            console.error('Netwerkfout:', err);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
                className="bg-white px-6 pt-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled">
                <View className="min-h-screen bg-white p-3 shadow-md shadow-neutral-200">
                <Text className="text-3xl font-bold mb-3 text-center">Bronnen</Text>
                    <View className="flex-row justify-between mb-4">
                        <Pressable
                            onPress={() => setSourceType('link')}
                            className={`flex-1 py-2 rounded-md mr-1 items-center ${sourceType === 'link' ? 'bg-hrRed' : 'bg-neutral-200'}`}>
                            <Text className={sourceType === 'link' ? 'text-white font-bold' : 'text-black'}>Link</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setSourceType('book')}
                            className={`flex-1 py-2 rounded-md ml-1 items-center ${sourceType === 'book' ? 'bg-hrRed' : 'bg-neutral-200'}`}>
                            <Text className={sourceType === 'book' ? 'text-white font-bold' : 'text-black'}>Boek</Text>
                        </Pressable>
                    </View>
                    <Input placeholder="Titel" onChangeText={setTitle} />
                    {sourceType === 'book' ? (
                        <Input placeholder="ISBN" onChangeText={setIsbn} />
                    ) : (
                        <Input placeholder="Link" onChangeText={setLink} />)}
                    <Input placeholder="Tags (optioneel)" onChangeText={setTags} />
                    <Input placeholder="Beschrijving" onChangeText={setDescription} />
                    <ImagePicker setImage={setImage} image={image} />
                    <Pressable
                        className="mt-6 mb-11 p-2 bg-hrRed flex justify-center items-center rounded-md"
                        onPress={handleSubmit}>
                        <Text className="font-bold text-white text-lg">Opslaan</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );}

export default AddSource;
