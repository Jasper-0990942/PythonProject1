import {Link} from "expo-router";
import {Text, View} from "react-native";

function Source({ source }) {

    return (
        <View className="w-full ">
            <View className="mb-4 bg-gray-500 w-full h-16">
                <Text>{ source.display_name }</Text>
            </View>

            <View className="mb-9">
                <Text>{ source.title }</Text>
                <Text>{ source.description }</Text>
            </View>
        </View>

    );
}

export default Source;