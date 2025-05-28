
import {View, Pressable, Text, Image} from "react-native"
import {useState} from "react";
import {launchImageLibraryAsync} from "expo-image-picker";
import ImageFileIcon from "@/assets/images/image-file-icon.png";


export default function ImagePicker ({image, setImage}) {
  const [alert, setAlert] = useState('');

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    console.log(result)
    console.log(result.assets[0].uri)


  if (!result.canceled) {
      setImage(result.assets[0].uri)
      setAlert(null)}
  else if (image === null)
    {setAlert('Geen afbeelding geselecteerd')}
  }



  return (
    <View className="mt-5">
      <Text>{alert}</Text>
      <Pressable
          className="border border-neutral-300 rounded-md p-5"
          title="Pick an image from camera roll"
          onPress={pickImage}>
          <View className="items-center h-40">
            {

              image
                ? <Image source={{ uri: image }} style={{width: 400, height: '100%'}} resizeMode="contain"/>
                :
                <Image className=""
                    style={{width: 400, height: '100%'}}
                    resizeMode="contain" source={ ImageFileIcon } />

            }
          </View>


      </Pressable>
    </View>
  )
};
