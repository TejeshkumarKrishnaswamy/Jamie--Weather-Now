import React, { useState } from "react";
import axios from "axios";

interface Weather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setError("City not found.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoRes.data.results[0];

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      setWeather(weatherRes.data.current_weather);
      setCity(name);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "🌤️";
    if (code <= 48) return "🌥️";
    if (code <= 57) return "🌧️";
    if (code <= 67) return "🌦️";
    if (code <= 77) return "🌨️";
    if (code <= 99) return "⛈️";
    return "❓";
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-center text-purple-800 mb-8 animate-bounce">
        Jamie – Weather Now
      </h1>

      {/* Persona Section */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">User Persona</h2>
        <p><strong>Name:</strong> Jamie</p>
        <p><strong>Occupation:</strong> Outdoor Enthusiast</p>
        <p>
          <strong>Role:</strong> Jamie wants to <span className="font-bold text-pink-600">
          quickly check the current weather</span> for any city to plan outdoor activities.
        </p>
      </section>

      {/* Task Section */}
      <section className="card">
        <h2 className="text-2xl font-semibold mb-2 text-pink-600">Task</h2>
        <p>
          To Build an application for Jamie to fetch <strong>real-time weather conditions</strong> 
          using the Open-Meteo API and make quick decisions.
        </p>
      </section>

      {/* City Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <button onClick={fetchWeather} className="button">
          {loading ? "Loading..." : "Check Weather"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Weather Display */}
      {weather && (
        <div className="card text-center">
          <h2 className="text-3xl font-semibold mb-4 text-purple-700">
            {getWeatherIcon(weather.weathercode)} {city}
          </h2>
          <p className="text-xl">🌡️ Temperature: {weather.temperature}°C</p>
          <p className="text-xl">💨 Wind Speed: {weather.windspeed} km/h</p>
          <p className="text-xl">🧭 Wind Direction: {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}
