import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSocket } from '@/hooks/useSockets';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useSocket({
    url: Constants.expoConfig?.extra?.socketUrl || (Platform.OS === "android" ? "http://10.0.2.2:3000" : 'http://localhost:3000'),
    opts: {},
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="stocks"
            options={{ title: 'Stocks' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>

    </GestureHandlerRootView>
  );
}