import React from "react";
import { View } from "react-native";

interface IProps {
    size: 'small' | 'medium' | 'large';
}

export default function Spacer({ size }: IProps) {

    const sizeInPixels = size === 'small' ? 10 : size === 'medium' ? 20 : 30;

    return <View style={{ 
        height: sizeInPixels, 
        width: sizeInPixels
    }} />;
}