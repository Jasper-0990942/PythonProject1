import "../global.css"
import {Slot} from "expo-router";

function RootLayout() {
    return (
        <Slot />
    );
}

export default RootLayout;