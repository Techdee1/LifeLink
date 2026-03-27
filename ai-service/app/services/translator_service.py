import httpx

from app.config import settings

TRANSLATOR_ENDPOINT = "https://api.cognitive.microsofttranslator.com"

SUPPORTED_LANGUAGES = {
    "en": "English",
    "yo": "Yoruba",
    "ig": "Igbo",
    "ha": "Hausa",
    "pcm": "Nigerian Pidgin",
    "sw": "Swahili",
    "fr": "French",
}


def _headers() -> dict:
    return {
        "Ocp-Apim-Subscription-Key": settings.AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": settings.AZURE_TRANSLATOR_REGION,
        "Content-Type": "application/json",
    }


async def detect_language(text: str) -> str:
    """Detect the language of the given text. Returns ISO language code."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{TRANSLATOR_ENDPOINT}/detect",
            params={"api-version": "3.0"},
            headers=_headers(),
            json=[{"text": text}],
        )
        response.raise_for_status()
        return response.json()[0]["language"]


async def translate(
    text: str,
    target_language: str,
    source_language: str | None = None,
) -> tuple[str, str | None]:
    """Translate text to the target language.

    Returns (translated_text, detected_source_language).
    """
    params = {"api-version": "3.0", "to": target_language}
    if source_language:
        params["from"] = source_language

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{TRANSLATOR_ENDPOINT}/translate",
            params=params,
            headers=_headers(),
            json=[{"text": text}],
        )
        response.raise_for_status()
        result = response.json()[0]
        detected = result.get("detectedLanguage", {}).get("language")
        translated = result["translations"][0]["text"]
        return translated, detected
