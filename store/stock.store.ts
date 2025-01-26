import { Socket } from 'socket.io-client';
import { create } from 'zustand';

export interface IStock {
    symbol: string;
    name: string;
    price: number;
    daily_change: number;
}

interface IStockStore {
    stocks: Map<string, IStock>;
    querySearch: string;
    modifyStock: (symbol: string, updatedStock: IStock) => void; 
    setStocks: (stocks: Map<string, IStock>) => void;
}

export const useStockStore = create<IStockStore>()((set) => ({
    stocks: new Map(),
    querySearch: '',
    querySort: 'asc',
    modifyStock: (symbol, updatedStock) =>
        set((state) => {
            const newStocks = new Map(state.stocks);
            newStocks.set(symbol, updatedStock);

            return { stocks: newStocks };
        }),
    setStocks: (stocks) => set({ stocks }),
}));

export function socketEvents(socket: Socket) {

    socket.on('onInitialStocks', (stocks: IStock[]) => {

        console.log('onInitialStocks', stocks);

        const stockMap = new Map<string, IStock>();
        stocks.forEach((stock) => {
            stockMap.set(stock.symbol, stock);
        });
        useStockStore.getState().setStocks(stockMap);
    });

    socket.on('onChangeStock', (updatedStock: IStock) => {
        // Update the store using the symbol as the Map key
        useStockStore.getState().modifyStock(updatedStock.symbol, updatedStock);
    });
}


