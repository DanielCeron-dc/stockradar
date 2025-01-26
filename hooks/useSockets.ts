// useSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { socketEvents } from '@/store/stock.store';

interface UseSocketOptions {
    url?: string;
    opts?: any;   // socket.io-client options, e.g. headers
}

//TODO: add environment variable for the socket server URL
export function useSocket({
    url = '',
    opts = {},
}: UseSocketOptions = {}) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // 1) Initialize the Socket.IO client
        const socketInstance = io(url, {
            transports: ['websocket'],
            // merge your custom options if needed
            ...opts,
        });

        // 2) Listen to "connect", "disconnect", etc.
        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected:', socketInstance.id);
        });

        socketEvents(socketInstance);

        socketInstance.emit('hello', { message: 'Hello from client!' });

        // 4) Save the active socket instance to state
        setSocket(socketInstance);

        // 5) Cleanup: disconnect on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [url]);

    // Example of a custom function to emit an event
    const sendMessage = useCallback((message: string) => {
        if (!socket) return;
        socket.emit('chat message', message);
    }, [socket]);

    const disconnect = useCallback(() => {
        if (!socket) return;
        socket.disconnect();
    }, [socket]);

    // Return the socket and any helper functions
    return {
        socket,
        sendMessage,
        disconnect,
    };
}