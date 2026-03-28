import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

export const useChat = (roomId, username) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('join_room', roomId);
        });

        socket.on('disconnect', () => setIsConnected(false));

        // Загрузка истории из базы
        socket.on('load_history', (history) => {
            console.log("📥 Фронтенд получил историю:", history);
            setMessages(history.map(msg => ({
                ...msg,
                isMe: msg.user === username
            })));
        });

        socket.on('meow_message', (data) => {
            if (data.user === username) return;
            setMessages(prev => {
                if (prev.find(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        socket.on('update_seen', ({ msgId }) => {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, seen: true } : m));
        });

        return () => {
            socket.off('meow_message');
            socket.off('load_history');
            socket.off('update_seen');
            socket.off('connect');
        };
    }, [roomId, username]);

    const sendMessage = (text) => {
        const msgData = {
            id: Date.now().toString(),
            room: roomId,
            user: username,
            text,
            timestamp: new Date().toISOString(),
            seen: false
        };
        socket.emit('meow_message', msgData);
        setMessages(prev => [...prev, { ...msgData, isMe: true }]);
    };

    return { messages, sendMessage, isConnected, setMessages };
};
