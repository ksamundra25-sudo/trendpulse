const BASE_URL = "https://trendpulse-production-fd41.up.railway.app"

export const api = {
  getTrends: () =>
    fetch(`${BASE_URL}/api/trends`).then(r => r.json()),
  getNews: (query) =>
    fetch(`${BASE_URL}/api/news/search?query=${query}`).then(r => r.json()),
  getFootball: (day = "today") =>
    fetch(`${BASE_URL}/api/sports/football?day=${day}`).then(r => r.json()),
  getStandings: (league, season) =>
    fetch(`${BASE_URL}/api/sports/standings?league=${league}&season=${season}`).then(r => r.json()),
}