import { FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';
import React from 'react';

import { useStockStore } from '@/store/stock.store';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import Spacer from '@/components/layout/Spacer';
import StockItem from '@/components/home/StockItem';

export default function StocksScreen() {

    const stocks = useStockStore((state) => state.stocks);

    const stockToRender = Array.from(stocks.values());

    console.log('RENDERING LIST STOCKS');
    console.log('values', stockToRender.map((s) => s.symbol));

    return (
        <ScreenContainer
            style={styles.container}
        >
            <ThemedText type='title' >Stocks</ThemedText>
            <Spacer size='small' />
            <FlatList
                data={stockToRender}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => <StockItem stock={item} />}
            />
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
