import {  StyleSheet, Text } from 'react-native';
import React from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';


export default function StocksScreen() {

   
    return (
        <ScreenContainer
            style={styles.container}
        >
            <Text>Stocks</Text>
         
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    separator: {

        width: "100%",
        borderTopWidth: 2,
        borderColor: "black"
    }
});
