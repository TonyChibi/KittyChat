import { io } from "socket.io-client";

// ВНИМАНИЕ: Проверь, что тут именно 4000 (как в сервере)
const URL = import.meta.env.PROD
    ? "https://onrender.com"
    : "http://localhost:4000";

export const socket = io(URL, {
    autoConnect: false // Пусть подключается сам при загрузке сайта
    // transports: ["websocket"] // Принудительно используем вебсокеты
});
