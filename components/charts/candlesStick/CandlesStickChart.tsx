import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { scaleLinear, scaleBand } from 'd3-scale';
import { min, max } from 'd3-array';
import { IHistoryEntry } from '@/store/stock.store';

export interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
}

interface CandlestickChartProps {
    candles: Candle[];
    history?: IHistoryEntry[];
    width?: number;
    height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ candles, width, height }) => {

    const chartWidth = width || Dimensions.get('window').width - 40; 
    const chartHeight = height || 200;


    const yMin = min(candles, d => d.low) || 0;
    const yMax = max(candles, d => d.high) || 0;
    const yScale = scaleLinear().domain([yMin, yMax]).range([chartHeight, 0]);

    // Compute X-axis scale using a band scale for discrete candles
    const xScale = scaleBand()
        .domain(candles.map((_, index) => index.toString()))
        .range([0, chartWidth * 2])
        .padding(0.2);

    return (

        <Svg width={chartWidth * 2} height={chartHeight} style={{ marginVertical: 20}}>
            {candles.map((candle, index) => {
                const x = xScale(index.toString()) || 0;
                const candleWidth = xScale.bandwidth();
                const openY = yScale(candle.open);
                const closeY = yScale(candle.close);
                const highY = yScale(candle.high);
                const lowY = yScale(candle.low);
                const candleColor = candle.close >= candle.open ? 'green' : 'red';

                return (
                    <React.Fragment key={index}>
                        <Line
                            x1={x + candleWidth / 2}
                            x2={x + candleWidth / 2}
                            y1={highY}
                            y2={lowY}
                            stroke={candleColor}
                            strokeWidth={1}
                        />

                        <Rect
                            x={x}
                            y={Math.min(openY, closeY)}
                            width={candleWidth}
                            height={Math.abs(openY - closeY)}
                            fill={candleColor}
                        />

                        <Line
                            x1={x}
                            x2={x + candleWidth}
                            y1={(openY + closeY) / 2}
                            y2={(openY + closeY) / 2}
                            stroke={'black'}
                            strokeWidth={1}
                        />
                    </React.Fragment>
                );
            })}
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
});

export default CandlestickChart;