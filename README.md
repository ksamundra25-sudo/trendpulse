# TrendPulse 📊
> Real-time social media trend analytics platform — BSc Computing Final Project

## What it does
Tracks trending topics across Reddit, YouTube, and Google Trends in real time.
Runs NLP sentiment analysis (HuggingFace) and displays a custom TrendPulse Score
on a React dashboard with live charts.

## Tech Stack
| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React, Recharts, Tailwind CSS           |
| Backend    | FastAPI (Python)                        |
| Database   | PostgreSQL + Redis (caching)            |
| ML / NLP   | HuggingFace Transformers, scikit-learn  |
| Data APIs  | Reddit (PRAW), YouTube Data v3, pytrends|

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env        # fill in your API keys (see below)
pip install -r requirements.txt
uvicorn app.main:app --reload
# API live at http://localhost:8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# App live at http://localhost:5173
```

## API Keys You Need
| Service       | Where to get it                                          |
|---------------|----------------------------------------------------------|
| Reddit        | https://www.reddit.com/prefs/apps  (create "script" app)|
| YouTube       | https://console.cloud.google.com   (enable YouTube API v3)|
| Google Trends | No key needed — pytrends uses public data               |

## Project Structure
```
trendpulse/
├── backend/
│   └── app/
│       ├── main.py           ← FastAPI entry point
│       ├── api/              ← Route handlers (trends, search, sentiment)
│       ├── core/             ← Config, database session
│       ├── models/           ← SQLAlchemy ORM models
│       ├── services/         ← Reddit, YouTube, Google Trends, Sentiment
│       └── ml/               ← ML models & training scripts
└── frontend/
    └── src/
        ├── components/       ← Reusable UI components
        ├── pages/            ← Dashboard, Search, Analytics pages
        ├── hooks/            ← Custom React hooks (useTrends, useSearch)
        └── services/         ← API client (api.js)
```

## TrendPulse Score Formula
```
Score (0-100) = Volume component (0-50)
              + Sentiment bonus  (0-20)
              + Velocity score   (0-30)

Volume   = log(upvotes) / log(100,000) × 50   (diminishing returns)
Sentiment= (avg_sentiment + 1) / 2 × 20        (maps -1..1 to 0..20)
Velocity = min(post_count × 3 / 100, 1) × 30  (capped at 30)
```
