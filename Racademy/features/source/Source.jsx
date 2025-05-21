import {Link} from "expo-router";
import {Text, View} from "react-native";

function Source({ source }) {

    return (
        <View className="w-full border border-gray-300 rounded mb-3">
            <View className="mb-4 bg-neutral-300 w-full h-16 borderflex justify-center items-center">
                <Text>{ source.display_name }</Text>
            </View>

            <View className="mb-9 flex items-center">
                <Text className="mb-2 color-gray-600">{ source.date_created }</Text>
                <Text>{ source.title }</Text>
                <Text>{ source.description }</Text>
                <Text>{ source.ISBN}</Text>
                <Text>{ source.link }</Text>
            </View>
        </View>

    );
}

export default Source;