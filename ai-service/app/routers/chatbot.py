from fastapi import APIRouter

from app.models.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import handle_chat

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    result = await handle_chat(
        message=request.message,
        conversation_id=request.conversation_id,
        language=request.language,
        hospital_id=request.hospital_id,
    )
    return ChatResponse(**result)
