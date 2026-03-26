from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/lifelink"
    ANTHROPIC_API_KEY: str = ""
    AZURE_TRANSLATOR_KEY: str = ""
    AZURE_TRANSLATOR_REGION: str = "eastus"
    FASTAPI_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = "../.env", ".env"
        case_sensitive = True


settings = Settings()
