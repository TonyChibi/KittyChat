import { useRef } from 'react';

export const useCatSounds = () => {
    // Используем useRef, чтобы аудио-объект мурчания жил между рендерами

    const playRandomMeow = (isPurring) => {
        let soundPath;

        if (isPurring) {
            soundPath = '/sounds/purr1.mp3';
        } else {
            const sounds = [1, 2, 3, 4, 5, 6, 7]; // номера твоих mp3
            const randomNum = sounds[Math.floor(Math.random() * sounds.length)];
            soundPath = `/sounds/myaw${randomNum}.mp3`;

        }
        ;


        // Создаем звук, проигрываем и удаляем из памяти после завершения
        const meow = new Audio(soundPath);

        meow.play().catch(() => console.log("Кот спит, звук заблокирован"));

        // Очистка: когда звук доиграл, браузер его выгрузит
        meow.onended = () => meow.remove();
    };



    return { playRandomMeow };
};
