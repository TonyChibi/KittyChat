import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CatPaw } from '../components/icons/paw.jsx';
import { CatEye } from '../components/icons/eye2';
import { useCatSounds } from '../hooks/useCatSound';
import MessageInput from '../components/messageInput';
import { socket } from '../socket.js';
import { MessageItem } from '../components/messageItem.jsx';
import { useChat } from '../hooks/useChat.js';
import { MediaModal } from '../components/mediaModal.jsx';

const ChatPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const username = sessionStorage.getItem('cat-name') || 'Анонимный кот';

    const [isPurring, setIsPurring] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const lastProcessedMsgId = useRef(null);
    const scrollRef = useRef(null);

    const { playRandomMeow } = useCatSounds();
    const { messages, sendMessage, isConnected, markSeen } = useChat(roomId, username);


    // Если ника нет (зашли по прямой ссылке) — кидаем на логин
    useEffect(() => {
        const username = sessionStorage.getItem('cat-name');
        if (!username) {
            // Сохраняем ID комнаты, чтобы после ввода ника вернуться именно сюда
            sessionStorage.setItem('pending-room', roomId);
            navigate('/');
        }
    }, [username, navigate, roomId]);


    useEffect(() => {
        const markAsSeen = () => {
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                if (lastMsg.user !== username && !lastMsg.seen && document.hasFocus()) {
                    markSeen(lastMsg.id || lastMsg._id);
                }
            }
        };
        markAsSeen();
        window.addEventListener('focus', markAsSeen);
        return () => window.removeEventListener('focus', markAsSeen);
    }, [messages, username, roomId]);




    // Автопрокрутка вниз
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);



    // 2. ОТДЕЛЬНЫЙ эффект для звука
    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];

            // Если это пришло от неё (не от нас)
            if (lastMsg.user !== username && lastMsg.id !== lastProcessedMsgId.current) {

                // Запоминаем ID, чтобы не мяукать при смене режима
                lastProcessedMsgId.current = lastMsg.id;

                // Вот здесь передаем АКТУАЛЬНЫЙ isPurring
                playRandomMeow(isPurring);

            }
        }
        // Этот эффект следит и за сообщениями, и за переключателем режима!
    }, [messages, isPurring]);




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

    const closeMedia = () => setSelectedMedia(null);

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-catDark text-white shadow-2xl overflow-hidden">
            {/* Шапка с Живым Глазом */}

            <header className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 overflow-hidden">
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-1">←</button>

                    <div onClick={shareRoom} className="cursor-pointer group leading-tight truncate">
                        <h1 className="font-bold text-catOrange text-sm flex items-center gap-1 group-hover:text-orange-400">
                            #{roomId.slice(0, 8)}... {/* Сокращаем длинный ID для мобилок */}
                            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full opacity-60">🔗copy link</span>
                        </h1>
                        <p className="text-[9px] text-gray-500 uppercase tracking-tighter">KittyChat </p>
                    </div>
                </div>

                <button
                    onClick={handleTogglePurr}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${isPurring ? 'bg-catOrange text-white shadow-md' : 'bg-white/5 text-gray-400'
                        }`}
                >
                    {isPurring ? '💤 Purrr' : '🐾 MYAW'}
                </button>
            </header>
            {/* Индикатор статуса сервера */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${!isConnected ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                <div className="bg-catOrange/20 border-b border-white/5 py-1.5 flex items-center justify-center gap-2">
                    {/* Крутящаяся иконка лапки или просто точка */}
                    <div className="w-2 h-2 bg-catOrange rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold text-catOrange uppercase tracking-widest">
                        Кот просыпается... (подключение к серверу)
                    </span>
                </div>
            </div>


            {/* Список сообщений */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scroll-bar">
                {messages.map((msg) => (
                    <MessageItem
                        key={msg.id || Math.random()}
                        msg={msg}
                        isMe={msg.user === username}
                        onImageClick={setSelectedMedia}
                    />
                ))}
            </div>


            {/* Поле ввода */}
            <div className="p-4 bg-catDark border-t border-white/5">
                <MessageInput onSendMessage={sendMessage} />
            </div>

            {/* МОДАЛЬНОЕ ОКНО (Рендерим, если selectedMedia не null) */}
            {selectedMedia && (
                <MediaModal
                    media={selectedMedia}
                    onClose={closeMedia}
                />
            )}
        </div>

    );
};

export default ChatPage;
