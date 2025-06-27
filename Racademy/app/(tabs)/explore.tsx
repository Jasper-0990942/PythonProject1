import {StyleSheet, Image, Platform, ScrollView, SafeAreaView, View} from 'react-native';
import AddSource from "@/features/createSource/components/AddSource";
import Source from "@/features/source/Source";

export default function Explore() {
  return (
      <SafeAreaView className="flex-1 bg-white items-center ">
            <View>

                <AddSource />

            </View>
      </SafeAreaView>
  );}