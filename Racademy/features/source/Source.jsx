import {Pressable, Text, View, Image, ImageBackground} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useState} from "react";

function Source({source}) {
    const [star1Pressed, setStar1Pressed] = useState(false);
    const [star2Pressed, setStar2Pressed] = useState(false);
    const [star3Pressed, setStar3Pressed] = useState(false);
    const [star4Pressed, setStar4Pressed] = useState(false);
    const [star5Pressed, setStar5Pressed] = useState(false);
    const [rating, setRating] = useState(null)


    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    console.log(source)

    function submitRating() {
        fetch(`${backendUrl}/sources/rating/`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                rating,
                "source_id": source.source_id
            })
        })
            .then(response => response.json)
            .then(data => data)

    }

    return (
        <View className="w-full border border-gray-300 rounded mb-3">
            <View className="mb-4 bg-neutral-300 w-full h-16 borderflex justify-center items-center">
                <Text>{source.display_name}</Text>
            </View>

            <View className="mb-9 flex items-center">
                <Text className="mb-2 color-gray-600">{source.date_created}</Text>
                <Text>{source.title}</Text>
                <Text>{source.description}</Text>
                <Text>{source.isbn}</Text>
                <Text>{source.link}</Text>
                <Image source={{uri: source.img}} style={{width: 500, height: '100%'}} resizeMode="contain"/>

            </View>


            <View className="flex-row flex ">
                {/*for every star seperate if statement, to control the rating */}

                <Pressable onPress={() => {
                    setStar1Pressed(true);
                    setStar2Pressed(false);
                    setStar3Pressed(false);
                    setStar4Pressed(false);
                    setStar5Pressed(false);
                    setRating(1)
                }}>
                    {
                        star1Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black"/>

                            : <Ionicons name="star-outline" size={24} color=""/>
                    }
                </Pressable>

                <Pressable onPress={() => {
                    setStar2Pressed(true);
                    setStar1Pressed(true);
                    setRating(2)
                }}>

                    {
                        star2Pressed
                            ? <><Ionicons name="star-sharp" size={24} color="black"/>

                            </>
                            : <Ionicons name="star-outline" size={24} color=""/>
                    }
                </Pressable>

                <Pressable onPress={() => {
                    setStar3Pressed(true);
                    setStar2Pressed(true);
                    setStar1Pressed(true);
                    setRating(3)
                }}>

                    {
                        star3Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black"/>
                            : <Ionicons name="star-outline" size={24} color=""/>
                    }
                </Pressable>

                <Pressable onPress={() => {
                    setStar4Pressed(true);
                    setStar3Pressed(true);
                    setStar2Pressed(true);
                    setStar1Pressed(true);
                    setRating(4)
                }}>

                    {
                        star4Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black"/>
                            : <Ionicons name="star-outline" size={24} color=""/>
                    }
                </Pressable>

                <Pressable onPress={() => {
                    setStar5Pressed(true);
                    setStar4Pressed(true);
                    setStar3Pressed(true);
                    setStar2Pressed(true);
                    setStar1Pressed(true);
                    setRating(5)
                }}>

                    {
                        star5Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black"/>
                            : <Ionicons name="star-outline" size={24} color=""/>
                    }
                </Pressable>

                <View>
                    <Pressable onPress={submitRating}><Text>Opslaan</Text></Pressable>
                    <Pressable onPress={() => {
                        setStar1Pressed(false);
                        setStar2Pressed(false);
                        setStar3Pressed(false);
                        setStar4Pressed(false);
                        setStar5Pressed(false)
                    }}><Text>Verwijderen</Text></Pressable>

                </View>
            </View>
        </View>

    );
}

export default Source;