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
    querySort: 'asc' | 'desc';
    setQuerySearch: (search: string) => void;
    setQuerySort: (sort: 'asc' | 'desc') => void;
    modifyStock: (symbol: string, updatedStock: IStock) => void; //! this is not being used in the app
    updateSpecificStock: (symbol: string, updatedStock: IStock) => void; // Update a specific stock without changing the reference to the map
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

        console.log('onInitialStocks', stocks);

        const stockMap = new Map<string, IStock>();
        stocks.forEach((stock) => {
            stockMap.set(stock.symbol, stock);
        });
        useStockStore.getState().setStocks(stockMap);
    });

    socket.on('onChangeStock', (updatedStock: IStock) => {
        // Update the store using the symbol as the Map key
        useStockStore.getState().updateSpecificStock(updatedStock.symbol, updatedStock);
    });
}


export function applyFilters(stocks: Map<string, IStock>, querySearch: string, querySort: 'asc' | 'desc') {

    let stockArray = Array.from(stocks.values());

    const stockToRender = querySearch.length === 0 ? stockArray : stockArray.filter((stock) => {
        return stock.symbol.toLowerCase().includes(querySearch.toLowerCase());
    });

    if (querySort === 'asc') {
        stockToRender.sort((a, b) => a.price - b.price);
    } else if (querySort === 'desc') {
        stockToRender.sort((a, b) => b.price - a.price);
    }

    return stockToRender;
};