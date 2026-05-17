from transformers import pipeline

_sentiment_pipeline = None

def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
    return _sentiment_pipeline

def analyze_sentiment(texts: list[str]) -> list[dict]:
    """Analyze sentiment for a list of texts."""
    pipe = get_sentiment_pipeline()
    results = pipe(texts, truncation=True, max_length=512)
    normalized = []
    for r in results:
        score = r["score"] if r["label"] == "POSITIVE" else -r["score"]
        normalized.append({
            "label": r["label"].lower(),
            "score": round(score, 4),
            "confidence": round(r["score"], 4),
        })
    return normalized

def calculate_trend_score(volume: int, sentiment: float, velocity: float) -> float:
    """
    TrendPulse Score (0-100):
      - Volume component  (0-50): log-scaled post/upvote count
      - Sentiment bonus   (0-20): positive sentiment lifts score
      - Velocity component(0-30): how fast the topic is gaining posts
    """
    import math
    volume_score    = min(math.log(volume + 1) / math.log(100_000) * 50, 50)
    sentiment_bonus = (sentiment + 1) / 2 * 20
    velocity_score  = min(velocity / 100 * 30, 30)
    return round(volume_score + sentiment_bonus + velocity_score, 2)
