import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { useStockStore } from '@/store/stock.store';
import { ThemedText } from '@/components/ThemedText';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SingleStock() {
    const [mounted, setMounted] = React.useState(true);
    const { symbol } = useLocalSearchParams<{ symbol: string }>();

    const singleStock = useStockStore((state) =>
        state.stocks.get(symbol ?? '')!
    );

    useFocusEffect(
        React.useCallback(() => {
            setMounted(true);
            return () => setMounted(false);
        }, [])
    );


    return (
        <ScreenContainer style={styles.container}>
            {mounted && (
                <Animated.View style={styles.card} entering={FadeIn.duration(2000)}>
                    <ThemedText type="title" style={styles.symbol}>
                        {singleStock.symbol}
                    </ThemedText>
                    <ThemedText style={styles.name}>{singleStock.name}</ThemedText>

                    <View style={styles.row}>
                        <ThemedText style={styles.price}>
                            Price: {singleStock.price.toPrecision(5)}
                        </ThemedText>
                        <ThemedText style={styles.change}>
                            Change: {singleStock.daily_change.toPrecision(5)}
                        </ThemedText>
                        <MaterialCommunityIcons
                            name="chart-timeline-variant"
                            size={24}
                            color={singleStock.daily_change > 0 ? 'green' : 'red'}
                            style={{
                                transform: [{ rotateX: singleStock.daily_change > 0 ? '0deg' : '-180deg' }],
                            }}
                        />
                    </View>
                </Animated.View>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // flex: 1 if you want it to fill the screen
        flex: 1,
    },
    center: {
        textAlign: 'center',
    },
    card: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 16,
        gap: 8,
    },
    symbol: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    price: {
        fontSize: 16,
    },
    change: {
        fontSize: 16,
    },
});