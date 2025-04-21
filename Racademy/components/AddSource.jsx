import {Text, View, TextInput, Button, Pressable} from 'react-native';

function AddSource () {
    return (
        <View className="bg-white justify-center items-center grid">
            <Text className="text-3xl font-bold mt-7 mb-11">Bronnen</Text>

            <Text className="font-bold size-8">Titel</Text>
            <TextInput
                className="border rounded border-gray-400 mb-5 h-8 w-80"
            />
            <Text className="font-bold size-8">Tags</Text>
            <TextInput className="border rounded border-gray-400 mb-5 h-8"
            />
            <Text className="font-bold size-8 w-60">Beschrijving</Text>
            <TextInput className="border rounded border-gray-400 h-48 mb-5 bg-cyan-100 "
            />
            <Text className="font-bold">Afbeelding</Text>
            <TextInput/>

            <View className="w-60 h-10 bg-blue-300 flex justify-center items-center font-bold">
            <Pressable> Post </Pressable>
            </View>
        </View>
    );
}

export default AddSource