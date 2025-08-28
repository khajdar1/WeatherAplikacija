import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

// Funkcija za gradijent pozadine
const getWeatherGradientClass = (weatherMain, iconCode) => {
    const isNight = iconCode && iconCode.includes('n');
    const weatherLower = weatherMain?.toLowerCase() || 'clear';

    let bgClass = `gradient-${weatherLower}`;

    if (isNight) {
        bgClass += ' night';
    }

    return bgClass;
};

export default function WeatherCard({ data }) {
    const cardRef = useRef(null);
    const [imgError, setImgError] = useState(false);

    if (!data) return null;

    const desc = data.description_lat || data.description || '';
    const iconCode = data.icon;
    const weatherMain = data.main;

    const backgroundClass = getWeatherGradientClass(weatherMain, iconCode);

    const getIconSrc = () => {
        if (!iconCode) {
            return '/icons/weather-placeholder.svg';
        }
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    const downloadCard = async () => {
        const el = cardRef.current;
        if (!el) return;

        try {
            const canvas = await html2canvas(el, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.city || 'weather'}.png`;
            a.click();
        } catch (e) {
            console.error('Download failed', e);
            alert('Preuzimanje nije uspjelo. Pokušaj ponovo.');
        }
    };

    const handleImgError = () => {
        console.log('GREŠKA - Vanjska ikona se nije učitala:', getIconSrc());
        console.log('Icon code:', iconCode);
        setImgError(true);
    };

    const handleImgLoad = () => {
        console.log('✅ Ikona uspješno učitana:', getIconSrc());
        console.log('Icon code:', iconCode);
    };

    return (
        <div className="card-wrap fade-in">
            <div className={`weather-card ${backgroundClass}`} aria-live="polite" ref={cardRef}>
                <div className="left">
                    <div className="city">
                        <strong>{data.city}</strong>{data.country ? `, ${data.country}` : ''}
                    </div>

                    <div className="temp">{Math.round(data.temp)}°C</div>

                    <div className="meta desc" style={{ textTransform: 'capitalize' }}>
                        {desc}
                    </div>

                    <div className="details">
                        <div>Oseća se kao: <strong>{Math.round(data.feels_like)}°C</strong></div>
                        <div>Vlažnost: <strong>{data.humidity}%</strong></div>
                        <div>Vetar: <strong>{data.wind_speed} m/s</strong></div>
                    </div>
                </div>

                <div className="right">
                    <div className="icon-circle">
                        <img
                            src={imgError ? '/icons/weather-placeholder.svg' : getIconSrc()}
                            alt={desc || 'weather icon'}
                            className="weather-icon"
                            onError={handleImgError}
                            onLoad={handleImgLoad}
                            crossOrigin="anonymous"
                        />
                    </div>

                    <div className="actions">
                        <button
                            className="icon-btn"
                            onClick={downloadCard}
                            title="Preuzmi karticu"
                        >
                            Preuzmi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}