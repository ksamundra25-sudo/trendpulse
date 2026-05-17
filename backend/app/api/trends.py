from fastapi import APIRouter, HTTPException
from app.services import reddit_service, youtube_service, google_trends_service
from app.services.sentiment_service import analyze_sentiment, calculate_trend_score

router = APIRouter()

@router.get("/reddit")
async def get_reddit_trends(subreddit: str = "all", limit: int = 25):
    try:
        posts = reddit_service.fetch_trending_topics(subreddit, limit)
        return {"platform": "reddit", "data": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/youtube")
async def get_youtube_trends(region: str = "GB"):
    try:
        videos = youtube_service.fetch_trending_videos(region)
        return {"platform": "youtube", "data": videos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/google")
async def get_google_trends():
    try:
        trends = google_trends_service.get_trending_searches()
        return {"platform": "google", "data": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/score/{keyword}")
async def get_trend_score(keyword: str):
    """Calculate a TrendPulse score for a given keyword."""
    try:
        posts = reddit_service.search_keyword(keyword, limit=20)
        texts = [p["title"] for p in posts[:10] if p["title"]]
        sentiments = analyze_sentiment(texts) if texts else []
        avg_sentiment = sum(s["score"] for s in sentiments) / len(sentiments) if sentiments else 0
        total_score = sum(p["score"] for p in posts)
        trend_score = calculate_trend_score(
            volume=total_score,
            sentiment=avg_sentiment,
            velocity=len(posts) * 2.5,
        )
        return {
            "keyword": keyword,
            "trend_score": trend_score,
            "sentiment": avg_sentiment,
            "post_count": len(posts),
            "total_upvotes": total_score,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
