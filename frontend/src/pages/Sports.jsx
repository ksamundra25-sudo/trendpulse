import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

const DAY_TABS = [
  { id: "yesterday", label: "Yesterday" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
]

const MAIN_TABS = [
  { id: "matches", label: "⚽ Matches" },
  { id: "standings", label: "🏆 Standings" },
]

const LEAGUES = [
  { id: 39, name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England" },
  { id: 140, name: "La Liga", flag: "🇪🇸", country: "Spain" },
  { id: 78, name: "Bundesliga", flag: "🇩🇪", country: "Germany" },
  { id: 61, name: "Ligue 1", flag: "🇫🇷", country: "France" },
]

const SEASONS = [
  { year: 2025, label: "2025/26" },
  { year: 2024, label: "2024/25" },
  { year: 2023, label: "2023/24" },
]

const FormBadge = ({ result }) => {
  const colors = { W: "#22c55e", D: "#f59e0b", L: "#f87171" }
  return (
    <span style={{ width: 18, height: 18, borderRadius: 4, background: colors[result] || "#4b4860", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "white" }}>
      {result}
    </span>
  )
}

const StatusBadge = ({ match }) => {
  if (match.isLive) return (
    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 20 }}>
      🔴 {match.time}
    </span>
  )
  if (match.status === "FT") return (
    <span style={{ fontSize: "0.65rem", color: "#6b6880", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 20 }}>FT</span>
  )
  if (match.status === "HT") return (
    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#f59e0b", background: "rgba(245,158,11,0.1)", padding: "2px 8px", borderRadius: 20 }}>HT</span>
  )
  if (match.status === "NS") {
    const d = new Date(match.date)
    return (
      <span style={{ fontSize: "0.65rem", color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "2px 8px", borderRadius: 20 }}>
        {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </span>
    )
  }
  return (
    <span style={{ fontSize: "0.65rem", color: "#6b6880", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 20 }}>
      {match.status}
    </span>
  )
}

const MatchCard = ({ match }) => (
  <div style={{ background: "#13131f", border: `1px solid ${match.isLive ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "0.85rem 1.25rem" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: "0.65rem", color: "#6b6880" }}>{match.country} · {match.league}</span>
      <StatusBadge match={match} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
      <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>{match.home}</span>
      <div style={{ textAlign: "center", background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 20px", minWidth: 80 }}>
        {match.homeScore !== null && match.awayScore !== null
          ? <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{match.homeScore} - {match.awayScore}</span>
          : <span style={{ fontSize: "0.85rem", color: "#6b6880" }}>vs</span>
        }
      </div>
      <span style={{ fontSize: "0.92rem", fontWeight: 600, textAlign: "right" }}>{match.away}</span>
    </div>
  </div>
)

export default function Sports() {
  const [mainTab, setMainTab] = useState("matches")
  const [dayTab, setDayTab] = useState("today")
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeLeague, setActiveLeague] = useState(39)
  const [activeSeason, setActiveSeason] = useState(2025)
  const [standings, setStandings] = useState({})
  const [standingsLoading, setStandingsLoading] = useState(false)

  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMatches = (day) => {
    setLoading(true)
    fetch(`https://trendpulse-production-fd41.up.railway.app/api/sports/football?day=${day}`)
      .then(r => r.json())
      .then(data => {
        setMatches(data.data || [])
        setLastUpdated(new Date().toLocaleTimeString())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const fetchStandings = (league, season) => {
    const key = `${league}_${season}`
    if (standings[key]) return
    setStandingsLoading(true)
    fetch(`https://trendpulse-production-fd41.up.railway.app/api/sports/standings?league=${league}&season=${season}`)
      .then(r => r.json())
      .then(data => {
        setStandings(prev => ({ ...prev, [key]: data.data || [] }))
        setStandingsLoading(false)
      })
      .catch(() => setStandingsLoading(false))
  }

  useEffect(() => {
    if (mainTab === "matches") fetchMatches(dayTab)
  }, [mainTab, dayTab])

  useEffect(() => {
    if (mainTab === "standings") fetchStandings(activeLeague, activeSeason)
  }, [mainTab, activeLeague, activeSeason])

  const liveMatches = matches.filter(m => m.isLive)
  const currentStandings = standings[`${activeLeague}_${activeSeason}`] || []
  const leagueInfo = LEAGUES.find(l => l.id === activeLeague)

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Sports</h1>
          <p style={{ color: "#6b6880", fontSize: "0.8rem", margin: "4px 0 0" }}>
            {liveMatches.length > 0 ? `🔴 ${liveMatches.length} live now` : "Live scores, results and standings"}
            {lastUpdated ? ` · ${lastUpdated}` : ""}
          </p>
        </div>
        <button
          onClick={() => mainTab === "matches" ? fetchMatches(dayTab) : fetchStandings(activeLeague, activeSeason)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, color: "#22c55e", fontSize: "0.8rem", padding: "8px 16px", cursor: "pointer" }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total matches", value: matches.length, color: "#a78bfa" },
          { label: "Live now", value: liveMatches.length, color: "#22c55e" },
          { label: "Finished", value: matches.filter(m => m.status === "FT").length, color: "#6b6880" },
        ].map(s => (
          <div key={s.label} style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#6b6880", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        {MAIN_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setMainTab(t.id)}
            style={{ padding: "8px 18px", borderRadius: 10, border: mainTab === t.id ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.07)", background: mainTab === t.id ? "rgba(124,58,237,0.15)" : "#13131f", color: mainTab === t.id ? "#a78bfa" : "#6b6880", fontSize: "0.85rem", fontWeight: mainTab === t.id ? 600 : 400, cursor: "pointer" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* MATCHES TAB */}
      {mainTab === "matches" && (
        <div>
          {/* Day tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", background: "#13131f", padding: 4, borderRadius: 10, width: "fit-content", border: "1px solid rgba(255,255,255,0.07)" }}>
            {DAY_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setDayTab(t.id)}
                style={{ padding: "6px 18px", borderRadius: 8, border: "none", background: dayTab === t.id ? "#7c3aed" : "transparent", color: dayTab === t.id ? "white" : "#6b6880", fontSize: "0.82rem", fontWeight: dayTab === t.id ? 600 : 400, cursor: "pointer" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "#6b6880", padding: "4rem" }}>Loading matches...</div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6b6880", padding: "3rem", background: "#13131f", borderRadius: 12 }}>
              No matches found for this day.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {matches.map((m, i) => <MatchCard key={i} match={m} />)}
            </div>
          )}
        </div>
      )}

      {/* STANDINGS TAB */}
      {mainTab === "standings" && (
        <div>
          {/* League selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
            {LEAGUES.map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLeague(l.id)}
                style={{ padding: "7px 14px", borderRadius: 10, border: activeLeague === l.id ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.07)", background: activeLeague === l.id ? "rgba(124,58,237,0.15)" : "#13131f", color: activeLeague === l.id ? "#a78bfa" : "#6b6880", fontSize: "0.82rem", fontWeight: activeLeague === l.id ? 600 : 400, cursor: "pointer" }}
              >
                {l.flag} {l.name}
              </button>
            ))}
          </div>

          {/* Season selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#6b6880" }}>Season:</span>
            {SEASONS.map(s => (
              <button
                key={s.year}
                onClick={() => setActiveSeason(s.year)}
                style={{ padding: "5px 12px", borderRadius: 8, border: activeSeason === s.year ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.07)", background: activeSeason === s.year ? "rgba(124,58,237,0.15)" : "#13131f", color: activeSeason === s.year ? "#a78bfa" : "#6b6880", fontSize: "0.78rem", fontWeight: activeSeason === s.year ? 700 : 400, cursor: "pointer" }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {standingsLoading ? (
            <div style={{ textAlign: "center", color: "#6b6880", padding: "4rem" }}>Loading standings...</div>
          ) : (
            <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {leagueInfo?.flag} {leagueInfo?.name} — {SEASONS.find(s => s.year === activeSeason)?.label}
                </span>
                <div style={{ display: "flex", gap: 12, fontSize: "0.65rem" }}>
                  <span style={{ color: "#22c55e" }}>● UCL</span>
                  <span style={{ color: "#3b82f6" }}>● UEL</span>
                  <span style={{ color: "#f59e0b" }}>● UECL</span>
                  <span style={{ color: "#f87171" }}>● Relegation</span>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["#", "Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts", "Form"].map(h => (
                        <th key={h} style={{ padding: "9px 10px", textAlign: h === "Team" ? "left" : "center", color: "#6b6880", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentStandings.map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: s.rank <= 4 ? "#22c55e" : s.rank <= 6 ? "#3b82f6" : s.rank === 7 ? "#f59e0b" : s.rank >= 18 ? "#f87171" : "#9ca3af" }}>
                          {s.rank}
                        </td>
                        <td style={{ padding: "9px 10px", fontWeight: 500, whiteSpace: "nowrap" }}>{s.team}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#6b6880" }}>{s.played}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#22c55e" }}>{s.won}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#f59e0b" }}>{s.drawn}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#f87171" }}>{s.lost}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#6b6880" }}>{s.gf}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: "#6b6880" }}>{s.ga}</td>
                        <td style={{ padding: "9px 10px", textAlign: "center", color: s.gd > 0 ? "#22c55e" : s.gd < 0 ? "#f87171" : "#6b6880" }}>
                          {s.gd > 0 ? `+${s.gd}` : s.gd}
                        </td>
                        <td style={{ padding: "9px 10px", textAlign: "center", fontWeight: 700, color: "#a78bfa" }}>{s.points}</td>
                        <td style={{ padding: "9px 10px" }}>
                          <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            {(s.form || "").split("").slice(-5).map((r, j) => (
                              <FormBadge key={j} result={r} />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {currentStandings.length === 0 && (
                      <tr>
                        <td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: "#6b6880" }}>
                          No data available — try a different season
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
