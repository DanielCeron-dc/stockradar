import { Server } from 'socket.io';
import dummyStockData from './data/dummy_stock_data.json';

const StockData = dummyStockData;

const io = new Server({
    cors: {
        origin: ['http://localhost:8081'],
    },
});

io.on('connection', (socket) => {
    console.log(`connect: ${socket.id}`, socket.request.headers);

    socket.emit('onInitialStocks', dummyStockData.stocks);

    socket.on('disconnect', () => {
        console.log(`disconnect: ${socket.id}`);
    });
});

// it saves the stock on memory and updates the stock price every 100ms
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * dummyStockData.stocks.length);
    const randomStock = StockData.stocks[randomIndex];
    randomStock.price = randomStock.price + Math.random() * 10
    randomStock.daily_change = Math.random() * 10 - 5;
    StockData.stocks[randomIndex] = randomStock
    io.emit('onChangeStock', randomStock);
}, 100);

io.listen(3000);
console.log('Socket.IO server listening on port 3000');