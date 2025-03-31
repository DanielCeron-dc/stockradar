import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDecay,
} from 'react-native-reanimated';
import CandlestickChart, { Candle } from './CandlesStickChart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const MIN_TRANSLATE_X = -370;
const MAX_TRANSLATE_X = 0;

interface CandlestickChartWithGestureProps {
    candles: Candle[];
    
}

const CandlestickChartWithGesture: React.FC<CandlestickChartWithGestureProps> = ({ candles }) => {
    
    const translateX = useSharedValue(MIN_TRANSLATE_X);
    const startX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((event) => {
            let newTranslateX = startX.value + event.translationX;
            // Clamp the translation between the defined boundaries
            newTranslateX = Math.max(Math.min(newTranslateX, MAX_TRANSLATE_X), MIN_TRANSLATE_X);
            translateX.value = newTranslateX;
        })
        .onEnd((event) => {
           
            translateX.value = withDecay({
                velocity: event.velocityX,
                clamp: [MIN_TRANSLATE_X, MAX_TRANSLATE_X],
            });
        });

  
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ overflow: 'hidden' , minWidth: SCREEN_WIDTH }}>
                <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.chartContainer, animatedStyle]}>
                <CandlestickChart candles={candles} />
            </Animated.View>
        </GestureDetector>

        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        width: SCREEN_WIDTH,
    },
});

export default CandlestickChartWithGesture;