require('dotenv').config();
console.log('🔗 Проверка URL базы:', process.env.MONGO_URL ? 'Найдено!' : 'ПУСТО ❌');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose')


const app = express();
const server = http.createServer(app);

// Ответ на главную страницу или специальный путь
app.get('/', (req, res) => {
    res.status(200).send('Кот на связи! 🐾');
});

// errors backings
process.on('uncaughtException', (err) => {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА (сервер живет):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ ОШИБКА В ПРОМИСЕ (сервер живет):', reason);
});


mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
})
    .then(() => console.log('🍃 База котов подключена'))
    .catch(err => console.error('Ошибка базы:', err));

const MessageSchema = new mongoose.Schema({
    room: String,
    user: String,
    text: String,
    mediaUrl: String,
    mediaType: {
        type: String,
        enum: ['image', 'video', null], // Разрешаем только эти значения
        default: null
    },
    seen: { type: Boolean, default: false },
    id: String, // Наш Date.now()
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('🐾 Новый кот приземлился! ID:', socket.id);

    // 1. Слушаем запрос на вход в конкретную комнату (по UID)
    socket.on('join_room', async (roomId) => {
        socket.leaveAll(); // Уходим из старых комнат, если были
        socket.join(roomId);

        const history = await Message.find({ room: roomId }).sort({ timestamp: 1 }).limit(50);


        console.log(`📚 Найдено в базе для ${roomId}: ${history.length} сообщений`);

        socket.emit('load_history', history);

        console.log(`📦 Кот ${socket.id} запрыгнул в коробку: ${roomId}`);
    });

    // 2. Слушаем сообщения и отправляем их ТОЛЬКО в нужную комнату
    socket.on('meow_message', async (data) => {
        console.log('📩 Получено Мяу в комнату', data.room, ':', data.text);

        const newMsg = new Message(data);
        await newMsg.save()

        // .to(data.room) — магия сокетов: отправляем только тем, кто в этой комнате
        io.to(data.room).emit('meow_message', {
            ...data
        });
    });

    socket.on('message_seen', async ({ room, msgId }) => {
        // Рассылаем всем в комнате сигнал, что сообщение msgId прочитано
        console.log(`👁️ Сообщение ${msgId} прочитано в ${room}`);
        await Message.findOneAndUpdate({ id: msgId }, { seen: true });

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
