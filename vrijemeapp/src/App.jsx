import React, { useEffect, useState } from 'react';
import './index.css';
import Search from './komponente/search';
import WeatherCard from './komponente/vrijemeCard';
import Forecast from './komponente/vrijemeForecast.jsx';
import { fetchCurrentWeather, fetchForecast } from './servisi/API';

const HISTORY_KEY = 'weather_search_history_v1';
const MAX_HISTORY = 6;

export default function App() {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (raw) setHistory(JSON.parse(raw));
        } catch (e) { console.log(e) }
    }, []);

    const saveHistory = (city) => {
        const normalized = city.trim();
        if (!normalized) return;
        const next = [normalized, ...history.filter(h => h.toLowerCase() !== normalized.toLowerCase())];
        const sliced = next.slice(0, MAX_HISTORY);
        setHistory(sliced);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced)); } catch (e) { }
    };

    const doSearch = async (city) => {
        setLoading(true); setError(''); setWeather(null); setForecast(null);
        try {
            const data = await fetchCurrentWeather(city);
            setWeather(data);
            saveHistory(city);
            // Fetch forecast
            const forecastData = await fetchForecast(city);
            setForecast(forecastData);
        } catch (err) {
            setError(err.message || 'Greška pri dohvatu podataka');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="container">
                <header>
                    <div className="weather-emoji">🌤️</div>
                    <h1>Vremenska Prognoza</h1>
                </header>

                <div className="search-row">
                    <div className="search-form">
                        <Search onSearch={doSearch} />
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="history">
                        <small>Historija:</small>
                        <div className="history-list">
                            {history.map((h) => (
                                <button key={h} className="history-item" onClick={() => doSearch(h)}>{h}</button>
                            ))}
                        </div>
                    </div>
                )}

                {loading && <p className="info">Učitavanje...</p>}
                {error && <p className="error">Greška: {error}</p>}

                {weather && <WeatherCard data={weather} />}
                {forecast && <Forecast data={forecast} />}

                <footer>
                    <small>Podaci: OpenWeatherMap</small>
                </footer>
            </div>
        </div>
    );
}