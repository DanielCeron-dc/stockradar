import { FlatList, StyleSheet, View } from 'react-native';
import StockItem from '@/components/home/StockItem';
import ScreenContainer from '@/components/layout/ScreenContainer';
import AnimatedList from '@/components/AnimatedList';
import React from 'react';

import { applyFilters, useStockStore } from '@/store/stock.store';
import { useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import FilterActions from '@/components/home/FilterActions';
import Spacer from '@/components/layout/Spacer';
import OfflineMessage from '@/components/OfflineMessage';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function StocksScreen() {
    const [isFocused, setFocused] = React.useState(true);
    const stocks = useStockStore((state) => state.stocks);
    const querySearch = useStockStore((state) => state.querySearch);
    const querySort = useStockStore((state) => state.querySort);
    const color = useThemeColor({}, 'text');

    const stockToRender = applyFilters(stocks, querySearch, querySort);

    useFocusEffect(
        React.useCallback(() => {
            setFocused(true);
            return () => setFocused(false);
        }, []),
    );

    console.log('RENDERING LIST STOCKS');
    console.log('values', stockToRender.map((s) => s.symbol));

    return (
        <ScreenContainer
            style={styles.container}
        >
            <ThemedText type='title' >Stocks</ThemedText>
            <Spacer size='small' />
            <FilterActions />
            <Spacer size='small' />
            <OfflineMessage />
            {isFocused && <AnimatedList
                data={stockToRender}
                renderItem={({ item }) => (
                    <StockItem stock={item} />
                )}
                ItemSeparatorComponent={() => (<View style={[styles.separator, {borderColor: color}]}></View>)}
                keyExtractor={(item) => item.symbol}
            />}
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
