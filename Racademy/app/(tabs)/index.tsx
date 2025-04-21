
import AddSource from "@/components/AddSource";
import Home from "@/components/Home";
import {ScrollView} from "react-native";

export default function HomeScreen() {
  return (
      <ScrollView className="flex-1 bg-white">
        <AddSource />
      </ScrollView>
  );
}
