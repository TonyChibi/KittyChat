import { CatEye } from './icons/eye2'; // Убедись, что путь верный

export function MessageItem({ msg, isMe, onImageClick }) {
    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[70%] p-3 rounded-2xl shadow-lg transition-all duration-300 ${isMe
                ? 'bg-catOrange text-white rounded-tr-none'
                : 'bg-pink-500/20 text-pink-100 border border-pink-500/30 rounded-tl-none'
                }`}>

                {/* 1. Имя пользователя (для чужих) */}
                {!isMe && (
                    <span className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-pink-300">
                        {msg.user}
                    </span>
                )}

                {/* 2. МЕДИА (Если есть ссылка) */}
                {msg.mediaUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/10 media-cursor"
                        onClick={() => onImageClick({ url: msg.mediaUrl, type: msg.mediaType })}>
                        {msg.mediaType === 'video' ? (
                            <div className="relative">
                                <video src={msg.mediaUrl} muted className="max-h-60 w-full object-cover" />
                                {/* Иконка Play поверх видео */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30 shadow-lg transform group-hover:scale-110 transition-transform">
                                        <span className="text-2xl text-white drop-shadow-md ml-1">▶️</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <img src={msg.mediaUrl} alt="media" className="max-w-full h-auto object-cover hover:scale-105 transition-transform" />
                        )}
                    </div>
                )}


                {/* 3. ТЕКСТ (Если есть текст) */}
                {msg.text && (
                    <p className="text-sm md:text-base break-words whitespace-pre-wrap">
                        {msg.text}
                    </p>
                )}

                {/* 4. Время и Глазик */}
                <div className="flex items-center justify-end gap-1 mt-1 min-h-[14px]">
                    <span className="text-[9px] opacity-60 font-medium">
                        {new Date(msg.timestamp?.$date || msg.timestamp || parseInt(msg.id) || Date.now())
                            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Кошачий глаз как индикатор прочтения (только для твоих сообщений) */}
                    {isMe && (
                        <div className="w-6 h-4 flex items-center justify-center overflow-hidden">
                            <div className="scale-[0.12] translate-y-[1px]">
                                <CatEye
                                    isReading={msg.seen}
                                    pupilNarrow={msg.seen}
                                    lidOpen={msg.seen ? 1 : 0.3}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
