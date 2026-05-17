import { useState, useEffect } from "react"
import { TrendingUp, Search, RefreshCw, ExternalLink, ChevronDown, ChevronUp, Activity } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function Trends() {
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const fetchTrends = () => {
    setRefreshing(true)
    fetch("http://127.0.0.1:8000/api/trends")
      .then(r => r.json())
      .then(data => {
        setTrends(data.data || [])
        setFiltered(data.data || [])
        setLastUpdated(new Date().toLocaleTimeString())
        setLoading(false)
        setRefreshing(false)
      })
      .catch(() => { setLoading(false); setRefreshing(false) })
  }

  useEffect(() => { fetchTrends() }, [])

  useEffect(() => {
    if (!search.trim()) setFiltered(trends)
    else setFiltered(trends.filter(t => t.title.toLowerCase().includes(search.toLowerCase())))
  }, [search, trends])

  const topScore = trends.length > 0 ? Math.max(...trends.map(t => t.trend_score)) : 0
  const avgComments = trends.length > 0 ? Math.round(trends.reduce((a, t) => a + t.comments, 0) / trends.length) : 0

  const chartData = trends.slice(0, 8).map(t => ({
    name: t.title.slice(0, 15) + "...",
    score: t.trend_score,
  }))

  const getColor = (score) => score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#a78bfa"
  const getSentiment = (score) => {
    if (score >= 70) return { label: "Positive", color: "#22c55e", bg: "rgba(34,197,94,0.1)" }
    if (score >= 50) return { label: "Neutral", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" }
    return { label: "Mixed", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" }
  }
  const getBreakdown = (t) => {
    const volume = Math.min(Math.log(t.score + 1) / Math.log(10000) * 50, 50).toFixed(1)
    const velocity = Math.min(t.comments / 200 * 30, 30).toFixed(1)
    const bonus = Math.max(0, t.trend_score - parseFloat(volume) - parseFloat(velocity)).toFixed(1)
    return { volume, velocity, bonus }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Tech Trends</h1>
          <p style={{ color: "#6b6880", fontSize: "0.8rem", margin: "4px 0 0" }}>Live from HackerNews · {lastUpdated ? `Updated ${lastUpdated}` : "Loading..."}</p>
        </div>
        <button
          onClick={fetchTrends}
          disabled={refreshing}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", borderRadius: 10, color: "#a78bfa", fontSize: "0.8rem", padding: "8px 16px", cursor: "pointer" }}
        >
          <RefreshCw size={13} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Stories tracked", value: trends.length, color: "#a78bfa" },
          { label: "Avg comments", value: avgComments, color: "#34d399" },
          { label: "Top score", value: topScore.toFixed(1), color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#6b6880", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#a78bfa", margin: "0 0 1rem 0" }}>Top 8 by TrendPulse Score</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: "#6b6880", fontSize: 8 }} />
            <YAxis tick={{ fill: "#6b6880", fontSize: 8 }} />
            <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #7c3aed", borderRadius: 8, color: "white", fontSize: 11 }} cursor={{ fill: "rgba(124,58,237,0.1)" }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((e, i) => <Cell key={i} fill={getColor(e.score)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b6880" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search trends..."
          style={{ width: "100%", background: "#13131f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px 10px 36px", color: "white", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ff6314", padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600 }}>
          <Activity size={11} /> HackerNews
        </div>
        <span style={{ fontSize: "0.7rem", color: "#6b6880" }}>
          {search ? `${filtered.length} results for "${search}"` : "Click any story for full breakdown"}
        </span>
      </div>

      {loading && <div style={{ textAlign: "center", color: "#6b6880", padding: "3rem" }}>Loading live trends...</div>}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((t, i) => {
            const isOpen = expandedId === t.rank
            const sentiment = getSentiment(t.trend_score)
            const breakdown = getBreakdown(t)
            return (
              <div
                key={i}
                onClick={() => setExpandedId(isOpen ? null : t.rank)}
                style={{ background: isOpen ? "rgba(124,58,237,0.08)" : "#13131f", border: `1px solid ${isOpen ? "#7c3aed" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: "0.85rem 1rem", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "0.7rem", color: "#4b4860", fontFamily: "monospace", width: 16 }}>{t.rank}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isOpen ? "normal" : "nowrap" }}>{t.title}</p>
                    <p style={{ fontSize: "0.7rem", color: "#6b6880", margin: "3px 0 0" }}>{t.score} pts · {t.comments} comments</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: getColor(t.trend_score), background: "rgba(255,255,255,0.05)", padding: "2px 10px", borderRadius: 20 }}>{t.trend_score}</span>
                    {isOpen ? <ChevronUp size={14} color="#6b6880" /> : <ChevronDown size={14} color="#6b6880" />}
                  </div>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: sentiment.color, background: sentiment.bg, padding: "3px 10px", borderRadius: 20 }}>{sentiment.label} Sentiment</span>
                      <span style={{ fontSize: "0.7rem", color: "#6b6880" }}>based on engagement signals</span>
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "#6b6880", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Score Breakdown</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: "0.75rem" }}>
                      {[
                        { label: "Volume", value: breakdown.volume, color: "#a78bfa", desc: "Upvote score" },
                        { label: "Velocity", value: breakdown.velocity, color: "#34d399", desc: "Comment rate" },
                        { label: "Bonus", value: breakdown.bonus, color: "#f59e0b", desc: "Tone bonus" },
                      ].map(b => (
                        <div key={b.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px", textAlign: "center" }}>
                          <div style={{ fontSize: "1rem", fontWeight: 600, color: b.color }}>{b.value}</div>
                          <div style={{ fontSize: "0.65rem", color: "#6b6880", marginTop: 2 }}>{b.label}</div>
                          <div style={{ fontSize: "0.6rem", color: "#4b4860" }}>{b.desc}</div>
                        </div>
                      ))}
                    </div>
                    {t.url && (
                      <button
                        onClick={e => { e.stopPropagation(); window.open(t.url, "_blank") }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(124,58,237,0.3)", cursor: "pointer" }}
                      >
                        <ExternalLink size={12} /> Read full article
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && search && (
            <div style={{ textAlign: "center", color: "#6b6880", padding: "2rem" }}>No trends found for "{search}"</div>
          )}
        </div>
      )}
    </div>
  )
}
