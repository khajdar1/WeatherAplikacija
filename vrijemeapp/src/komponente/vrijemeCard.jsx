import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function WeatherCard({ data }) {
    const cardRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [imgError, setImgError] = useState(false);

    if (!data) return null;

    const desc = data.description_lat || data.description || '';
    const iconCode = data.icon;

    const getIconSrc = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


    return (
        <div className="card-wrap fade-in">
            <div className="weather-card" aria-live="polite" ref={cardRef}>
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
                            src={imgError ? '/icons/weather-placeholder.svg' : getIconSrc}
                            alt={desc || 'weather icon'}
                            className="weather-icon"
                            crossOrigin="anonymous"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}