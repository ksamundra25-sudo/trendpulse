from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "TrendPulse/1.0"
    YOUTUBE_API_KEY: str = ""
    DATABASE_URL: str = "postgresql://user:password@localhost/trendpulse"
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"

settings = Settings()
