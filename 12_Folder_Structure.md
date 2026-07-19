# Folder Structure

**Project:** AI Document Assistant

**Version:** 1.0

**Document Type:** Project Folder Structure Specification

---

# Table of Contents

1. Introduction
2. Repository Structure
3. Frontend Structure
4. Backend Structure
5. AI Module Structure
6. Database Structure
7. Infrastructure Structure
8. Documentation Structure
9. Testing Structure
10. Naming Conventions
11. Import Guidelines
12. Best Practices

---

# 1. Introduction

The repository follows a **feature-oriented architecture** with clear separation between frontend, backend, AI services, infrastructure, and documentation.

Goals:

- Easy navigation
- High modularity
- Scalable organization
- Clear ownership
- Simplified onboarding

---

# 2. Repository Structure

```text
ai-document-assistant/

├── frontend/
├── backend/
├── infrastructure/
├── docs/
├── scripts/
├── tests/
├── .github/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

# 3. Frontend Structure

```text
frontend/

├── public/
│
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── common/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── workspace/
│   │   ├── documents/
│   │   ├── chat/
│   │   ├── search/
│   │   ├── settings/
│   │   └── notifications/
│   │
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   ├── styles/
│   └── main.tsx
│
├── tests/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Frontend Module Responsibilities

| Folder | Purpose |
|---------|---------|
| app | App initialization |
| assets | Images, fonts, icons |
| components | Shared UI |
| features | Feature modules |
| hooks | Custom React hooks |
| services | API clients |
| store | Zustand stores |
| utils | Helper functions |
| types | TypeScript interfaces |
| styles | Global styles |

---

# 4. Backend Structure

```text
backend/

├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── workspaces/
│   │   ├── documents/
│   │   ├── chat/
│   │   ├── search/
│   │   ├── settings/
│   │   ├── notifications/
│   │   └── admin/
│   │
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── ai/
│   ├── workers/
│   ├── middleware/
│   ├── storage/
│   ├── database/
│   ├── utils/
│   └── main.py
│
├── tests/
├── alembic/
├── requirements.txt
└── Dockerfile
```

---

## Backend Module Responsibilities

| Folder | Purpose |
|---------|---------|
| api | REST endpoints |
| core | Configuration & security |
| models | SQLAlchemy models |
| schemas | Pydantic schemas |
| services | Business logic |
| repositories | Data access |
| ai | AI orchestration |
| workers | Background jobs |
| middleware | FastAPI middleware |
| storage | File management |
| database | DB session & migrations |

---

# 5. AI Module Structure

```text
backend/app/ai/

├── loaders/
├── parsers/
├── preprocess/
├── chunking/
├── embeddings/
├── vectorstore/
├── retrieval/
├── prompts/
├── llm/
├── citations/
├── evaluation/
└── pipeline.py
```

---

## AI Responsibilities

### loaders/

- Load supported file formats

---

### parsers/

- PDF
- DOCX
- PPTX
- TXT
- XLSX

---

### preprocess/

- Clean text
- Normalize whitespace
- Unicode normalization

---

### chunking/

- Recursive splitter
- Metadata generation

---

### embeddings/

- Hugging Face integration
- Batch embedding generation

---

### vectorstore/

- ChromaDB client
- Collection management

---

### retrieval/

- Similarity search
- Metadata filtering
- Ranking

---

### prompts/

- System prompts
- Prompt templates
- Prompt versioning

---

### llm/

- Ollama client
- Model configuration
- Response handling

---

### citations/

- Source attribution
- Page references

---

### evaluation/

- Retrieval metrics
- Prompt evaluation
- Quality reports

---

# 6. Database Structure

```text
backend/app/database/

├── session.py
├── base.py
├── migrations/
├── seed/
├── repositories/
└── init_db.py
```

---

## Alembic Structure

```text
alembic/

├── versions/
├── env.py
├── script.py.mako
└── README
```

---

# 7. Infrastructure Structure

```text
infrastructure/

├── docker/
│   ├── frontend/
│   ├── backend/
│   ├── nginx/
│   └── ollama/
│
├── kubernetes/
│   ├── frontend/
│   ├── backend/
│   ├── postgres/
│   ├── chromadb/
│   └── ingress/
│
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   └── loki/
│
└── scripts/
```

---

# 8. Documentation Structure

```text
docs/

├── README.md
├── architecture/
├── api/
├── database/
├── deployment/
├── frontend/
├── backend/
├── ai/
├── diagrams/
└── images/
```

---

# 9. Testing Structure

```text
tests/

├── frontend/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── backend/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── ai/
│   ├── retrieval/
│   ├── prompts/
│   └── evaluation/
│
└── fixtures/
```

---

## Test Categories

| Category | Purpose |
|----------|---------|
| Unit | Individual functions |
| Integration | Module interactions |
| API | REST endpoints |
| E2E | Full user flows |
| AI | Retrieval & generation quality |

---

# 10. Naming Conventions

## Files

```text
snake_case.py
```

Example:

```text
document_service.py
```

---

## React Components

```text
PascalCase.tsx
```

Example:

```text
DocumentCard.tsx
```

---

## Hooks

```text
useAuth.ts
useChat.ts
```

---

## Constants

```text
UPPER_SNAKE_CASE
```

Example:

```text
MAX_UPLOAD_SIZE
```

---

## Database Tables

```text
snake_case
```

Example:

```text
chat_messages
```

---

# 11. Import Guidelines

Frontend import order:

1. React
2. Third-party libraries
3. Internal modules
4. Relative imports

Example:

```typescript
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";

import "./styles.css";
```

---

Backend import order:

1. Python standard library
2. Third-party packages
3. Local application imports

Example:

```python
import os

from fastapi import APIRouter

from app.services.document_service import DocumentService
```

---

# 12. Best Practices

Repository Guidelines:

- Feature-first organization
- Small focused modules
- Avoid circular dependencies
- One responsibility per file
- Shared utilities in common folders
- Version-controlled migrations
- Keep configuration outside source code

Development Guidelines:

- Consistent naming
- Type safety
- Documentation for public modules
- Unit tests for business logic
- Separate infrastructure from application logic

---

# Repository Summary

| Area | Location |
|------|----------|
| Frontend | `/frontend` |
| Backend | `/backend` |
| AI | `/backend/app/ai` |
| Database | `/backend/app/database` |
| Infrastructure | `/infrastructure` |
| Documentation | `/docs` |
| Tests | `/tests` |

---

# Project Organization Checklist

- Feature-based frontend
- Layered backend
- Modular AI pipeline
- Dedicated infrastructure
- Versioned migrations
- Centralized documentation
- Separate test suites
- Consistent naming
- Clean import hierarchy
- Environment-based configuration

---

# Conclusion

The proposed folder structure provides a scalable foundation for the AI Document Assistant. By separating concerns across frontend, backend, AI, infrastructure, documentation, and testing, the project remains organized, maintainable, and ready for collaboration by multiple developers and future growth.

---

# End of Folder Structure Document

**Version:** 1.0

**Status:** Approved for Development