# API Design

**Project:** AI Document Assistant

**Version:** 1.0

**Document Type:** REST API Design Specification

---

# Table of Contents

1. Introduction
2. API Architecture
3. API Standards
4. Authentication
5. API Versioning
6. Common Request & Response Format
7. Authentication APIs
8. User APIs
9. Workspace APIs
10. Document APIs
11. Chat APIs
12. Search APIs
13. Settings APIs
14. Notification APIs
15. Admin APIs
16. Error Handling
17. Pagination & Filtering
18. Security
19. Rate Limiting
20. Future Enhancements

---

# 1. Introduction

The AI Document Assistant exposes a RESTful API built with **FastAPI**. All endpoints communicate using **JSON** (except file uploads) and are secured using **JWT-based authentication**.

Goals:

- Consistent endpoint design
- Predictable request/response formats
- Secure authentication
- Easy integration
- API-first development

---

# 2. API Architecture

```mermaid
flowchart LR

Frontend --> REST API

REST API --> Service Layer

Service Layer --> Repository Layer

Repository Layer --> PostgreSQL

Service Layer --> AI Services

AI Services --> ChromaDB

AI Services --> Ollama
```

---

# 3. API Standards

### Base URL

```text
/api/v1
```

### Content Types

Requests:

```text
application/json
```

File Uploads:

```text
multipart/form-data
```

Responses:

```text
application/json
```

### HTTP Methods

| Method | Purpose |
|--------|---------|
| GET | Retrieve resources |
| POST | Create resources |
| PUT | Replace resources |
| PATCH | Partial updates |
| DELETE | Remove resources |

---

# 4. Authentication

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

JWT contains:

- User ID
- Email
- Role
- Expiration

Refresh tokens are stored securely (recommended: HTTP-only cookies).

---

# 5. API Versioning

Current version:

```text
v1
```

Example:

```text
GET /api/v1/documents
```

Future versions:

```text
/api/v2
```

Versioning strategy:

- Backward-compatible changes remain in the same version.
- Breaking changes require a new major version.

---

# 6. Common Request & Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data."
  }
}
```

---

# 7. Authentication APIs

## Register

**POST**

```text
/api/v1/auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully."
}
```

---

## Login

**POST**

```text
/api/v1/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

Response:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer"
}
```

---

## Refresh Token

**POST**

```text
/api/v1/auth/refresh
```

---

## Logout

**POST**

```text
/api/v1/auth/logout
```

---

# 8. User APIs

## Get Current User

**GET**

```text
/api/v1/users/me
```

---

## Update Profile

**PATCH**

```text
/api/v1/users/me
```

---

## Change Password

**POST**

```text
/api/v1/users/change-password
```

---

## Delete Account

**DELETE**

```text
/api/v1/users/me
```

---

# 9. Workspace APIs

## List Workspaces

**GET**

```text
/api/v1/workspaces
```

---

## Create Workspace

**POST**

```text
/api/v1/workspaces
```

Request:

```json
{
  "name": "HR Documents",
  "description": "Policies and procedures"
}
```

---

## Get Workspace

**GET**

```text
/api/v1/workspaces/{workspace_id}
```

---

## Update Workspace

**PATCH**

```text
/api/v1/workspaces/{workspace_id}
```

---

## Delete Workspace

**DELETE**

```text
/api/v1/workspaces/{workspace_id}
```

---

# 10. Document APIs

## Upload Document

**POST**

```text
/api/v1/documents/upload
```

Content Type:

```text
multipart/form-data
```

Parameters:

- workspace_id
- file

---

## List Documents

**GET**

```text
/api/v1/documents
```

Query Parameters:

- workspace_id
- page
- page_size
- search

---

## Get Document

**GET**

```text
/api/v1/documents/{document_id}
```

---

## Download Document

**GET**

```text
/api/v1/documents/{document_id}/download
```

---

## Delete Document

**DELETE**

```text
/api/v1/documents/{document_id}
```

---

## Reprocess Document

**POST**

```text
/api/v1/documents/{document_id}/reprocess
```

---

# 11. Chat APIs

## Ask Question

**POST**

```text
/api/v1/chat
```

Request:

```json
{
  "workspace_id": "uuid",
  "question": "What is the leave policy?"
}
```

Response:

```json
{
  "answer": "Employees receive 20 days of annual leave.",
  "citations": [
    {
      "document": "Employee_Handbook.pdf",
      "page": 12
    }
  ]
}
```

---

## List Chat Sessions

**GET**

```text
/api/v1/chat/sessions
```

---

## Get Chat Messages

**GET**

```text
/api/v1/chat/sessions/{session_id}
```

---

## Delete Chat Session

**DELETE**

```text
/api/v1/chat/sessions/{session_id}
```

---

# 12. Search APIs

## Semantic Search

**POST**

```text
/api/v1/search
```

Request:

```json
{
  "workspace_id": "uuid",
  "query": "Annual leave"
}
```

Response:

```json
{
  "results": [
    {
      "document": "Employee_Handbook.pdf",
      "page": 12,
      "score": 0.94
    }
  ]
}
```

---

# 13. Settings APIs

## Get Settings

**GET**

```text
/api/v1/settings
```

---

## Update Settings

**PATCH**

```text
/api/v1/settings
```

Example fields:

- theme
- language
- notifications_enabled

---

# 14. Notification APIs

## List Notifications

**GET**

```text
/api/v1/notifications
```

---

## Mark Notification Read

**PATCH**

```text
/api/v1/notifications/{notification_id}
```

---

# 15. Admin APIs

Restricted to administrators.

## List Users

**GET**

```text
/api/v1/admin/users
```

---

## Get Audit Logs

**GET**

```text
/api/v1/admin/audit-logs
```

---

## System Health

**GET**

```text
/api/v1/admin/health
```

Returns:

- API status
- Database status
- ChromaDB status
- LLM status

---

# 16. Error Handling

Common Status Codes:

| Code | Meaning |
|------|---------|
|200|Success|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|429|Too Many Requests|
|500|Internal Server Error|

---

# 17. Pagination & Filtering

Pagination parameters:

```text
?page=1&page_size=20
```

Example Response:

```json
{
  "page": 1,
  "page_size": 20,
  "total": 85,
  "items": []
}
```

Filtering examples:

```text
?workspace_id=...
?file_type=pdf
?status=processed
?sort=created_at
?order=desc
```

---

# 18. Security

Measures:

- JWT authentication
- HTTPS
- Input validation
- File validation
- Rate limiting
- RBAC
- Secure headers
- Audit logging

---

# 19. Rate Limiting

Suggested limits:

| Endpoint | Limit |
|----------|------:|
| Login | 5 requests/minute |
| Chat | 30 requests/minute |
| Search | 60 requests/minute |
| Upload | 10 requests/hour |
| General API | 100 requests/minute |

Responses should include standard rate limit headers when enabled.

---

# 20. Future Enhancements

- WebSocket support for streaming AI responses
- Server-Sent Events (SSE)
- GraphQL gateway
- Bulk document operations
- Batch chat requests
- API keys for service integrations
- Webhooks for document processing events
- OpenAPI client generation
- OAuth2 / OpenID Connect support

---

# API Endpoint Summary

| Module | Endpoints |
|---------|----------:|
| Authentication | 4 |
| Users | 4 |
| Workspaces | 5 |
| Documents | 6 |
| Chat | 4 |
| Search | 1 |
| Settings | 2 |
| Notifications | 2 |
| Admin | 3 |
| **Total** | **31** |

---

# API Design Principles Checklist

- RESTful naming
- Resource-oriented URLs
- Consistent JSON responses
- JWT authentication
- Versioned endpoints
- Proper HTTP status codes
- Pagination support
- Filtering & sorting
- Input validation
- Comprehensive error model
- OpenAPI documentation
- Secure defaults

---

# Conclusion

The API design provides a consistent, secure, and extensible interface between the frontend, backend, and AI services. Versioned endpoints, standardized responses, robust authentication, and clear resource modeling make the API suitable for both internal development and future third-party integrations.

---

# End of API Design Document

**Version:** 1.0

**Status:** Approved for Development