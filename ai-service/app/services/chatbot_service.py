import time
import uuid
from collections import OrderedDict

from app.services.claude_service import chat_completion
from app.services.translator_service import detect_language, translate, SUPPORTED_LANGUAGES
from app.prompts.system_prompts import CHATBOT_SYSTEM_PROMPT

MAX_MESSAGES_PER_CONVERSATION = 20
CONVERSATION_TTL_SECONDS = 30 * 60  # 30 minutes


class ConversationStore:
    """In-memory conversation store with TTL eviction."""

    def __init__(self):
        self._store: OrderedDict[str, dict] = OrderedDict()

    def _evict_expired(self):
        now = time.time()
        expired = [
            cid for cid, data in self._store.items()
            if now - data["last_active"] > CONVERSATION_TTL_SECONDS
        ]
        for cid in expired:
            del self._store[cid]

    def get_messages(self, conversation_id: str) -> list[dict]:
        self._evict_expired()
        entry = self._store.get(conversation_id)
        if entry is None:
            return []
        entry["last_active"] = time.time()
        return entry["messages"]

    def add_message(self, conversation_id: str, role: str, content: str):
        self._evict_expired()
        if conversation_id not in self._store:
            self._store[conversation_id] = {
                "messages": [],
                "last_active": time.time(),
            }
        entry = self._store[conversation_id]
        entry["messages"].append({"role": role, "content": content})
        entry["last_active"] = time.time()
        # Keep only last N messages
        if len(entry["messages"]) > MAX_MESSAGES_PER_CONVERSATION:
            entry["messages"] = entry["messages"][-MAX_MESSAGES_PER_CONVERSATION:]


conversation_store = ConversationStore()


async def handle_chat(
    message: str,
    conversation_id: str | None = None,
    language: str | None = None,
    hospital_id: str | None = None,
) -> dict:
    """Process a chat message with optional translation.

    Flow:
    1. Detect language (if not provided)
    2. Translate to English (if not English)
    3. Send to Claude with conversation history
    4. Translate response back (if original was not English)
    5. Return response + detected language
    """
    if not conversation_id:
        conversation_id = str(uuid.uuid4())

    # Step 1: Detect or use provided language
    detected_lang = language
    english_message = message

    if language and language != "en" and language in SUPPORTED_LANGUAGES:
        # User specified a non-English language — translate to English
        english_message, _ = await translate(message, target_language="en", source_language=language)
        detected_lang = language
    elif not language or language == "auto":
        # Auto-detect language
        try:
            detected_lang = await detect_language(message)
            if detected_lang != "en" and detected_lang in SUPPORTED_LANGUAGES:
                english_message, _ = await translate(message, target_language="en", source_language=detected_lang)
        except Exception:
            # If detection fails, assume English
            detected_lang = "en"

    # Step 2: Build conversation history and send to Claude
    conversation_store.add_message(conversation_id, "user", english_message)
    messages = conversation_store.get_messages(conversation_id)

    claude_response = chat_completion(
        system_prompt=CHATBOT_SYSTEM_PROMPT,
        messages=messages,
    )

    conversation_store.add_message(conversation_id, "assistant", claude_response)

    # Step 3: Translate response back if needed
    final_response = claude_response
    if detected_lang and detected_lang != "en" and detected_lang in SUPPORTED_LANGUAGES:
        try:
            final_response, _ = await translate(claude_response, target_language=detected_lang, source_language="en")
        except Exception:
            # If translation fails, return English response
            final_response = claude_response

    return {
        "reply": final_response,
        "detected_language": detected_lang,
        "conversation_id": conversation_id,
    }
