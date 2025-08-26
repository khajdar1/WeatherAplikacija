import React from 'react';

function groupByDay(list) {
    const days = {};
    list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date] || item.dt_txt.endsWith('12:00:00')) {
            days[date] = item;
        }
    });
    return Object.values(days).slice(0, 5); // prvih 5 dana
}

export default function Forecast({ data }) {
    if (!data || !data.list) return null;
    const daily = groupByDay(data.list);

    return (
        <div className="forecast-wrap">
            <h3>Prognoza za naredne dane</h3>
            <div className="forecast-list">
                {daily.map(item => (
                    <div className="forecast-card" key={item.dt}>
                        <div>{item.dt_txt.split(' ')[0]}</div>
                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            width={48}
                            height={48}
                        />
                        <div>{Math.round(item.main.temp)}°C</div>
                        <div style={{ textTransform: 'capitalize', fontSize: 13 }}>{item.weather[0].description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}