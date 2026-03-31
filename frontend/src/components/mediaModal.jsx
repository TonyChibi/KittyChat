export const MediaModal = ({ media, onClose }) => {
    if (!media) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white text-3xl transition-colors">✕</button>

            <div className="max-w-[95%] max-h-[90%] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {media.type === 'video' ? (
                    <video
                        src={media.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in duration-300"
                    />
                ) : (
                    <img
                        src={media.url}
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in duration-300 object-contain"
                        alt="fullsize"
                    />
                )}
            </div>
        </div>
    );
};
