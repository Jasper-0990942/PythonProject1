import React from 'react';
import {Text, View, TextInput, Pressable, Image} from 'react-native';
import {Link} from "expo-router";

function Home() {
    return (
        <View className="w-11/12 sm:w-96 bg-white p-3 shadow-md shadow-neutral-200 h-full ">
        <View className="bg-blue-950 mb-10 rounded h-14">
            <Text className="font-bold text-xl color-white">Adele5000</Text>
        </View>

        <View className="bg-gray-50 h-90 mb-5">
            <Text className="font-bold text-xl mt-7 mb-4">Javascript Cursus 2025</Text>
            <Text className="text-sm">Javascript, Web-development, Video </Text>
            <Link className="text-xl  mt-7" href="https://www.youtube.com/watch?v=EerdGm-ehJQ&t=44880s">Klik hier! </Link>
        </View>

        <View className="bg-blue-950 mt-6 rounded h-14 " >
            <Text className="font-bold text-xl color-white">Beyonceyy22</Text>
        </View>

        <View className="bg-gray-50 h-90 mb-5">
            <Text className="font-bold text-xl mt-7 mb-4">Python Hulp</Text>
            <Text className="text-sm">Python, Backend, Website </Text>
            <Link className="text-xl  mt-7" href="https://www.w3schools.com/python/default.asp">Klik hier! </Link>


        </View>
        </View>
    );
}

export default Home;