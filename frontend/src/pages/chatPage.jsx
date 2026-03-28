import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CatPaw } from '../components/icons/paw.jsx';
import { CatEye } from '../components/icons/eye2';
import { useCatSounds } from '../hooks/useCatSound';
import MessageInput from '../components/messageInput';
import { socket } from '../socket.js';
import { MessageItem } from '../components/messageItem.jsx';

const ChatPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { playRandomMeow, togglePurr } = useCatSounds();

    const [messages, setMessages] = useState([]);
    const [isPurring, setIsPurring] = useState(false);

    const lastProcessedMsgId = useRef(null);

    // Состояние для управления анимацией глаза
    const [eyeProps, setEyeProps] = useState({ lid: 0.7, narrow: false, glow: false });

    const username = sessionStorage.getItem('cat-name') || 'Анонимный кот';
    const scrollRef = useRef(null);


    // Если ника нет (зашли по прямой ссылке) — кидаем на логин
    useEffect(() => {
        const username = sessionStorage.getItem('cat-name');
        if (!username) {
            // Сохраняем ID комнаты, чтобы после ввода ника вернуться именно сюда
            sessionStorage.setItem('pending-room', roomId);
            navigate('/');
        }
    }, [username, navigate, roomId]);

    // 1. Убедись, что импорт есть вверху!
    // import { socket } from "../socket";



    useEffect(() => {
        socket.connect();
        socket.emit('join_room', roomId);

        socket.on('meow_message', (data) => {
            if (data.user === username) return;
            onReceiveMessage(data);
        });

        // ДОБАВЛЯЕМ: Слушаем, когда КТО-ТО прочитал наше сообщение
        socket.on('update_seen', ({ msgId }) => {
            setMessages(prev =>
                prev.map(m => m.id === msgId ? { ...m, seen: true } : m)
            );
        });

        return () => {
            socket.off('meow_message');
            socket.off('update_seen'); // Не забываем отписаться
        };
    }, [roomId, username]);




    useEffect(() => {
        // Функция, которая сообщает серверу о прочтении
        const markAsSeen = () => {
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];

                // Условия: Сообщение не моё + еще не прочитано + ВКЛАДКА В ФОКУСЕ
                if (lastMsg.user !== username && !lastMsg.seen && document.hasFocus()) {
                    socket.emit('message_seen', { room: roomId, msgId: lastMsg.id });
                }
            }
        };

        // 1. Проверяем сразу при получении нового сообщения
        markAsSeen();

        // 2. Добавляем слушатель на возвращение пользователя во вкладку
        // (Например, она переключилась обратно из Инстаграма в твой чат)
        window.addEventListener('focus', markAsSeen);

        return () => {
            window.removeEventListener('focus', markAsSeen);
        };
    }, [messages, username, roomId]);




    // Автопрокрутка вниз
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 1. Просто добавляем сообщение в список (без звука здесь!)
    const onReceiveMessage = (msg) => {
        if (msg.user === username) return;
        setMessages((prev) => [...prev, msg]);
    };

    // 2. ОТДЕЛЬНЫЙ эффект для звука и анимации глаза
    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];

            // Если это пришло от неё (не от нас)
            if (lastMsg.user !== username && lastMsg.id !== lastProcessedMsgId.current) {

                // Запоминаем ID, чтобы не мяукать при смене режима
                lastProcessedMsgId.current = lastMsg.id;

                // Вот здесь передаем АКТУАЛЬНЫЙ isPurring
                playRandomMeow(isPurring);

                // Анимация глаза в шапке
                setEyeProps({ lid: 1, narrow: true, glow: true });
                setTimeout(() => {
                    setEyeProps({ lid: 0.7, narrow: false, glow: false });
                }, 3000);
            }
        }
        // Этот эффект следит и за сообщениями, и за переключателем режима!
    }, [messages, isPurring]);

    const handleSend = (text) => {
        const uniqueId = Date.now();
        const msgData = {
            id: uniqueId, // ОБЯЗАТЕЛЬНО добавляем ID для сервера
            room: roomId,
            user: username,
            text: text,
            timestamp: new Date().toISOString(),
            isMe: true,
            seen: false
        };

        // 1. Отправляем на сервер
        socket.emit('meow_message', msgData);

        // 2. Добавляем себе в список (сразу, чтобы не ждать ответа сервера)
        setMessages(prev => [...prev, { ...msgData }]);
    };


    const handleTogglePurr = () => {
        const newState = !isPurring;
        setIsPurring(newState);
    };


    const shareRoom = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        // Вместо скучного alert можно потом сделать красивое всплывающее уведомление
        alert("Ссылка скопирована! Отправь её своей кошечке 🐾");
    };


    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-catDark text-white shadow-2xl overflow-hidden">
            {/* Шапка с Живым Глазом */}
            <header className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">←</button>


                    <CatEye
                        lidOpen={eyeProps.lid}
                        pupilNarrow={eyeProps.narrow}
                        isReading={eyeProps.glow}
                        className="w-20 h-auto"
                    />
                    <div onClick={shareRoom} className="cursor-pointer group">
                        <h1 className="font-bold text-catOrange flex items-center gap-2 group-hover:text-orange-400">
                            #{roomId}
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full opacity-50 group-hover:opacity-100">🔗 Share</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase">Мурчащий чат</p>
                    </div>

                    <div>
                        <h1 className="font-bold text-catOrange">#{roomId}</h1>
                        <p className="text-[10px] text-gray-500 uppercase">Мурчащий чат</p>
                    </div>
                </div>



                <button
                    onClick={handleTogglePurr}
                    className={`p-3 rounded-2xl transition-all ${isPurring ? 'bg-catOrange text-white shadow-lg' : 'bg-white/10 text-gray-400'}`}
                >
                    {isPurring ? '🐾 Мурчит' : '💤 Тихо'}
                </button>
            </header>

            {/* Список сообщений */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scroll-bar">
                {messages.map((msg) => (
                    <MessageItem
                        key={msg.id || Math.random()}
                        msg={msg}
                        isMe={msg.user === username}
                    />
                ))}
            </div>


            {/* Поле ввода */}
            <div className="p-4 bg-catDark border-t border-white/5">
                <MessageInput onSendMessage={handleSend} />
            </div>
        </div>
    );
};

export default ChatPage;
