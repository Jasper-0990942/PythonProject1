import {SafeAreaView, ScrollView, View} from 'react-native'
import Home from "@/features/Home/Home";


export default function HomeScreen() {
    return (

        <ScrollView>
            <SafeAreaView className="flex-1 bg-white">
                <View className="bg-neutral-50 items-center h-screen">

                    <Home/>

                </View>
            </SafeAreaView>
        </ScrollView>
    );
}