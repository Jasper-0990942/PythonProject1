import React from 'react';
import {Text, View, TextInput, Pressable, Image} from 'react-native';
import {Link} from "expo-router";

function Home() {
    return (
        <View className="bg-blue-950 mb-10 rounded h-50">
            <Text className="font-bold text-xl color-white">Adele5000</Text>


        <View className="bg-gray-50 h-90">
            <Text className="font-bold text-xl mt-7 mb-4">Javascript course 2025</Text>
            <Text className="text-sm">Javascript, Web-development, Video </Text>
            <Link className="text-xl  mt-7" href="https://www.youtube.com/watch?v=EerdGm-ehJQ&t=44880s">Klik hier! </Link>
            <Image className="w-1 h-2" source={require('../assets/images/course.png')} />
        </View>

        </View>
    );
}

export default Home;