from googleapiclient.discovery import build
from app.core.config import settings

def get_youtube_client():
    return build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

def fetch_trending_videos(region_code: str = "GB", max_results: int = 25):
    """Fetch trending videos from YouTube."""
    youtube = get_youtube_client()
    request = youtube.videos().list(
        part="snippet,statistics",
        chart="mostPopular",
        regionCode=region_code,
        maxResults=max_results,
    )
    response = request.execute()
    videos = []
    for item in response.get("items", []):
        videos.append({
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "views": int(item["statistics"].get("viewCount", 0)),
            "likes": int(item["statistics"].get("likeCount", 0)),
            "tags": item["snippet"].get("tags", []),
        })
    return videos
