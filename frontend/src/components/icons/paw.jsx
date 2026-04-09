export const CatPaw = ({ size = 24, isUploading = false }) => {
    // Геометрия лапки
    const pawD = "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z";
    // Геометрия ядра (круг, описанный как путь)
    const circleD = "M12 9a4 4 0 0 1 0 8 4 4 0 0 1 0-8v4a0 0 0 0 1 0 0Q12 13 12 13A0 0 0 0 1 12 9Z";

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="overflow-visible">
            {/* Пальчики, которые вращаются вокруг */}
            <g className={`transition-transform duration-700 origin-center ${isUploading ? "animate-spin" : ""}`}>
                <circle cx="11" cy="4" r="2" fill={isUploading ? "currentColor" : "none"} />
                <circle cx="18" cy="8" r="2" fill={isUploading ? "currentColor" : "none"} />
                <circle cx="20" cy="16" r="2" fill={isUploading ? "currentColor" : "none"} />
            </g>

            {/* МОРФИНГ ЧЕРЕЗ CSS (работает в Chrome/Safari/Edge) */}
            <path
                d={isUploading ? circlePath : pawPath}
                fill={isUploading ? "white" : "none"}
                stroke="white"
                strokeWidth="2"
                style={{
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    d: `path('${isUploading ? circlePath : pawPath}')` // Магия здесь
                }}
            />
        </svg>
    );
};
