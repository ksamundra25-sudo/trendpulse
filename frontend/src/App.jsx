import { useState } from "react"
import { TrendingUp, Home, BarChart2, Trophy, Landmark, Cloud, Menu, X } from "lucide-react"
import Dashboard from "./pages/Dashboard"
import Trends from "./pages/Trends"
import Sports from "./pages/Sports"
import Politics from "./pages/Politics"
import Weather from "./pages/Weather"

const NAV = [
  { id: "home",     label: "Home",     icon: Home },
  { id: "trends",   label: "Trends",   icon: BarChart2 },
  { id: "sports",   label: "Sports",   icon: Trophy },
  { id: "politics", label: "Politics", icon: Landmark },
  { id: "weather",  label: "Weather",  icon: Cloud },
]

export default function App() {
  const [page, setPage] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false)

  const pages = { home: Dashboard, trends: Trends, sports: Sports, politics: Politics, weather: Weather }
  const PageComponent = pages[page]

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0f0f18", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 100 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2.5rem", padding: "0 0.5rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "white" }}>TrendPulse</div>
            <div style={{ fontSize: "0.65rem", color: "#6b6880" }}>Analytics Platform</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  background: active ? "rgba(124,58,237,0.15)" : "transparent",
                  color: active ? "#a78bfa" : "#6b6880",
                  fontSize: "0.85rem", fontWeight: active ? 600 : 400,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  borderLeft: active ? "3px solid #7c3aed" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 0.5rem", fontSize: "0.7rem", color: "#22c55e" }}>
          <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }}></span>
          All systems live
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, flex: 1, padding: "2rem", maxWidth: "calc(100vw - 220px)" }}>
        <PageComponent />
      </div>
    </div>
  )
}
