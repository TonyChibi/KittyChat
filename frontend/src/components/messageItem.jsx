import { CatEye } from './icons/eye2'; // Убедись, что путь верный

export function MessageItem({ msg, isMe }) {
    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[70%] p-3 rounded-2xl shadow-lg transition-all duration-300 ${isMe
                ? 'bg-catOrange text-white rounded-tr-none'
                : 'bg-pink-500/20 text-pink-100 border border-pink-500/30 rounded-tl-none'
                }`}>

                {!isMe && (
                    <span className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-pink-300">
                        {msg.user}
                    </span>
                )}

                <p className="text-sm md:text-base break-words whitespace-pre-wrap">{msg.text}</p>

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
