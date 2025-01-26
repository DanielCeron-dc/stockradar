import React, { PropsWithChildren } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Platform,
    ViewStyle,
    View,
} from "react-native";

interface IProps extends PropsWithChildren { 
    style: ViewStyle
}

const ScreenContainer: React.FC<IProps> = ({ children , style}) => {
    return (
        <>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            <SafeAreaView style={styles.container}>
                <View style={ style}>
                    {children}
                </View>
            </SafeAreaView>

        </>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: "#FFF",
    },
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});

export default ScreenContainer;