# LifeLink Backend (Spring Boot)

Backend API for LifeLink emergency healthcare financing workflows.

## Ownership

- Henry Fakorode (@henrytech12): backend implementation

## Overview

The backend provides:

- hospital onboarding and authentication
- case creation and lifecycle endpoints
- active/history dashboard data
- payment webhook ingestion
- bridge funding orchestration
- AI endpoint proxying for chat/risk/prediction

Base URL:

```text
/api/v1/lifelink
```

## Tech Stack

- Java 17
- Spring Boot 4.0.3
- Spring Security (JWT filters)
- Spring Data JPA + Hibernate
- MySQL
- Redis
- Springdoc OpenAPI

## Project Entry Point

- Main class: `src/main/java/org/interswitch/app/LifeLink/Application.java`
- Config file: `src/main/resources/application.yaml`

## Prerequisites

- Java 17+
- Maven (or use `./mvnw`)
- MySQL
- Redis

## Environment Variables

Set these for backend runtime:

### Database / Cache

- `DB_USERNAME` (default: `root` via config fallback)
- `DB_PASSWORD`
- Optional if not using localhost in config:
  - `DB_HOST`
  - `DB_PORT`
  - `REDIS_HOST`
  - `REDIS_PORT`

### Interswitch

- `INTERSWITCH_PAYMENT_CLIENT_ID`
- `INTERSWITCH_PAYMENT_CLIENT_SECRET`
- `INTERSWITCH_PAYMENT_MERCHANT_CODE`
- `INTERSWITCH_PAYMENT_PAYID`
- `INTERSWITCH_VERIFICATION_ID`
- `INTERSWITCH_VERIFICATION_SECRET`
- `INTERSWITCH_GENERAL_CLIENT_ID`
- `INTERSWITCH_GENERAL_CLIENT_SECRET`
- `WEBHOOK_SECRET_KEY`

### App / Messaging

- `APP_BASE_URL` (optional)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP`

### AI Integration

- `AI_SERVICE_URL` (optional, defaults to `http://localhost:8000` inside AI service client)

## Run Locally

From repository root:

```bash
./mvnw spring-boot:run
```

Or build + run jar:

```bash
./mvnw clean package -DskipTests
java -jar target/*.jar
```

App default port: `8080`

## Run with Docker

Build and run backend image:

```bash
docker build -t lifelink-backend .
docker run --rm -p 8080:8080 lifelink-backend
```

For full stack, prefer `docker compose up --build` from root.

## API Surface

### Hospital

- `POST /hospitals/auth/onboard`
- `POST /hospitals/auth/login`
- `POST /hospitals/auth/refresh`
- `GET /hospitals/dashboard`
- `GET /hospitals/data/{hospitalEmail}`

### Cases

- `POST /cases/initiate`
- `GET /cases/{caseId}`
- `GET /cases/active`
- `GET /cases/history?pageNo={n}&pageSize={n}`
- `POST /cases/{caseId}/bridge`
- `POST /cases/webhook`
- `GET /cases/token`

### AI Proxy Endpoints

- `POST /ai/chat`
- `POST /ai/loans/{caseId}/risk-score`
- `POST /ai/cases/{caseId}/predict`

## Authentication Model

- Login endpoint issues access and refresh tokens.
- Access token is expected in `Authorization: Bearer <token>`.
- JWT filter authenticates protected endpoints.
- Public and auth routes are bypassed by filter rules.

## Swagger and API Docs

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Testing and Verification

Compile:

```bash
./mvnw -DskipTests compile
```

Run tests:

```bash
./mvnw test
```

## Operational Notes

- Confirm MySQL primary keys align with auto-increment ID strategy.
- Keep webhook signature validation secret in sync with provider settings.
- Production CORS should include deployed frontend domain(s), not only localhost.

## Troubleshooting

### Startup fails at datasource

- Verify MySQL is running and credentials are correct.
- Confirm DB schema `lifelink` exists.

### Redis errors

- Ensure Redis host/port is reachable.
- Service should degrade gracefully for some cache operations, but connectivity is still recommended.

### 401/403 on expected public routes

- Review security matcher configuration and JWT filter skip logic.

### Bridge or AI flow errors

- Confirm Interswitch credentials and AI service URL.
- Check service logs for upstream request failures.
