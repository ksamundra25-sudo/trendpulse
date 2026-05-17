from pytrends.request import TrendReq

def get_trending_searches(country: str = "GB") -> list[dict]:
    """Get today's trending searches from Google Trends."""
    pytrends = TrendReq(hl="en-GB", tz=0)
    df = pytrends.trending_searches(pn="united_kingdom")
    return [{"keyword": row[0], "rank": i + 1} for i, row in df.iterrows()]

def get_interest_over_time(keywords: list[str], timeframe: str = "now 7-d") -> dict:
    """Get interest over time for keywords."""
    pytrends = TrendReq(hl="en-GB", tz=0)
    pytrends.build_payload(keywords[:5], timeframe=timeframe)
    df = pytrends.interest_over_time()
    if df.empty:
        return {}
    return df.drop(columns=["isPartial"], errors="ignore").to_dict(orient="list")
