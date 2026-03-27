import anthropic
from fastapi import HTTPException

from app.config import settings

_client = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        if not settings.ANTHROPIC_API_KEY:
            raise HTTPException(status_code=503, detail="ANTHROPIC_API_KEY not configured")
        _client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


def chat_completion(
    system_prompt: str,
    messages: list[dict],
    max_tokens: int = 1024,
    model: str = "claude-sonnet-4-20250514",
) -> str:
    client = _get_client()
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=messages,
    )
    return response.content[0].text
