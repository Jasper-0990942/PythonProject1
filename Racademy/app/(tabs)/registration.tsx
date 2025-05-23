import {StyleSheet, Image, Platform, ScrollView, SafeAreaView, View} from 'react-native';

import AddSource from "@/features/createSource/components/AddSource";
import Registratiescherm from "@/components/registratiescherm";
import TabLayout from "@/app/(tabs)/_layout";

export default function Explore() {
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
