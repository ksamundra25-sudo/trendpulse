import { useState, useEffect } from "react"
import { Cloud, RefreshCw, Wind, Droplets, Eye, Thermometer } from "lucide-react"

const CITIES = [
  { name: "London", country: "🇬🇧 UK", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "🇺🇸 USA", lat: 40.7128, lon: -74.0060 },
  { name: "Paris", country: "🇫🇷 France", lat: 48.8566, lon: 2.3522 },
  { name: "Tokyo", country: "🇯🇵 Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Dubai", country: "🇦🇪 UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", country: "🇦🇺 Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Lagos", country: "🇳🇬 Nigeria", lat: 6.5244, lon: 3.3792 },
  { name: "Mumbai", country: "🇮🇳 India", lat: 19.0760, lon: 72.8777 },
  { name: "Toronto", country: "🇨🇦 Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Berlin", country: "🇩🇪 Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Rio de Janeiro", country: "🇧🇷 Brazil", lat: -22.9068, lon: -43.1729 },
  { name: "Cairo", country: "🇪🇬 Egypt", lat: 30.0444, lon: 31.2357 },
]

const WMO_CODES = {
  0: { label: "Clear Sky", emoji: "☀️" },
  1: { label: "Mainly Clear", emoji: "🌤️" },
  2: { label: "Partly Cloudy", emoji: "⛅" },
  3: { label: "Overcast", emoji: "☁️" },
  45: { label: "Foggy", emoji: "🌫️" },
  48: { label: "Icy Fog", emoji: "🌫️" },
  51: { label: "Light Drizzle", emoji: "🌦️" },
  61: { label: "Light Rain", emoji: "🌧️" },
  63: { label: "Moderate Rain", emoji: "🌧️" },
  65: { label: "Heavy Rain", emoji: "🌧️" },
  71: { label: "Light Snow", emoji: "🌨️" },
  80: { label: "Rain Showers", emoji: "🌦️" },
  95: { label: "Thunderstorm", emoji: "⛈️" },
}

const getWeatherInfo = (code) => WMO_CODES[code] || { label: "Unknown", emoji: "🌡️" }

export default function Weather() {
  const [selected, setSelected] = useState(CITIES[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allWeather, setAllWeather] = useState({})

  const fetchWeather = async (city) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
      )
      const data = await res.json()
      setWeather(data)
      setAllWeather(prev => ({ ...prev, [city.name]: data?.current?.temperature_2m }))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchWeather(selected) }, [selected])

  const current = weather?.current
  const daily = weather?.daily
  const info = current ? getWeatherInfo(current.weather_code) : null

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Weather</h1>
        <p style={{ color: "#6b6880", fontSize: "0.8rem", margin: "4px 0 0" }}>Real-time weather for cities worldwide · Powered by Open-Meteo</p>
      </div>

      {/* City selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {CITIES.map(city => (
          <button
            key={city.name}
            onClick={() => setSelected(city)}
            style={{ padding: "6px 14px", borderRadius: 20, border: selected.name === city.name ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.07)", background: selected.name === city.name ? "rgba(124,58,237,0.15)" : "#13131f", color: selected.name === city.name ? "#a78bfa" : "#6b6880", fontSize: "0.78rem", fontWeight: selected.name === city.name ? 600 : 400, cursor: "pointer" }}
          >
            {city.name}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: "#6b6880", padding: "4rem" }}>
          <Cloud size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>Fetching weather data...</p>
        </div>
      )}

      {!loading && current && (
        <div>
          {/* Main weather card */}
          <div style={{ background: "linear-gradient(135deg, #1a1a3e, #0f0f28)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 16, padding: "2rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>{selected.country}</div>
                <div style={{ fontSize: "2rem", fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: "1rem", color: "#6b6880", marginTop: 4 }}>{info.label}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "5rem", lineHeight: 1 }}>{info.emoji}</div>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, marginTop: 4 }}>
                  {Math.round(current.temperature_2m)}°C
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6b6880" }}>
                  Feels like {Math.round(current.apparent_temperature)}°C
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Droplets size={16} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#6b6880" }}>Humidity</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{current.relative_humidity_2m}%</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Wind size={16} color="#06b6d4" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#6b6880" }}>Wind</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{Math.round(current.wind_speed_10m)} km/h</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Thermometer size={16} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#6b6880" }}>Feels like</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{Math.round(current.apparent_temperature)}°C</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 day forecast */}
          {daily && (
            <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 1rem 0" }}>5-Day Forecast</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }}>
                {daily.time.slice(0, 5).map((day, i) => {
                  const d = new Date(day)
                  const dayInfo = getWeatherInfo(daily.weather_code[i])
                  return (
                    <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", color: "#6b6880", marginBottom: 6 }}>
                        {i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}
                      </div>
                      <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{dayInfo.emoji}</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{Math.round(daily.temperature_2m_max[i])}°</div>
                      <div style={{ fontSize: "0.7rem", color: "#6b6880" }}>{Math.round(daily.temperature_2m_min[i])}°</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* City overview grid */}
      {!loading && (
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 1rem 0", color: "#6b6880" }}>Other Cities</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {CITIES.filter(c => c.name !== selected.name).slice(0, 8).map(city => (
              <button
                key={city.name}
                onClick={() => setSelected(city)}
                style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "0.75rem", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}>{city.name}</div>
                <div style={{ fontSize: "0.65rem", color: "#6b6880", marginTop: 2 }}>{city.country}</div>
                <div style={{ fontSize: "0.75rem", color: "#a78bfa", marginTop: 4 }}>
                  {allWeather[city.name] !== undefined ? `${Math.round(allWeather[city.name])}°C` : "Tap to load"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
