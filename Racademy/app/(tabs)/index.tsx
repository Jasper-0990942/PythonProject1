import {SafeAreaView, View} from 'react-native'
import AddSource from "@/features/createSource/components/AddSource";



export default function HomeScreen() {
  return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-neutral-50 items-center h-screen">

            <AddSource />

        </View>
      </SafeAreaView>
  );
}

