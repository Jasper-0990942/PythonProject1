import {Link} from "expo-router";
import {Text, View} from "react-native";

function Source({ source }) {

    return (
        <View className="w-full ">
            <View className="mb-4 bg-neutral-300 w-full h-16">
                <Text>{ source.display_name }</Text>
            </View>

            <View className="mb-9">
                <Text>{ source.title }</Text>
                <Text>{ source.description }</Text>
                <Text>{ source.ISBN}</Text>
                <Text>{ source.link }</Text>
            </View>
        </View>

    );
}

export default Source;