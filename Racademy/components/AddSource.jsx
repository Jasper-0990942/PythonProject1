import {Text, ScrollView, View} from 'react-native';

function AddSource () {
    return (
        <ScrollView className="flex-1">
            <View className="items-center justify-center bg-rac border rounded-lg shadow-lg shadow-neutral-300 ">
                <Text className="text-5xl  font-bold underline ">Bron toevoegen</Text>
            </View>
        </ScrollView>
    );
}

export default AddSource