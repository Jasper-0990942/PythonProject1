import 'dotenv/config';

export default {
    expo: {
        name: "WP4",
        slug: "wp4-bamischijf",
        version: "1.0.0",
        extra: {
            apiBaseUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
        },
    },
};
