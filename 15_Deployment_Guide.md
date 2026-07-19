# Deployment Guide

**Project:** AI Document Assistant

**Version:** 1.0

**Document Type:** Deployment Guide

---

# Table of Contents

1. Introduction
2. Deployment Architecture
3. System Requirements
4. Development Environment
5. Environment Variables
6. Docker Deployment
7. Docker Compose
8. Database Setup
9. ChromaDB Setup
10. Ollama Setup
11. Frontend Deployment
12. Backend Deployment
13. NGINX Configuration
14. SSL/TLS Configuration
15. CI/CD Pipeline
16. Kubernetes Deployment
17. Monitoring
18. Backup & Disaster Recovery
19. Scaling Strategy
20. Production Checklist

---

# 1. Introduction

This document explains how to deploy the AI Document Assistant in both development and production environments.

Supported deployment targets:

- Local Development
- Docker
- Docker Compose
- Linux Server
- Cloud VM
- Kubernetes Cluster

---

# 2. Deployment Architecture

```mermaid
flowchart TD

Internet

↓

NGINX

↓

React Frontend

↓

FastAPI Backend

↓

PostgreSQL

↓

ChromaDB

↓

Ollama

↓

Local AI Models
```

---

# 3. System Requirements

## Development

| Component | Minimum |
|------------|---------|
| CPU | 4 Cores |
| RAM | 8 GB |
| Storage | 20 GB SSD |

---

## Production

| Component | Recommended |
|------------|-------------|
| CPU | 8–16 Cores |
| RAM | 32 GB |
| Storage | 250 GB SSD |
| GPU | Optional (NVIDIA CUDA) |

---

## Software

- Python 3.12+
- Node.js 22+
- Docker
- Docker Compose
- Git
- PostgreSQL 16+
- Ollama

---

# 4. Development Environment

Clone repository:

```bash
git clone https://github.com/your-org/ai-document-assistant.git

cd ai-document-assistant
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 5. Environment Variables

Backend:

```env
APP_ENV=development

SECRET_KEY=change_me

DATABASE_URL=postgresql://postgres:password@postgres:5432/ai_assistant

CHROMA_HOST=chromadb

CHROMA_PORT=8000

OLLAMA_HOST=http://ollama:11434

JWT_EXPIRE_MINUTES=15

REFRESH_TOKEN_DAYS=7

UPLOAD_DIRECTORY=/app/storage

MAX_UPLOAD_SIZE=104857600
```

Frontend:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

# 6. Docker Deployment

## Backend Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]
```

---

## Frontend Dockerfile

```dockerfile
FROM node:22

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm","run","preview"]
```

---

# 7. Docker Compose

```yaml
version: "3.9"

services:

  frontend:

    build: ./frontend

    ports:
      - "3000:3000"

  backend:

    build: ./backend

    ports:
      - "8000:8000"

  postgres:

    image: postgres:16

  chromadb:

    image: chromadb/chroma

  ollama:

    image: ollama/ollama
```

Start services:

```bash
docker compose up -d
```

---

# 8. Database Setup

Create database:

```sql
CREATE DATABASE ai_assistant;
```

Run migrations:

```bash
alembic upgrade head
```

Seed data (optional):

```bash
python seed.py
```

---

# 9. ChromaDB Setup

Run container:

```bash
docker run \
-p 8001:8000 \
chromadb/chroma
```

Collections:

```
workspace_vectors
```

Verify:

```bash
curl http://localhost:8001/api/v1/heartbeat
```

---

# 10. Ollama Setup

Install:

```bash
curl https://ollama.ai/install.sh | sh
```

Pull model:

```bash
ollama pull qwen2.5:7b
```

Run:

```bash
ollama serve
```

Verify:

```bash
ollama list
```

---

# 11. Frontend Deployment

Production Build:

```bash
npm run build
```

Output:

```
dist/
```

Serve using:

- NGINX
- Apache
- Cloud Storage + CDN

---

# 12. Backend Deployment

Production server:

```bash
gunicorn \
-k uvicorn.workers.UvicornWorker \
app.main:app
```

Workers:

```
CPU × 2 + 1
```

Example:

```
17 workers on 8-core server
```

---

# 13. NGINX Configuration

```nginx
server {

    listen 443 ssl;

    server_name example.com;

    location / {

        root /usr/share/nginx/html;

        try_files $uri /index.html;

    }

    location /api/ {

        proxy_pass http://backend:8000;

    }

}
```

---

# 14. SSL/TLS Configuration

Recommended:

- Let's Encrypt
- TLS 1.3
- Automatic renewal

Enable:

```bash
certbot --nginx
```

Headers:

```
Strict-Transport-Security

X-Frame-Options

Content-Security-Policy

X-Content-Type-Options
```

---

# 15. CI/CD Pipeline

GitHub Actions Workflow

```mermaid
flowchart LR

Push

↓

Tests

↓

Build Docker Images

↓

Security Scan

↓

Deploy

↓

Smoke Tests
```

Pipeline Steps:

1. Checkout

2. Install dependencies

3. Run tests

4. Lint

5. Build

6. Docker build

7. Push images

8. Deploy

9. Verify

---

# 16. Kubernetes Deployment

Components:

```text
Namespace

↓

Ingress

↓

Frontend Deployment

↓

Backend Deployment

↓

PostgreSQL StatefulSet

↓

ChromaDB StatefulSet

↓

Ollama Deployment
```

Pods:

- frontend

- backend

- postgres

- chromadb

- ollama

Services:

- ClusterIP

Ingress:

- NGINX Ingress Controller

Persistent Volumes:

- PostgreSQL

- ChromaDB

- Uploaded Files

---

# 17. Monitoring

Recommended Stack:

- Prometheus

- Grafana

- Loki

- OpenTelemetry

Metrics:

- CPU

- Memory

- Requests

- Latency

- AI response time

- Queue length

- Failed uploads

Dashboards:

- API

- Database

- AI

- Infrastructure

Alerts:

- High latency

- Low disk

- Failed jobs

- High memory

---

# 18. Backup & Disaster Recovery

Backup Targets:

- PostgreSQL

- ChromaDB

- Uploaded Files

Schedule:

Daily:

```
Database Backup
```

Weekly:

```
Full Storage Snapshot
```

Monthly:

```
Archive Backup
```

Recovery Steps:

1. Restore database

2. Restore ChromaDB

3. Restore files

4. Rebuild indexes if necessary

5. Verify integrity

---

# 19. Scaling Strategy

Horizontal Scaling

Backend:

```
Multiple FastAPI Pods
```

Frontend:

```
Multiple React Pods
```

Vertical Scaling

Increase:

- CPU

- RAM

- GPU

Scaling Considerations:

- Stateless backend

- External PostgreSQL

- Shared ChromaDB

- Load balancer

---

# 20. Production Checklist

Infrastructure

- Dockerized services

- HTTPS enabled

- Firewall configured

- DNS configured

Application

- Environment variables secured

- Strong JWT secret

- Logging enabled

- Monitoring enabled

Database

- Automatic backups

- Indexes created

- Migrations applied

Security

- HTTPS

- Secure cookies

- Rate limiting

- RBAC enabled

- Input validation

AI

- Ollama models downloaded

- Embeddings initialized

- Chroma collections created

Operations

- Health checks

- Metrics dashboard

- Alerting

- Disaster recovery tested

---

# Deployment Summary

| Layer | Technology |
|---------|------------|
| Frontend | React + Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| Vector DB | ChromaDB |
| AI Runtime | Ollama |
| Reverse Proxy | NGINX |
| Containerization | Docker |
| Orchestration | Kubernetes |
| Monitoring | Prometheus + Grafana |
| Logging | Loki |
| CI/CD | GitHub Actions |

---

# Best Practices

- Infrastructure as Code
- Immutable Docker Images
- Environment-based Configuration
- Automated Testing
- Zero-Downtime Deployment
- Rolling Updates
- Secret Management
- Automated Backups
- Continuous Monitoring
- Disaster Recovery Drills

---

# Conclusion

The deployment architecture provides a secure, scalable, and production-ready foundation for the AI Document Assistant. By combining Docker, Kubernetes, FastAPI, PostgreSQL, ChromaDB, Ollama, NGINX, and modern DevOps practices, the system can be reliably deployed across local, staging, and production environments while maintaining high availability, security, and operational visibility.

---

# End of Deployment Guide

**Version:** 1.0

**Status:** Approved for Production