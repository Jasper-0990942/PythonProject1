import {StyleSheet} from 'react-native';

import Registratiescherm from "@/components/registratiescherm";
import AddSource from "@/components/AddSource";
import Home from "@/components/Home";
import {ScrollView} from "react-native";
import OverzichtUsers from "@/app/(tabs)/gebruikersoverzicht";
import TabLayout from "@/app/(tabs)/_layout";

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