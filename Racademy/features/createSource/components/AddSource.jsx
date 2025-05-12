import {Text, View, TextInput, Pressable} from 'react-native';
import {useState} from "react";
import Input from "@/features/createSource/components/Input";

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
            .then(data => console.log(data))
    }


    return (
        <View className=" w-11/12 sm:w-96 bg-white p-3 shadow-md shadow-neutral-200 h-full justify-center">
            <Text className="text-3xl font-bold mb-11 text-center">Bronnen</Text>

            <Input placeholder="Titel" onChangeText={setTitle}/>

            {
                sourceType === "link"
                    ? <Input placeholder="ISBN" onChangeText={setIsbn}/>
                    : <Input placeholder="Link" onChangeText={setLink}/>
            }

            <Input placeholder="Tags"/>

            <Input placeholder="Beschrijving" multiline={true} onChangeText={setDescription}
                   className="border rounded border-gray-400 h-48 mb-5"/>

            <Text className="font-bold">Afbeelding</Text>


            <Pressable
                className="p-2 bg-blue-300 flex justify-center items-center"
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