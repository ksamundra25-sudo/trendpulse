import praw
from app.core.config import settings

def get_reddit_client():
    return praw.Reddit(
        client_id=settings.REDDIT_CLIENT_ID,
        client_secret=settings.REDDIT_CLIENT_SECRET,
        user_agent=settings.REDDIT_USER_AGENT,
    )

def fetch_trending_topics(subreddit: str = "all", limit: int = 25):
    """Fetch hot posts from a subreddit."""
    reddit = get_reddit_client()
    trends = []
    for post in reddit.subreddit(subreddit).hot(limit=limit):
        trends.append({
            "title": post.title,
            "score": post.score,
            "num_comments": post.num_comments,
            "url": post.url,
            "subreddit": str(post.subreddit),
            "created_utc": post.created_utc,
        })
    return trends

def search_keyword(keyword: str, limit: int = 50):
    """Search Reddit for a specific keyword."""
    reddit = get_reddit_client()
    results = []
    for post in reddit.subreddit("all").search(keyword, limit=limit, sort="hot"):
        results.append({
            "title": post.title,
            "text": post.selftext[:500],
            "score": post.score,
            "created_utc": post.created_utc,
        })
    return results
