# LifeLink AI Service (FastAPI)

AI microservice for conversational support, bridge-loan risk scoring, and case success prediction.

## Ownership

- Akeem Jr Odebiyi (@techdee1): AI service implementation

## Overview

The AI service provides three core capabilities:

- Chat assistant for hospital operations and platform guidance
- Risk scoring for bridge-loan decisions
- Predictive insights for case funding outcomes

It integrates with:

- Anthropic Claude for reasoning and explanation generation
- Azure Translator for multilingual chat support
- MySQL (read-only analytics context for risk/prediction features)

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy
- Anthropic SDK
- Azure Translator (via HTTPX)
- Uvicorn

## Directory Layout

```text
ai-service/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── routers/
│   ├── services/
│   ├── models/
│   └── prompts/
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Environment Variables

Define these in `.env` (copy from `.env.example`):

- `DATABASE_URL` (SQLAlchemy URL)
- `ANTHROPIC_API_KEY`
- `AZURE_TRANSLATOR_KEY`
- `AZURE_TRANSLATOR_REGION` (default: `eastus`)
- `FASTAPI_ENV` (default: `development`)
- `LOG_LEVEL` (default: `INFO`)

Example:

```bash
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/lifelink
ANTHROPIC_API_KEY=...
AZURE_TRANSLATOR_KEY=...
AZURE_TRANSLATOR_REGION=eastus
FASTAPI_ENV=development
LOG_LEVEL=INFO
```

## Install and Run Locally

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Service URL: `http://localhost:8000`

## Docker Run

From `ai-service/`:

```bash
docker build -t lifelink-ai-service .
docker run --rm -p 8000:8000 lifelink-ai-service
```

## API Endpoints

Base path:

```text
/api/v1/ai
```

### Health

- `GET /health`

### Chatbot

- `POST /chat`

Request fields:

- `message` (required)
- `conversation_id` (optional)
- `language` (optional, `auto` supported)
- `hospital_id` (optional)

### Risk Scoring

- `POST /loans/{case_id}/risk-score`

Optional request field:

- `loan_amount`

Returns a structured response including:

- `risk_score`
- `risk_level`
- `recommendation`
- `factors`
- `explanation`

### Case Prediction

- `POST /cases/{case_id}/predict`

Returns prediction output including:

- `success_probability`
- `estimated_days_to_target`
- `confidence_level`
- `factors`
- `explanation`

## Core Service Behavior

### Chatbot Flow

1. Detects or accepts language.
2. Translates non-English text to English (when needed).
3. Sends context to Claude with conversation history.
4. Translates response back to original language (when needed).
5. Returns response with conversation ID.

Notes:

- In-memory conversation store
- TTL-based eviction (30 minutes)
- max message window per conversation (20 messages)

### Risk and Prediction Flow

1. Reads case + virtual account + payment + loan data from DB.
2. Computes financial and behavioral metrics.
3. Sends normalized context to Claude with a structured system prompt.
4. Parses AI output JSON and returns typed API response.

## CORS

Default allowlist includes:

- `http://localhost:5173`
- `http://localhost:8080`

Update this list for deployed frontend/backends.

## Error Handling

- Missing API keys returns controlled HTTP errors.
- If AI output is not valid JSON, parser attempts extraction before failing.
- DB lookups return 404 for missing case/account context.

## Integration with Backend

Backend calls this service through `AI_SERVICE_URL`.

Typical internal URL in Docker Compose:

```text
http://ai-service:8000
```

## Troubleshooting

### 503 from Claude calls

- verify `ANTHROPIC_API_KEY`
- check network egress from runtime environment

### Translation failures

- verify Azure translator key/region
- validate endpoint access to Azure Cognitive Translator

### DB query failures

- verify `DATABASE_URL`
- ensure schema/tables exist and match expected field names
