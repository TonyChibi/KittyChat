import React, { useState, useRef } from 'react';
import { CatPaw } from '../components/icons/paw';







const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);


    const handleSend = () => {
        if (text.trim()) {
            onSendMessage({ text: text, mediaUrl: null, mediaType: null });
            setText('');
            // Сбрасываем высоту после отправки
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
        }
    };

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0]; // Берем один файл
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'kittyChat'); // Замени на свой!

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dyllq1ycb/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.secure_url) {
                // Отправляем сообщение в БД (текст может быть пустым, если только фото)
                // Здесь вызывай свою функцию отправки, например:
                onSendMessage({
                    text: text, // Текст из textarea, если есть
                    mediaUrl: data.secure_url,
                    mediaType: file.type.startsWith('video') ? 'video' : 'image'
                });
                setText(''); // Очищаем поле текста
            }
        } catch (err) {
            alert("Ошибка при загрузке файла!");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex items-end gap-2 p-4 bg-catDark border-t border-white/10">

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
                onChange={handleFileChange}
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


            <button
                onClick={handleSend}
                className="p-3 bg-catOrange hover:bg-orange-600 rounded-full transition-all active:scale-90 shadow-lg shadow-orange-500/20"
            >
                <CatPaw size={24} color="white" strokeWidth={3} />
            </button>
        </div>
    );
};

export default MessageInput;
