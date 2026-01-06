import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import toast from "react-hot-toast";

/**
 * Meminta dan mengambil FCM token untuk push notification.
 * @returns {Promise<string|null>} FCM token atau null jika gagal
 */
export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
        if (currentToken) {
            return currentToken;
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error retrieving FCM token:', err);
        return null;
    }
};

/**
 * Mendaftarkan listener untuk pesan FCM yang masuk.
 * @returns {Promise<Object>} Payload pesan yang diterima
 */
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

