import {StyleSheet, Image, Platform, ScrollView, SafeAreaView, View} from 'react-native';

import AddSource from "@/features/createSource/components/AddSource";
import Registratiescherm from "@/app/Registratiescherm";
import TabLayout from "@/app/(tabs)/_layout";

export default function Explore() {
  return (
       <>
        <Registratiescherm/>

        <TabLayout/>
        </>
  );
}