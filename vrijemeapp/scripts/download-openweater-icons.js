import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

export default function WeatherCard({ data }) {
    const cardRef = useRef(null);
    if (!data) return null;

    // Provjeri da li weather postoji i ima bar jedan element
    const weather = Array.isArray(data.weather) ? data.weather[0] : null;
    const iconCode = weather?.icon;
    const description = weather?.description || '';
    // Generiraj URL za ikonu
    const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : '';

    const downloadCard = async () => {
        const el = cardRef.current;
        if (!el) return;
        try {
            const canvas = await html2canvas(el, { backgroundColor: null, scale: 2, useCORS: true });
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.name || 'weather'}.png`;
            a.click();
        } catch (e) {
            console.error('Download failed', e);
            alert('Preuzimanje nije uspelo.');
        }
    };

    return (
        <div className="card-wrap fade-in">
            <div className="weather-card" aria-live="polite" ref={cardRef}>
                <div className="left">
                    <div className="city">
                        <strong>{data.name}</strong>{data.sys?.country ? `, ${data.sys.country}` : ''}
                    </div>
                    <div className="temp">{Math.round(data.main?.temp)}°C</div>
                    <div className="meta desc" style={{ textTransform: 'capitalize' }}>{description}</div>
                    <div className="details">
                        <div>Oseća se kao: <strong>{Math.round(data.main?.feels_like)}°C</strong></div>
                        <div>Vlažnost: <strong>{data.main?.humidity}%</strong></div>
                        <div>Vetar: <strong>{data.wind?.speed} m/s</strong></div>
                    </div>
                </div>
                <div className="right">
                    <div className="icon-circle">
                        {iconUrl ? (
                            <img
                                src={iconUrl}
                                alt={description || 'weather icon'}
                                className="weather-icon"
                                crossOrigin="anonymous"
                                style={{ width: 64, height: 64 }}
                                onError={(e) => {
                                    console.warn('Weather icon failed to load:', e.currentTarget.src);
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://openweathermap.org/img/wn/01d@2x.png'; // fallback na "clear"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888',
                                fontSize: 12, border: '1px solid #ddd', borderRadius: 8
                            }}>
                                Nema ikonice
                            </div>
                        )}
                    </div>
                    <div className="actions">
                        <button className="icon-btn" onClick={downloadCard} title="Preuzmi karticu">Preuzmi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}