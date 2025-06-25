import {StyleSheet, Image, Platform, ScrollView, SafeAreaView, View} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Home from "@/features/Home/Home";
import AddSource from "@/features/createSource/components/AddSource";
import Source from "@/features/source/Source";

export default function Explore() {
  return (
      <SafeAreaView className="flex-1 bg-white items-center ">
            <View>

                <AddSource />

            </View>
      </SafeAreaView>

  );
}

