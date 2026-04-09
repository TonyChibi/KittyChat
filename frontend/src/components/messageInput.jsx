import React, { useState, useRef } from 'react';
import { CatPaw } from '../components/icons/paw';







const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null); // Для показа превью
    const [selectedFile, setSelectedFile] = useState(null); // Сам файл


    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);




    const handleKeyDown = (e) => {
        // Отправка по Enter, если не зажат Shift
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e) => {
        setText(e.target.value);
        // Автовысота: сбрасываем и ставим по scrollHeight
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        // Создаем временную ссылку для превью в браузере
        setPreview(URL.createObjectURL(file));
    };


    const handleSend = async () => {
        if (!text.trim() && !selectedFile) return;

        if (selectedFile) {
            const isVideo = selectedFile.type.startsWith('video');
            const limit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

            if (selectedFile.size > limit) {
                alert(`Ого! ${isVideo ? 'Видео' : 'Фото'} слишком тяжелое. Лимит: ${isVideo ? '50' : '10'} МБ 🐾`);
                return;
            }
        }
        setIsUploading(true);
        let mediaData = null;

        try {
            // Если есть файл, сначала грузим его в облако
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', 'kittyChat');

                const res = await fetch('https://api.cloudinary.com/v1_1/dyllq1ycb/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();

                mediaData = {
                    mediaUrl: data.secure_url,
                    mediaType: selectedFile.type.startsWith('video') ? 'video' : 'image'
                };
            }

            // Отправляем всё вместе (текст + медиа)
            onSendMessage({
                text: text,
                ...mediaData
            });

            // Сброс всего после успеха
            setText('');
            setSelectedFile(null);
            setPreview(null);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        } catch (err) {
            alert("Ошибка отправки!");
        } finally {
            setIsUploading(false);
            fileInputRef.current.value = '';
        }
    };




    return (

        <div className="flex flex-col bg-catDark border-t border-white/10 p-4">
            {/* ПРЕВЬЮ (показывается только если файл выбран) */}
            {preview && (
                <div className="relative mb-3 w-24 h-24 group">
                    {selectedFile?.type.startsWith('video') ? (
                        <video src={preview} className="w-full h-full object-cover rounded-lg border-2 border-catOrange" />
                    ) : (
                        <img src={preview} className="w-full h-full object-cover rounded-lg border-2 border-catOrange" />
                    )}
                    <button
                        onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow-lg"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex items-end gap-2 ">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()} // Имитируем клик по скрытому инпуту
                    className={`p-2 rounded-full transition-all ${isUploading ? 'animate-pulse opacity-50' : 'hover:bg-white/10'}`}
                    disabled={isUploading}
                >
                    <span className="text-2xl text-pink-400">📎</span>
                </button>

                {/* СКРЫТЫЙ ИНПУТ (он делает всю работу) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,video/*" // Разрешаем только фото и видео
                    className="hidden"
                />

                <textarea
                    ref={textareaRef}
                    rows="1"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Say meow..."
                    className="flex-1 bg-white/5 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-catOrange resize-none max-h-40 overflow-y-auto transition-all"
                />


                <button onClick={handleSend} disabled={isUploading} className="p-3 bg-catOrange rounded-full active:scale-90 transition-all">
                    <CatPaw size={24} color="white" strokeWidth={3} isUploading={isUploading} />
                </button>

            </ div>
        </div>




    );
};

export default MessageInput;
