import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

export const useChat = (roomId, username) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {


        // 1. Сначала вешаем ВСЕ слушатели
        const onHistory = (history) => {
            console.log("📚 История из базы пришла:", history);
            setMessages(history.map(msg => ({
                ...msg,
                id: msg.id || msg._id,
                isMe: msg.user === username // Тут должно быть совпадение имен!
            })));
        };



        const onMeow = (data) => {
            if (data.user === username) return;
            setMessages(prev => {
                if (prev.find(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        };

        const onUpdateSeen = ({ msgId }) => {
            setMessages(prev => prev.map(m => (m.id === msgId || m._id === msgId) ? { ...m, seen: true } : m));
        };

        socket.on('load_history', onHistory);
        socket.on('meow_message', onMeow);
        socket.on('update_seen', onUpdateSeen);

        // 2. И только когда "уши" готовы — заходим в комнату
        socket.connect();

        socket.on('connect', () => {
            setIsConnected(true);
            console.log("✅ Сокет подключен, запрашиваю комнату:", roomId);
            socket.emit('join_room', roomId);
        });

        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            socket.off('load_history', onHistory);
            socket.off('meow_message', onMeow);
            socket.off('update_seen', onUpdateSeen);
            socket.off('connect');
        };
    }, [roomId, username]); // Эти зависимости КРИТИЧНЫ


    const sendMessage = (messageData) => {
        // Проверка: если пришла не «коробка» (объект), ругаемся в консоль
        if (typeof messageData !== 'object' || messageData === null) {
            // 2. Генерируем стек вызовов, чтобы найти "виновника"
            const stack = new Error().stack;

            console.error(
                "❌ ОШИБКА: sendMessage ожидает объект, но прилетела СТРОКА!",
                "\nДанные:", messageData,
                "\nТип:", typeof messageData,
                "\nГде это случилось (Стек вызовов):\n", stack
            );
            return;
        }

        const msgData = {
            id: Date.now().toString(),
            room: roomId,
            user: username,
            text: messageData.text || "",
            mediaUrl: messageData.mediaUrl || null,
            mediaType: messageData.mediaType || null,
            timestamp: new Date().toISOString(),
            seen: false
        };

        socket.emit('meow_message', msgData);
        setMessages(prev => [...prev, { ...msgData, isMe: true }]);
    };


    const markSeen = (msgId) => {
        socket.emit('message_seen', { room: roomId, msgId });
    };

    return { messages, sendMessage, isConnected, setMessages, markSeen };
};
