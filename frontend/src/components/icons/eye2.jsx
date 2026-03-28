export function CatEye({ isReading = false, pupilNarrow = false, lidOpen = 1 }) {
    // lidOpen: 1 - открыто, 0.2 - почти закрыто
    // pupilNarrow: true - узкий зрачок (охота), false - обычный

    const eyeColor = isReading ? "#4ade80" : "#ffffff"; // Зеленый при прочтении
    const glowClass = isReading ? "drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" : "";

    return (
        <svg width="150" height="100" viewBox="130 250 270 90" className={`transition-all duration-500 ${glowClass}`}>
            <g>
                {/* Белок глаза с меняющимся цветом */}
                <path
                    d="m132.22,273.82c-0.98,0 104.42,-19.61 142.62,-15.99 38.2,3.62 121.38,31.97 121.16,31.96-0.22-0.01-71.69,37.78-133.97,39.22-62.28,1.44-129.81,-55.18-129.81,-55.18z"
                    fill={eyeColor}
                    stroke="#000000"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                />

                {/* Зрачок (меняем ширину через scale или вручную) */}
                <ellipse
                    cx="250" cy="290"
                    rx={pupilNarrow ? "8" : "25"}
                    ry="30"
                    fill="#000000"
                    className="transition-all duration-300"
                />

                {/* Верхнее веко (двигается вверх/вниз через transform) */}
                <path
                    d="m132.22,273.02c0,0 260,18 260,18c0,0 -79,-34 -122.22,-35.02-43.22-1.02-137.78,17.02-137.78,17.02z"
                    fill="#1a1a1a" // Цвет фона (темная тема)
                    stroke="#000000"
                    strokeWidth="2"
                    style={{
                        transform: `translateY(${(1 - lidOpen) * 20}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                />
            </g>
        </svg>
    );
}
