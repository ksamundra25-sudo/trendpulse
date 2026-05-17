from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Trend(Base):
    __tablename__ = "trends"

    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String, index=True)
    platform = Column(String)          # reddit, youtube, google
    volume = Column(Integer, default=0)
    sentiment_score = Column(Float, default=0.0)   # -1 to 1
    sentiment_label = Column(String)               # positive / negative / neutral
    trend_score = Column(Float, default=0.0)       # TrendPulse custom score
    velocity = Column(Float, default=0.0)          # rate of growth
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
