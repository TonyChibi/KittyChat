import { io } from "socket.io-client";

const URL = import.meta.env.PROD
    ? "https://kittychat-zh92.onrender.com"
    : "http://localhost:4000";

export const socket = io(URL, {
    // Разрешаем автоматическое подключение
    autoConnect: true,

    // Настройки для борьбы с "зависанием"
    reconnection: true,            // Включаем авто-реконнект
    reconnectionAttempts: Infinity, // Пытаемся подключиться бесконечно
    reconnectionDelay: 1000,       // Первая попытка через 1 сек
    reconnectionDelayMax: 5000,    // Максимально ждем 5 сек между попытками
    timeout: 20000,                // Ждем 20 сек перед тем как считать попытку проваленной

    // Это важно для мобильных браузеров и Onrender (бесплатные тарифы часто капризны к сокетам)
    transports: ["websocket", "polling"]
});
