/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                catOrange: '#f97316', // Твой рыжий цвет
                catDark: '#1a1a1a',   // Глубокий темный фон
            },
        },
    },
    plugins: [],
}
