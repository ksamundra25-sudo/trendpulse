import { useState, useEffect } from "react"
import { TrendingUp, Trophy, Cloud, Landmark, ArrowUp, Users, Activity, Zap } from "lucide-react"

const StatCard = ({ label, value, sub, color, icon: Icon }) => (
  <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "0.75rem", color: "#6b6880", fontWeight: 500 }}>{label}</span>
      <div style={{ width: 32, height: 32, background: `${color}20`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={15} color={color} />
      </div>
    </div>
    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "white" }}>{value}</div>
    <div style={{ fontSize: "0.7rem", color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
      <ArrowUp size={10} /> {sub}
    </div>
  </div>
)

const QuickCard = ({ title, value, label, color }) => (
  <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
      <p style={{ fontSize: "0.8rem", color: "white", margin: 0, fontWeight: 500 }}>{title}</p>
      <p style={{ fontSize: "0.7rem", color: "#6b6880", margin: "3px 0 0" }}>{label}</p>
    </div>
    <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{value}</span>
  </div>
)

export default function Dashboard() {
  const [trends, setTrends] = useState([])
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/trends")
      .then(r => r.json())
      .then(d => setTrends(d.data || []))
      .catch(() => {})
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const topTrend = trends[0]
  const topScore = trends.length > 0 ? Math.max(...trends.map(t => t.trend_score)) : 0

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>Welcome back 👋</h1>
            <p style={{ color: "#6b6880", fontSize: "0.85rem", margin: "4px 0 0" }}>
              {time.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {time.toLocaleTimeString()}
            </p>
          </div>
          <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: "0.75rem", color: "#22c55e", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
            Live Data
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Trends Tracked" value={trends.length} sub="Updated now" color="#7c3aed" icon={TrendingUp} />
        <StatCard label="Top Score" value={topScore.toFixed(1)} sub="TrendPulse Score" color="#f59e0b" icon={Zap} />
        <StatCard label="Data Sources" value="3" sub="HackerNews, Sports, Weather" color="#22c55e" icon={Activity} />
        <StatCard label="Countries" value="195" sub="Weather coverage" color="#3b82f6" icon={Cloud} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>

        {/* Top trends */}
        <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <TrendingUp size={15} color="#7c3aed" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Top Trends Right Now</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {trends.slice(0, 5).map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                <span style={{ fontSize: "0.7rem", color: "#4b4860", width: 14, fontFamily: "monospace" }}>{i + 1}</span>
                <p style={{ fontSize: "0.8rem", margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</p>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: t.trend_score >= 70 ? "#22c55e" : t.trend_score >= 50 ? "#f59e0b" : "#a78bfa" }}>
                  {t.trend_score}
                </span>
              </div>
            ))}
            {trends.length === 0 && (
              <p style={{ color: "#6b6880", fontSize: "0.8rem", textAlign: "center", padding: "1rem" }}>Loading trends...</p>
            )}
          </div>
        </div>

        {/* Platform overview */}
        <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <Activity size={15} color="#22c55e" />
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Platform Overview</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "Tech Trends", source: "HackerNews", status: "Live", color: "#ff6314", pct: 85 },
              { name: "Sports", source: "ESPN API", status: "Live", color: "#22c55e", pct: 92 },
              { name: "Politics", source: "NewsAPI", status: "Live", color: "#3b82f6", pct: 78 },
              { name: "Weather", source: "Open-Meteo", status: "Live", color: "#06b6d4", pct: 100 },
            ].map(p => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.78rem", color: "white" }}>{p.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "#22c55e" }}>{p.status}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                  <div style={{ height: 4, width: `${p.pct}%`, background: p.color, borderRadius: 4 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick facts */}
      <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: "0 0 1rem 0" }}>Quick Facts</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <QuickCard title="London" value="13°C" label="Partly cloudy" color="#06b6d4" />
          <QuickCard title="Premier League" value="Live" label="Check Sports tab" color="#22c55e" />
          <QuickCard title="Top Story" value={topTrend ? `${topTrend.trend_score}` : "—"} label={topTrend ? topTrend.title.slice(0, 30) + "..." : "Loading..."} color="#f59e0b" />
        </div>
      </div>
    </div>
  )
}
