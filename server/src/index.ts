import { Server } from 'socket.io';
import dummyStockData from '../data/dummy_stock_data.json';

// Define interfaces for history entries, candles, and stocks
interface IHistoryEntry {
    timestamp: number;
    price: number;
    daily_change: number;
}

interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
}

interface IStock {
    symbol: string;
    name: string;
    price: number;
    daily_change: number;
    history?: IHistoryEntry[];
    candles?: Candle[];
}

// Cast dummyStockData to our expected type shape
const StockData = dummyStockData as { stocks: IStock[] };

// Define the candle interval in milliseconds (e.g., 1 minute)
const CANDLE_INTERVAL_MS = 2000;

/**
 * Computes candle data from a stock's history.
 * Groups history entries into candles based on a fixed time interval.
 *
 * @param history Array of history entries.
 * @param intervalMs Time interval in milliseconds for each candle (default is 60000 ms).
 * @returns An array of Candle objects.
 */
function computeCandles(history: IHistoryEntry[], intervalMs: number = CANDLE_INTERVAL_MS): Candle[] {
    if (!history || history.length === 0) return [];
    
    // Ensure history is sorted by timestamp
    const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const candles: Candle[] = [];
    
    // Set the start of the first interval to the timestamp of the first entry
    let currentIntervalStart = sortedHistory[0].timestamp;
    let currentEntries: IHistoryEntry[] = [];
    
    for (const entry of sortedHistory) {
        // If the entry falls within the current interval, add it to the group
        if (entry.timestamp < currentIntervalStart + intervalMs) {
            currentEntries.push(entry);
        } else {
            // Compute candle for the current interval if there are any entries
            if (currentEntries.length > 0) {
                const open = currentEntries[0].price;
                const close = currentEntries[currentEntries.length - 1].price;
                const high = Math.max(...currentEntries.map(e => e.price));
                const low = Math.min(...currentEntries.map(e => e.price));
                candles.push({ open, close, high, low });
            }
            // Advance currentIntervalStart until the entry fits in the new interval
            while (entry.timestamp >= currentIntervalStart + intervalMs) {
                currentIntervalStart += intervalMs;
            }
            // Start a new group for the current interval
            currentEntries = [entry];
        }
    }
    
    // Handle any remaining entries
    if (currentEntries.length > 0) {
        const open = currentEntries[0].price;
        const close = currentEntries[currentEntries.length - 1].price;
        const high = Math.max(...currentEntries.map(e => e.price));
        const low = Math.min(...currentEntries.map(e => e.price));
        candles.push({ open, close, high, low });
    }

    if (candles.length > 30) {
        // Limit the number of candles to the last 60
        return candles.slice(candles.length - 30);
    }
    
    return candles;
}

const io = new Server({
    cors: {
        origin: ['http://localhost:8081'],
    },
});

io.on('connection', (socket) => {
    console.log(`connect: ${socket.id}`, socket.request.headers);

    // Initialize each stock with a history entry and computed candles.
    const stocksWithHistory = StockData.stocks.map((stock: IStock) => {
        if (!stock.history) {
            stock.history = [{
                timestamp: Date.now(),
                price: stock.price,
                daily_change: stock.daily_change,
            }];
        }
        // Compute candles based on the defined interval
        stock.candles = computeCandles(stock.history, CANDLE_INTERVAL_MS);
        return stock;
    });

    socket.emit('onInitialStocks', stocksWithHistory);

    socket.on('disconnect', () => {
        console.log(`disconnect: ${socket.id}`);
    });
});

// Update a random stock every 100ms
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * StockData.stocks.length);
    const randomStock = StockData.stocks[randomIndex];
    // Update stock's price and daily change
    randomStock.daily_change = Math.random() * 10 - 5;
    randomStock.price += randomStock.daily_change;
    // Ensure history exists and append the new update
    if (!randomStock.history) {
        randomStock.history = [];
    }
    randomStock.history.push({
        timestamp: Date.now(),
        price: randomStock.price,
        daily_change: randomStock.daily_change,
    });
    // Recompute the candles based on the updated history
    randomStock.candles = computeCandles(randomStock.history, CANDLE_INTERVAL_MS);

    io.emit('onChangeStock', randomStock);
}, 50);

io.listen(3000);
console.log('Socket.IO server listening on port 3000');