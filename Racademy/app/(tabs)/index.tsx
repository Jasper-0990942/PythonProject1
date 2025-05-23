import {StyleSheet} from 'react-native';

import Registratiescherm from "@/components/registratiescherm";
import AddSource from "@/components/AddSource";
import Home from "@/components/Home";
import {ScrollView} from "react-native";
import OverzichtUsers from "@/app/(tabs)/gebruikersoverzicht";
import TabLayout from "@/app/(tabs)/_layout";
import {SafeAreaView, ScrollView, View} from 'react-native'
import Home from "@/features/Home/Home";


export default function HomeScreen() {
  return (
      <>
        <Registratiescherm/>

      {/*<ScrollView className="flex-1 bg-white">*/}
      {/*{  <AddSource /> }*/}
      {/*</ScrollView>*/}
        <TabLayout/>
        </>
  );
}
      <ScrollView>
          <SafeAreaView className="flex-1 bg-white">
            <View className="bg-neutral-50 items-center h-screen">

                <Home />

            </View>
          </SafeAreaView>
      </ScrollView>
  );
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export function Hello() {
    return (
        <ScrollView className="flex-1 bg-white">
            <Home />
            <OverzichtUsers/>
        </ScrollView>
    )
}