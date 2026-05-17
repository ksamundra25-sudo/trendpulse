from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import random
import math
from datetime import date, timedelta

app = FastAPI(title="TrendPulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NEWS_API_KEY = "2a025e4ef0514e9d858edaa23fc41abd"
SPORTS_API_KEY = "0828b5b5d3ca9b7b5f38d6206b67b085"
SPORTS_HEADERS = {"x-apisports-key": SPORTS_API_KEY}


@app.get("/")
def root():
    return {"message": "TrendPulse API is running"}


@app.get("/api/trends")
def get_trends():
    try:
        ids = requests.get("https://hacker-news.firebaseio.com/v0/topstories.json").json()[:20]
        trends = []
        for i, story_id in enumerate(ids):
            story = requests.get(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json").json()
            if not story or story.get("type") != "story":
                continue
            score = story.get("score", 0)
            comments = story.get("descendants", 0)
            volume = min(math.log(score + 1) / math.log(10000) * 50, 50)
            velocity = min(comments / 200 * 30, 30)
            sentiment = round(random.uniform(5, 20), 1)
            trends.append({
                "rank": i + 1,
                "title": story.get("title", ""),
                "source": "HackerNews",
                "score": score,
                "comments": comments,
                "url": story.get("url", ""),
                "trend_score": round(volume + velocity + sentiment, 1),
            })
        return {"platform": "hackernews", "data": trends}
    except Exception as e:
        return {"error": str(e), "data": []}


@app.get("/api/news")
def get_news(category: str = "general", country: str = "gb"):
    try:
        url = f"https://newsapi.org/v2/top-headlines?category={category}&country={country}&pageSize=20&apiKey={NEWS_API_KEY}"
        data = requests.get(url).json()
        if data.get("status") != "ok":
            return {"error": data.get("message"), "data": []}
        articles = []
        for i, a in enumerate(data.get("articles", [])):
            if not a.get("title") or a["title"] == "[Removed]":
                continue
            articles.append({
                "rank": i + 1,
                "title": a.get("title", ""),
                "source": a.get("source", {}).get("name", "Unknown"),
                "url": a.get("url", ""),
                "description": a.get("description", ""),
                "publishedAt": a.get("publishedAt", ""),
            })
        return {"category": category, "country": country, "data": articles}
    except Exception as e:
        return {"error": str(e), "data": []}


@app.get("/api/news/search")
def search_news(query: str = "politics"):
    try:
        url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&pageSize=20&language=en&apiKey={NEWS_API_KEY}"
        data = requests.get(url).json()
        if data.get("status") != "ok":
            return {"error": data.get("message"), "data": []}
        articles = []
        for i, a in enumerate(data.get("articles", [])):
            if not a.get("title") or a["title"] == "[Removed]":
                continue
            articles.append({
                "rank": i + 1,
                "title": a.get("title", ""),
                "source": a.get("source", {}).get("name", "Unknown"),
                "url": a.get("url", ""),
                "description": a.get("description", ""),
                "publishedAt": a.get("publishedAt", ""),
            })
        return {"query": query, "data": articles}
    except Exception as e:
        return {"error": str(e), "data": []}


def parse_fixtures(response_data):
    matches = []
    for f in response_data:
        fixture = f["fixture"]
        teams = f["teams"]
        goals = f["goals"]
        league = f["league"]
        status = fixture["status"]
        elapsed = status.get("elapsed")
        matches.append({
            "id": fixture["id"],
            "home": teams["home"]["name"],
            "away": teams["away"]["name"],
            "homeScore": goals["home"],
            "awayScore": goals["away"],
            "status": status["short"],
            "time": f"{elapsed}'" if elapsed else status["short"],
            "league": league["name"],
            "country": league["country"],
            "date": fixture["date"],
            "isLive": status["short"] in ["1H", "2H", "HT", "ET", "P"],
        })
    return matches


@app.get("/api/sports/football")
def get_football(day: str = "today"):
    try:
        if day == "yesterday":
            target = (date.today() - timedelta(days=1)).isoformat()
        elif day == "tomorrow":
            target = (date.today() + timedelta(days=1)).isoformat()
        else:
            target = date.today().isoformat()

        matches = []
        seen = set()

        if day == "today":
            live = requests.get(
                "https://v3.football.api-sports.io/fixtures?live=all",
                headers=SPORTS_HEADERS
            ).json()
            for f in live.get("response", []):
                fid = f["fixture"]["id"]
                if fid not in seen:
                    seen.add(fid)
                    matches.extend(parse_fixtures([f]))

        todays = requests.get(
            f"https://v3.football.api-sports.io/fixtures?date={target}",
            headers=SPORTS_HEADERS
        ).json()

        for f in todays.get("response", []):
            fid = f["fixture"]["id"]
            if fid not in seen:
                seen.add(fid)
                matches.extend(parse_fixtures([f]))

        return {"day": day, "date": target, "data": matches[:50]}
    except Exception as e:
        return {"error": str(e), "data": []}


@app.get("/api/sports/standings")
def get_standings(league: int = 39, season: int = 2025):
    try:
        res = requests.get(
            f"https://v3.football.api-sports.io/standings?league={league}&season={season}",
            headers=SPORTS_HEADERS
        ).json()

        standings = []
        for group in res.get("response", []):
            for league_data in group.get("league", {}).get("standings", []):
                for team in league_data:
                    standings.append({
                        "rank": team["rank"],
                        "team": team["team"]["name"],
                        "played": team["all"]["played"],
                        "won": team["all"]["win"],
                        "drawn": team["all"]["draw"],
                        "lost": team["all"]["lose"],
                        "gf": team["all"]["goals"]["for"],
                        "ga": team["all"]["goals"]["against"],
                        "gd": team["goalsDiff"],
                        "points": team["points"],
                        "form": team.get("form", ""),
                    })

        return {"league": league, "season": season, "data": standings}
    except Exception as e:
        return {"error": str(e), "data": []}
