import {StyleSheet, Image, Platform, ScrollView, SafeAreaView, View} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Home from "@/features/Home/Home";

export default function Explore() {
  return (
      <SafeAreaView className="flex-1 bg-white items-center ">
        <View className= "w-11/12 sm:w-96 bg-white p-3 shadow-md shadow-neutral-200 h-full align-center">

            <Home />

        </View>
      </SafeAreaView>
  );
}

