import React from 'react';
import { render } from '@testing-library/react-native';
import StockItem from '@/components/home/StockItem';
import { useStockStore, IStock } from '@/store/stock.store';

const mockRouter = {
  push: jest.fn(),
};

jest.mock('expo-router', () => ({router: () => mockRouter}));
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => '');

describe('StockItem Snapshot Tests', () => {
  beforeEach(() => {
    useStockStore.getState().setStocks(
      new Map<string, IStock>([
        [
          'AAPL',
          {
            symbol: 'AAPL',
            name: 'Apple Inc. is a very, very long company name that should be truncated',
            price: 150,
            daily_change: 1.2,
          },
        ],
      ])
    );
  });

  it('renders correctly', () => {
    const mockStock: IStock = {
      symbol: 'AAPL',
      name: 'Apple Inc. is a very, very long company name that should be truncated',
      price: 150,
      daily_change: 1.2,
    };

    const { getByText } = render(<StockItem stock={mockStock} />);

    const longNameText = getByText(mockStock.name);

    console.log('longWidth', longNameText.props.style.width);
    expect(longNameText.props.ellipsizeMode).toBe('tail');
    expect(longNameText.props.numberOfLines).toBe(1);

  });
});