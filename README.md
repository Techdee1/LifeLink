# LifeLink

LifeLink is an emergency healthcare financing platform built for the Enyata x Interswitch Hackathon.

It helps hospitals quickly open a verified funding case for a patient, collect donations through virtual accounts, monitor progress in real time, and optionally unlock bridge funding when needed.

## Hackathon Context

This project was built as a submission for the Enyata x Interswitch Hackathon, focused on practical fintech solutions for real-world healthcare challenges in Africa.

## Team and Contributions

- Akeem Jr Odebiyi (@techdee1): AI service (chatbot, risk scoring, and case prediction)
- Henry Fakorode (@henrytech12): Frontend and backend implementation

## What LifeLink Solves

Hospitals often need immediate deposits before urgent care can proceed.
LifeLink addresses this by:

- creating trackable emergency funding cases
- generating virtual accounts for transparent fundraising
- exposing case progress and history for operational visibility
- supporting bridge-loan workflows with integrated checks
- adding AI-powered assistance, risk insights, and prediction endpoints

## High-Level Architecture

LifeLink is split into three primary services:

- Frontend: React + Vite dashboard and public case pages
- Backend: Spring Boot API for auth, cases, payments, and integration orchestration
- AI Service: FastAPI service for chat, risk scoring, and case outcome prediction

Supporting infrastructure:

- MySQL: transactional data store
- Redis: caching and performance support

## Repository Structure

```text
.
├── README.md                       # General project guide (this file)
├── BACKEND_README.md               # Spring Boot backend guide
├── docker-compose.yml              # Local multi-service orchestration
├── Dockerfile                      # Backend container build
├── src/                            # Backend source
├── project/                        # Frontend (React + Vite)
│   └── README.md
└── ai-service/                     # AI microservice (FastAPI)
    └── README.md
```

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind, React Query, Axios, Framer Motion
- Backend: Java 17, Spring Boot 4, Spring Security, Spring Data JPA, Redis, MySQL
- AI Service: Python 3.12, FastAPI, SQLAlchemy, Anthropic Claude, Azure Translator
- Infra: Docker, Docker Compose

## Quick Start (Recommended)

### 1. Start backend + AI + data services

From repository root:

```bash
docker compose up --build
```

This starts:

- backend API on port `8080`
- AI service on port `8000`
- MySQL on port `3306`
- Redis on port `6379`

### 2. Start frontend

In a separate shell:

```bash
cd project
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Service Documentation

- Frontend guide: [project/README.md](project/README.md)
- Backend guide: [BACKEND_README.md](BACKEND_README.md)
- AI service guide: [ai-service/README.md](ai-service/README.md)

## Core Backend API Base Path

All backend endpoints are under:

```text
/api/v1/lifelink
```

Swagger UI (backend):

```text
http://localhost:8080/swagger-ui.html
```

## Typical End-to-End Flow

1. Hospital onboards and logs in.
2. Hospital initiates a new patient emergency case.
3. System creates a virtual account for fundraising.
4. Donations are tracked via payment webhook updates.
5. Hospital monitors active and historical cases.
6. If eligible, hospital applies for bridge funding.
7. AI features support chat assistance and predictive decisions.

## Deployment Notes

- Configure environment variables for all Interswitch, Twilio, database, and AI credentials.
- Update CORS settings for production frontend domains.
- Ensure MySQL schema aligns with ID generation strategy.
- For containerized deployments, keep service-to-service URLs internal (for example `http://ai-service:8000`).

## License

Hackathon project. Add the intended license before production usage.
