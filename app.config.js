// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    extra: {
        socketUrl: process.env.SOCKET_URL,
    },
});