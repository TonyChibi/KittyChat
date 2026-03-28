const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('🐾 Новый кот приземлился! ID:', socket.id);

    // 1. Слушаем запрос на вход в конкретную комнату (по UID)
    socket.on('join_room', (roomId) => {
        socket.leaveAll(); // Уходим из старых комнат, если были
        socket.join(roomId);
        console.log(`📦 Кот ${socket.id} запрыгнул в коробку: ${roomId}`);
    });

    // 2. Слушаем сообщения и отправляем их ТОЛЬКО в нужную комнату
    socket.on('meow_message', (data) => {
        console.log('📩 Получено Мяу в комнату', data.room, ':', data.text);

        // .to(data.room) — магия сокетов: отправляем только тем, кто в этой комнате
        io.to(data.room).emit('meow_message', {
            ...data
        });
    });

    socket.on('message_seen', ({ room, msgId }) => {
        // Рассылаем всем в комнате сигнал, что сообщение msgId прочитано
        console.log(`👁️ Сообщение ${msgId} прочитано в ${room}`);
        io.to(room).emit('update_seen', { msgId });
    });

    socket.on('disconnect', () => {
        console.log('💤 Кот ушел спать... ID:', socket.id);
    });
});




const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Кото-сервер взлетел на http://localhost:${PORT}`);
});
