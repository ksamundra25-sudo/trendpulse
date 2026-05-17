import { useState } from "react"
import { useSearch } from "../hooks/useTrends"
import { Search as SearchIcon, TrendingUp } from "lucide-react"

export default function Search() {
  const [query, setQuery] = useState("")
  const { result, loading, search } = useSearch()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) search(query.trim())
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Keyword Analysis</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter a keyword or topic..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-violet-500"
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
        >
          <SearchIcon size={15} />
          Analyse
        </button>
      </form>

      {loading && <p className="text-gray-500 text-center py-10">Analysing...</p>}

      {result && !loading && (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-violet-400" />
              <h2 className="font-semibold">"{result.keyword}"</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Stat label="TrendPulse Score" value={result.trend_score} />
              <Stat label="Avg Sentiment" value={(result.avg_sentiment * 100).toFixed(0) + "%"} />
              <Stat label="Posts Found" value={result.top_posts?.length ?? 0} />
            </div>
          </div>

          {result.sentiment_breakdown && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Sentiment Breakdown</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400">✓ {result.sentiment_breakdown.positive} positive</span>
                <span className="text-red-400">✗ {result.sentiment_breakdown.negative} negative</span>
                <span className="text-gray-400">~ {result.sentiment_breakdown.neutral} neutral</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Top Posts</h3>
            {(result.top_posts || []).map((post, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm">
                <p className="text-white">{post.title}</p>
                <p className="text-gray-500 mt-1">{post.score} upvotes</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-violet-400">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
