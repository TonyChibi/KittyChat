import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CatPaw } from '../components/icons/paw';
import CatFace from '../components/icons/face';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState(sessionStorage.getItem('pending-room') || '');
    const navigate = useNavigate();

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



    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-catDark">
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl">
                <div className="flex justify-center mb-6 text-catOrange">
                    <CatPaw size={64} strokeWidth={1.5} className="animate-bounce" />
                </div>

                <h1 className="mb-8 text-3xl font-black text-center text-white text-catOrange">
                    KittyChat
                </h1>

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

                <p className="mt-6 text-xs text-center text-gray-500 uppercase tracking-widest">
                    Бесплатное PWA для котов
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
