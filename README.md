# Welcome to StockRadar !!

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start 
   ```

3. Start the mini backend

   ```bash
   cd server && bun install && bun start
   ```

4. Run tests

   ```bash
   npm test
   ```

## Tech stack

- React Native
- Expo
- Socket.io
- React Reanimated
- Jest

## features

- The app has two screens, the first screen is the stock list screen with basic styles and the second screen is the stock details screen.

- the StockItem shows the stock name, the stock price, the stock change, and the stock daily percentage change.

- it uses the dummyStockData to render the stock data, the data is sorted by the stock name.

- To render the stock data, we only rendered the first time, to update each stock data we use socket.io to update the data in real time. 

- the ItemStock component is connected directly to the store to get the data without the need of the parent component to update the data.

- it uses an AnimatedList to render the stock data, the list is updated in real time with the new data, the list is sorted by the stock name.

- it has sorting and filtering functionality, the user can sort the stock data by the stock price. the user can also filter the stock data by the stock name.

- good performance, the app only renders the complete stock data once, and then it updates the stock data in real time without the need to re-render the complete stock data.

- cross-platform, the app is built with react-native and expo, it can run on both ios and android.

- offline support, the app can will show the last stock data if the user is offline and a message will be shown to the user that he is offline.

- the list uses a map internally to render the stock data, and in that way stockItem component is only re-rendered when its data is updated.