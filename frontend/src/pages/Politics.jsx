import { useState, useEffect } from "react"
import { Landmark, RefreshCw, ExternalLink } from "lucide-react"

const TOPICS = [
  { id: "UK+politics", label: "🇬🇧 UK Politics" },
  { id: "US+politics", label: "🇺🇸 US Politics" },
  { id: "Europe+politics", label: "🇪🇺 Europe" },
  { id: "Africa+politics", label: "🌍 Africa" },
  { id: "Asia+politics", label: "🌏 Asia" },
  { id: "Middle+East+politics", label: "🕌 Middle East" },
  { id: "climate+change", label: "🌱 Climate" },
  { id: "economy+finance", label: "💰 Economy" },
]

const getSentiment = (title, description) => {
  const text = (title + " " + (description || "")).toLowerCase()
  const positive = ["deal", "growth", "success", "win", "agreement", "boost", "improve", "record", "achieve", "open"]
  const negative = ["crisis", "war", "conflict", "fail", "cut", "loss", "death", "attack", "threat", "collapse", "resign"]
  const posCount = positive.filter(w => text.includes(w)).length
  const negCount = negative.filter(w => text.includes(w)).length
  if (posCount > negCount) return { label: "Positive", color: "#22c55e", bg: "rgba(34,197,94,0.1)" }
  if (negCount > posCount) return { label: "Negative", color: "#f87171", bg: "rgba(248,113,113,0.1)" }
  return { label: "Neutral", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" }
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return "Just now"
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Politics() {
  const [topic, setTopic] = useState("UK+politics")
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchNews = (t) => {
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/news/search?query=${t}`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.data || [])
        setLastUpdated(new Date().toLocaleTimeString())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchNews(topic) }, [topic])

  const handleTopic = (t) => {
    setTopic(t)
    fetchNews(t)
  }

  const positive = articles.filter(a => getSentiment(a.title, a.description).label === "Positive").length
  const negative = articles.filter(a => getSentiment(a.title, a.description).label === "Negative").length
  const neutral = articles.length - positive - negative

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Politics & World News</h1>
          <p style={{ color: "#6b6880", fontSize: "0.8rem", margin: "4px 0 0" }}>
            Real headlines · {lastUpdated ? `Updated ${lastUpdated}` : "Loading..."}
          </p>
        </div>
        <button
          onClick={() => fetchNews(topic)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed", borderRadius: 10, color: "#a78bfa", fontSize: "0.8rem", padding: "8px 16px", cursor: "pointer" }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Topic tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTopic(t.id)}
            style={{ padding: "7px 14px", borderRadius: 10, border: topic === t.id ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.07)", background: topic === t.id ? "rgba(124,58,237,0.15)" : "#13131f", color: topic === t.id ? "#a78bfa" : "#6b6880", fontSize: "0.8rem", fontWeight: topic === t.id ? 600 : 400, cursor: "pointer" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Articles", value: articles.length, color: "#a78bfa" },
          { label: "Positive", value: positive, color: "#22c55e" },
          { label: "Negative", value: negative, color: "#f87171" },
          { label: "Neutral", value: neutral, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#6b6880", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Articles */}
      {loading && (
        <div style={{ textAlign: "center", color: "#6b6880", padding: "4rem" }}>
          Loading real headlines...
        </div>
      )}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {articles.map((a, i) => {
            const sentiment = getSentiment(a.title, a.description)
            return (
              <div key={i} style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1rem 1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: 500, margin: "0 0 6px", lineHeight: 1.4 }}>{a.title}</p>
                    {a.description && (
                      <p style={{ fontSize: "0.78rem", color: "#6b6880", margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {a.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.7rem", color: "#a78bfa", fontWeight: 600 }}>{a.source}</span>
                      <span style={{ fontSize: "0.7rem", color: "#4b4860" }}>·</span>
                      <span style={{ fontSize: "0.7rem", color: "#6b6880" }}>{timeAgo(a.publishedAt)}</span>
                      {a.url && (
                        <button
                          onClick={() => window.open(a.url, "_blank")}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#7c3aed", background: "rgba(124,58,237,0.1)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(124,58,237,0.2)", cursor: "pointer" }}
                        >
                          <ExternalLink size={10} /> Read
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: sentiment.color, background: sentiment.bg, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {sentiment.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {articles.length === 0 && (
            <div style={{ textAlign: "center", color: "#6b6880", padding: "3rem" }}>
              No articles found. Try a different topic.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
