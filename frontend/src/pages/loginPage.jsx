import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CatPaw } from '../components/icons/paw';
import CatFace from '../components/icons/face';


const LoginPage = () => {
    const [username, setUsername] = useState(sessionStorage.getItem('cat-name') || '');
    const [roomId, setRoomId] = useState(sessionStorage.getItem('pending-room') || '');
    const [myRooms, setMyRooms] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {
        // Подгружаем список при заходе на главную
        const rooms = JSON.parse(localStorage.getItem('my-cat-rooms') || '[]');
        setMyRooms(rooms);
    }, []);

    const deleteRoomFromHistory = (idToDelete) => {
        // Фильтруем массив: оставляем всё, кроме этого ID
        const updatedRooms = myRooms.filter(id => id !== idToDelete);

        // Сохраняем обратно в память и обновляем экран
        localStorage.setItem('my-cat-rooms', JSON.stringify(updatedRooms));
        setMyRooms(updatedRooms);
    };


    const handleJoin = (e) => {
        e.preventDefault();
        if (username && roomId) {
            sessionStorage.setItem('cat-name', username);

            // Проверяем, была ли "отложенная" комната из ссылки
            const pendingRoom = sessionStorage.getItem('pending-room');
            if (pendingRoom) {
                sessionStorage.removeItem('pending-room');
                navigate(`/chat/${pendingRoom}`);
            } else {
                navigate(`/chat/${roomId}`); // Или в ту, что ввели руками
            }
        }

    };

    // Функция для быстрого перехода из истории
    const quickJoin = (roomObj) => {
        // Устанавливаем ник и ID комнаты в стейты полей ввода
        setUsername(roomObj.name);
        setRoomId(roomObj.id);

        // Сразу сохраняем ник в сессию и летим в чат
        sessionStorage.setItem('cat-name', roomObj.name);
        navigate(`/chat/${roomObj.id}`);
    };



    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-catDark">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
                <div className="flex justify-center mb-6 text-catOrange">
                    <CatPaw size={64} strokeWidth={1.5} className="animate-bounce" />
                </div>

                <h1 className="mb-8 text-3xl font-black text-center text-white text-catOrange">
                    KittyChat
                </h1>


                {/* ФОРМА ВХОДА */}
                <form onSubmit={handleJoin} className="space-y-6">
                    <div className="relative">
                        <CatFace className="absolute left-3 top-3.5 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Your pet name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-catOrange text-white placeholder-gray-500 transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-3.5 text-gray-500 text-xl font-bold">#</span>
                        <input
                            type="text"
                            placeholder="room ID (UID)"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-catOrange text-white placeholder-gray-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 font-bold text-white transition-all bg-catOrange rounded-2xl hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                        Запрыгнуть в коробку <CatPaw size={20} />
                    </button>
                </form>

                {/* ИСТОРИЯ КОМНАТ (под формой) */}
                {myRooms.length > 0 && (
                    <div className="mt-10 space-y-3 pt-6 border-t border-white/10">
                        <h3 className="text-pink-300 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 opacity-70">
                            Последние лапки
                        </h3>

                        {myRooms.map((room) => (
                            <div key={room.id} className="group flex items-center gap-2">
                                <button
                                    onClick={() => quickJoin(room)}
                                    className="flex-1 text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-xs truncate"
                                >
                                    <span className="text-catOrange font-bold">{room.name}</span>
                                    <span className="text-gray-500 ml-2">в #{room.id.slice(0, 8)}...</span>
                                </button>
                                {/* Кнопка удаления остается такой же, передаем room.id */}
                                <button onClick={() => deleteRoomFromHistory(room.id)} className="...">✕</button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="mt-6 text-xs text-center text-gray-500 uppercase tracking-widest">
                    Бесплатное PWA для котов
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
