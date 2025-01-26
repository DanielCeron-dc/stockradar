import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useStockStore, type IStock } from '@/store/stock.store';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

interface IProps {
    stock: IStock;
}

export default function StockItem(props: IProps) {

    const stock = useStockStore((state) => state.stocks.get(props.stock.symbol)!);

    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            router.push(`/stocks/${stock.symbol}`);
        }}>
            <View style={styles.left}>
                <ThemedText style={styles.symbol}>{stock.symbol}</ThemedText>
                <ThemedText numberOfLines={1} ellipsizeMode='tail' style={styles.name}>{stock.name}</ThemedText>
            </View>
            <View style={styles.right}>
                <ThemedText style={styles.price}>{stock.price.toPrecision(5)}</ThemedText>
                <ThemedText style={styles.dailyChange}>{stock.daily_change.toPrecision(5)}</ThemedText>
            </View>
            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color={stock.daily_change > 0 ? 'green' : 'red'} style={{ transform: [{ rotateX: stock.daily_change > 0 ? "0deg" : "-180deg" }] }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 5,
    },
    left: {
        flex: 1,
    },
    right: {
        flex: 1,
    },
    symbol: {
        fontSize: 16,
    },
    name: {
        fontSize: 14
    },
    price: {
        fontSize: 16,
    },
    dailyChange: {
        fontSize: 14,
    },
});