import { Candle } from '@/components/charts/candlesStick/CandlesStickChart';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';


export interface IHistoryEntry {
    timestamp: number;
    price: number;
    daily_change: number;
}
export interface IStock {
    symbol: string;
    name: string;
    price: number;
    daily_change: number;
    candles?: Candle[];
}

interface IStockStore {
    stocks: Map<string, IStock>;
    querySearch: string;
    querySort: 'asc' | 'desc';
    setQuerySearch: (search: string) => void;
    setQuerySort: (sort: 'asc' | 'desc') => void;
    modifyStock: (symbol: string, updatedStock: IStock) => void;
    updateSpecificStock: (symbol: string, updatedStock: IStock) => void;
    setStocks: (stocks: Map<string, IStock>) => void;
}

export const useStockStore = create<IStockStore>()((set) => ({
    stocks: new Map(),
    querySearch: '',
    querySort: 'asc',
    setQuerySearch: (search) => set({ querySearch: search }),
    setQuerySort: (sort) => set({ querySort: sort }),
    modifyStock: (symbol, updatedStock) =>
        set((state) => {
            const newStocks = new Map(state.stocks);
            newStocks.set(symbol, updatedStock);
            return { stocks: newStocks };
        }),
    updateSpecificStock: (symbol, updatedStock) =>
        set((state) => {
            // update without changing the reference to the map
            state.stocks.set(symbol, updatedStock);
            return { stocks: state.stocks };
        }),
    setStocks: (stocks) => set({ stocks }),
}));

export function socketEvents(socket: Socket) {
    socket.on('onInitialStocks', (stocks: IStock[]) => {
        const stockMap = new Map<string, IStock>();
        stocks.forEach((stock) => {
            stockMap.set(stock.symbol, stock);
        });
        useStockStore.getState().setStocks(stockMap);
    });

    socket.on('onChangeStock', (updatedStock: IStock) => {
        // Update the store and add the new price update to the stock's history
        useStockStore.getState().updateSpecificStock(updatedStock.symbol, updatedStock);
    });
}

export function applyFilters(
    stocks: Map<string, IStock>,
    querySearch: string,
    querySort: 'asc' | 'desc'
) {
    let stockArray = Array.from(stocks.values());

    const stockToRender =
        querySearch.length === 0
            ? stockArray
            : stockArray.filter((stock) =>
                stock.symbol.toLowerCase().includes(querySearch.toLowerCase())
            );

    if (querySort === 'asc') {
        stockToRender.sort((a, b) => a.price - b.price);
    } else if (querySort === 'desc') {
        stockToRender.sort((a, b) => b.price - a.price);
    }

    return stockToRender;
}