import {TextInput} from "react-native";

function Input({ onChangeText, placeholder }) {
    return (
        <>
            <TextInput
                className="border rounded border-neutral-300 mb-5 h-10 p-3 placeholder:text-neutral-500 focus:outline"
                onChangeText={ onChangeText }
                placeholder={placeholder}
            />
        </>
    );
}

export default Input;