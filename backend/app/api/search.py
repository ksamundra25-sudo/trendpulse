from fastapi import APIRouter
from app.services import reddit_service
from app.services.sentiment_service import analyze_sentiment, calculate_trend_score

router = APIRouter()

@router.get("/{keyword}")
async def search_keyword(keyword: str):
    """Full cross-platform analysis of a keyword."""
    posts = reddit_service.search_keyword(keyword, limit=30)
    texts = [p["title"] for p in posts[:15] if p["title"]]
    sentiments = analyze_sentiment(texts) if texts else []
    avg_sentiment = sum(s["score"] for s in sentiments) / len(sentiments) if sentiments else 0
    positive = sum(1 for s in sentiments if s["label"] == "positive")
    negative = sum(1 for s in sentiments if s["label"] == "negative")
    neutral  = len(sentiments) - positive - negative
    score = calculate_trend_score(
        volume=sum(p["score"] for p in posts),
        sentiment=avg_sentiment,
        velocity=len(posts) * 3,
    )
    return {
        "keyword": keyword,
        "trend_score": score,
        "sentiment_breakdown": {"positive": positive, "negative": negative, "neutral": neutral},
        "avg_sentiment": avg_sentiment,
        "top_posts": posts[:5],
    }
