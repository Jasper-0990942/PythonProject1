import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Source from "@/features/source/Source";

function Home() {

    const [sources, setSources] = useState([]);

    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL

    useEffect(() => {
        fetch(`${backendUrl}/sources/`)
            .then(response => response.json())
            .then(data => setSources(data.sources));
    }, []);


    return (
        <View className="w-11/12 sm:w-96 bg-white p-3 shadow-md shadow-neutral-200 h-full justify-center">
            <FlatList
                data={ sources }
                keyExtractor={ item => item.id}
                renderItem={({ item }) => (
                   <Source source={item} />
                )}
            />
        </View>
    );
}

export default Home;