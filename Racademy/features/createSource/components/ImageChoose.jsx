
import {View, Pressable, Text, Image} from "react-native"
import {useState} from "react";
import {launchImageLibraryAsync} from "expo-image-picker";


export default function ImageChoose () {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    } else {
      alert("je hebt geen img geselecteerd")
    }
  }


  return (
    <View className="bg-amber-300">
      <Pressable className=" backdrop-contrast-75 bg-blue-950" title="Pick an image from camera roll" onPress={pickImage}>HOI</Pressable>
      {image && <Image source={{ uri: image }} className="w-96 h-96" resizeMode="contain" />}
    </View>
  )
};

