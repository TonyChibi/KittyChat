import React, { useState, useRef } from 'react';
import { CatPaw } from '../components/icons/paw';


const MessageInput = ({ onSendMessage }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage(text);
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

    return (
        <div className="flex items-end gap-2 p-4 bg-catDark border-t border-white/10">
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
