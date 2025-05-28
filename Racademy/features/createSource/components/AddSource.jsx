import {Text, View, TextInput, Pressable, Image} from 'react-native';
import {useState} from "react";
import Input from "@/features/createSource/components/Input";
import ImageFileIcon from "@/assets/images/image-file-icon.png";
import ImagePicker from "@/features/createSource/components/ImagePicker";
import { useRouter } from 'expo-router'
import Ionicons from "@expo/vector-icons/Ionicons";

const router = useRouter()

function AddSource () {
    const [sourceType, setSourceType] = useState("link"); // link or book
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [isbn, setIsbn] = useState("");

    function handleSubmit() {

        fetch('http://localhost:5000/sources/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                link,
                isbn
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    router.push('/')
                }
            })

                }



    return (
        <View className=" w-11/12 sm:w-96 bg-white p-3 shadow-md shadow-neutral-200 h-full justify-center">

            <Text className="text-3xl font-bold mb-3 text-center">Bronnen</Text>
            <Pressable onPress={() => setSourceType("book")}>Link</Pressable>
            <Pressable onPress={() => setSourceType("link")}>Boek</Pressable>
            <Input placeholder="Titel" onChangeText={setTitle}/>


            {
                sourceType === 'link'
                    ? <Input placeholder="ISBN" onChangeText={setIsbn}/>
                    : <Input placeholder="Link" onChangeText={setLink}/>
            }

            <Input placeholder="Tags"/>

            <Input placeholder="Beschrijving" multiline={true} onChangeText={setDescription}/>



            <ImagePicker />


            <Pressable
                className=" mt-6 mb-11 p-2 bg-neutral-300 flex justify-center items-center"
                onPress={handleSubmit}
            >
                <Text className="font-bold text-lg">
                    Post
                </Text>
            </Pressable>
        </View>
    )
}

export default AddSource