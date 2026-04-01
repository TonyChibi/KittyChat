export const MediaGallery = ({ messages, onClose, onSelect }) => {
    // Фильтруем только те сообщения, где есть mediaUrl
    const galleryItems = messages.filter(msg => msg.mediaUrl);

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-catDark border-l border-white/10 z-[100] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Шапка галереи */}
            <div className="sticky top-0 p-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a] z-50 shadow-2xl">
                <h2 className="font-bold text-catOrange flex items-center gap-2">
                    <span>🐾</span> Медиа чата ({galleryItems.length})
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            {/* Сетка с медиа */}
            <div className="flex-1 overflow-y-auto p-2 scroll-bar bg-catDark">
                {galleryItems.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {galleryItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelect({ url: item.mediaUrl, type: item.mediaType })}
                                className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-all border border-white/5 media-cursor"
                            >
                                {item.mediaType === 'video' ? (
                                    <div className="relative w-full h-full">
                                        <video src={item.url} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 right-1 text-[10px]">▶️</span>
                                    </div>
                                ) : (
                                    <img src={item.mediaUrl} className="w-full h-full object-cover" alt="gallery-item" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                        <span className="text-4xl mb-2">🐱</span>
                        <p className="text-sm italic text-center">Тут пока нет котиков...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
