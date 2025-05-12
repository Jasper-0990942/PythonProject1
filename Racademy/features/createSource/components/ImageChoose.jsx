import * as ImagePicker from "expo-image-picker"
import {View, Image, Pressable, Text} from "react-native"


export default function ImageChoose () {

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      console.log(result);
    } else {
      alert("je hebt geen img geselecteerd")
    }
  }


  return (
    <View className="bg-amber-300">
      <Text>Hellooo</Text>
      <Pressable className=" backdrop-contrast-75 bg-blue-950" title="Pick an image from camera roll" onPress={pickImage}>HOI</Pressable>
    </View>
  )
};

