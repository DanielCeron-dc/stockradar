import { useStockStore, IStock, applyFilters } from './stock.store'; 

describe('useStockStore', () => {

    const resetStore = () => {
        useStockStore.setState({
            stocks: new Map(),
            querySearch: '',
            querySort: 'asc',
            setQuerySearch: useStockStore.getState().setQuerySearch,
            setQuerySort: useStockStore.getState().setQuerySort,
            modifyStock: useStockStore.getState().modifyStock,
            updateSpecificStock: useStockStore.getState().updateSpecificStock,
            setStocks: useStockStore.getState().setStocks,
        });
    };

    beforeEach(() => {
        resetStore();
    });

    it('should set querySearch', () => {
        const state = useStockStore.getState();
        state.setQuerySearch('AAPL');
        expect(useStockStore.getState().querySearch).toBe('AAPL');
    });

    it('should set querySort', () => {
        const state = useStockStore.getState();
        state.setQuerySort('desc');
        expect(useStockStore.getState().querySort).toBe('desc');
    });

    it('should set stocks', () => {
        const state = useStockStore.getState();

        const stocks: IStock[] = [
            { symbol: 'AAPL', name: 'Apple Inc.', price: 150, daily_change: 1.2 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800, daily_change: -0.5 },
        ];

        const stockMap = new Map<string, IStock>();
        stocks.forEach(stock => stockMap.set(stock.symbol, stock));

        state.setStocks(stockMap);

        const updatedState = useStockStore.getState();
        expect(updatedState.stocks.size).toBe(2);
        expect(updatedState.stocks.get('AAPL')).toEqual(stocks[0]);
        expect(updatedState.stocks.get('GOOGL')).toEqual(stocks[1]);
    });

    it('should update specific stock without changing map reference', () => {
        const state = useStockStore.getState();

        const initialStock: IStock = { symbol: 'AAPL', name: 'Apple Inc.', price: 150, daily_change: 1.2 };
        const updatedStock: IStock = { symbol: 'AAPL', name: 'Apple Inc.', price: 155, daily_change: 1.5 };

        state.setStocks(new Map([['AAPL', initialStock]]));

        const initialMap = useStockStore.getState().stocks;

        state.updateSpecificStock('AAPL', updatedStock);

        const currentMap = useStockStore.getState().stocks;
        expect(currentMap).toBe(initialMap); // Reference should be the same
        expect(currentMap.get('AAPL')).toEqual(updatedStock);
    });
});
