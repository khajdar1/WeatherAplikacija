import React, { useState } from 'react';

export default function Search({ onSearch }) {
    const [q, setQ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = q.trim();
        if (!trimmed) return;
        onSearch(trimmed);
        setQ('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input
                type="text"
                placeholder="Unesi ime grada (npr. Belgrade)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="search-city"
            />
            <button type="submit">Pretraži</button>
        </form>
    );
}