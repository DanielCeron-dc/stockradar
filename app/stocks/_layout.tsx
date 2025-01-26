import { Stack } from 'expo-router';

export default function StocksLayout() {
    return (
        <Stack
            initialRouteName="index"
        >
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="[symbol]"
                options={{ title: 'Stock Details' }}
            />
        </Stack>
    );
}