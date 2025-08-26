const BASE = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchCurrentWeather(city) {
    
    const key = import.meta.env.VITE_WEATHER_API_KEY;

    const url = `${BASE}?q=${encodeURIComponent(city)}&units=metric&lang=ba&appid=${key}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); 

    try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Grad nije pronađen. Provjeri naziv i pokušaj ponovo.');
            }
            const errText = await res.text();
            throw new Error(`Weather API error: ${res.status} ${errText}`);
        }

        const data = await res.json();

        return {
            city: data.name,
            country: data.sys?.country,
            temp: data.main?.temp,
            feels_like: data.main?.feels_like,
            humidity: data.main?.humidity,
            wind_speed: data.wind?.speed,
            description: data.weather?.[0]?.description,
            icon: data.weather?.[0]?.icon,    
            main: data.weather?.[0]?.main,
            raw: data
        };
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('Zahtev je istekao (timeout). Pokušaj ponovo.');
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}

export async function fetchForecast(city) {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
    const geo = await geoRes.json();
    if (!geo || !geo[0]) throw new Error('Grad nije pronađen');
    const { lat, lon } = geo[0];
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error('Greška pri dohvatu prognoze');
    const data = await res.json();
    return data;
}