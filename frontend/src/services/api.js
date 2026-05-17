const BASE_URL = "http://localhost:8000/api";

export const api = {
  getRedditTrends: (subreddit = "all") =>
    fetch(`${BASE_URL}/trends/reddit?subreddit=${subreddit}`).then(r => r.json()),

  getYoutubeTrends: (region = "GB") =>
    fetch(`${BASE_URL}/trends/youtube?region=${region}`).then(r => r.json()),

  getGoogleTrends: () =>
    fetch(`${BASE_URL}/trends/google`).then(r => r.json()),

  searchKeyword: (keyword) =>
    fetch(`${BASE_URL}/search/${encodeURIComponent(keyword)}`).then(r => r.json()),

  getTrendScore: (keyword) =>
    fetch(`${BASE_URL}/trends/score/${encodeURIComponent(keyword)}`).then(r => r.json()),

  analyzeSentiment: (texts) =>
    fetch(`${BASE_URL}/sentiment/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts }),
    }).then(r => r.json()),
};
