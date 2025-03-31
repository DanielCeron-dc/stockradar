// app.config.js a
import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    extra: {
        socketUrl: process.env.SOCKET_URL,
    },
});