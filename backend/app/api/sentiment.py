from fastapi import APIRouter
from pydantic import BaseModel
from app.services.sentiment_service import analyze_sentiment

router = APIRouter()

class TextsRequest(BaseModel):
    texts: list[str]

@router.post("/analyze")
async def analyze(request: TextsRequest):
    results = analyze_sentiment(request.texts)
    return {"results": results}
