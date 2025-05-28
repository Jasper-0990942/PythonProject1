import {Pressable, Text, View, Image, ImageBackground} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useState} from "react";

function Source({ source }) {
    const [star1Pressed, setStar1Pressed] = useState(false);
    const [star2Pressed, setStar2Pressed] = useState(false);
    const[star3Pressed, setStar3Pressed] = useState(false);
    const[star4Pressed, setStar4Pressed] = useState(false);
    const[star5Pressed, setStar5Pressed] = useState(false);

    return (
        <View className="w-full border border-gray-300 rounded mb-3">
            <View className="mb-4 bg-neutral-300 w-full h-16 borderflex justify-center items-center">
                <Text>{ source.display_name }</Text>
            </View>

            <View className="mb-9 flex items-center">
                <Text className="mb-2 color-gray-600">{ source.date_created }</Text>
                <Text>{ source.title }</Text>
                <Text>{ source.description }</Text>
                <Text>{ source.isbn}</Text>
                <Text>{ source.link }</Text>
                <Image source={{ uri: source.img }} style={{width: 500, height: '100%'}} resizeMode="contain"/>

            </View>



            <View className="flex-row flex ">
                {/*for every star seperate if statement, to control the rating */}

                <Pressable onPress={() => setStar1Pressed(!star1Pressed)}>
                    {
                        star1Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black" />

                            : <Ionicons name="star-outline" size={24} color="" />
                    }
                </Pressable>

                <Pressable onPress={() => setStar2Pressed(!star2Pressed)}>

                    {
                        star2Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black" />
                            : <Ionicons name="star-outline" size={24} color="" />
                    }
                </Pressable>

                <Pressable onPress={() => setStar3Pressed(!star3Pressed)}>

                    {
                        star3Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black" />
                            : <Ionicons name="star-outline" size={24} color="" />
                    }
                </Pressable>

                <Pressable onPress={() => setStar4Pressed(!star4Pressed)}>

                    {
                        star4Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black" />
                            : <Ionicons name="star-outline" size={24} color="" />
                    }
                </Pressable>

                <Pressable onPress={() => setStar5Pressed(!star5Pressed)}>

                    {
                        star5Pressed
                            ? <Ionicons name="star-sharp" size={24} color="black" />
                            : <Ionicons name="star-outline" size={24} color="" />
                    }
                </Pressable>

            </View>
        </View>

    );
}

export default Source;