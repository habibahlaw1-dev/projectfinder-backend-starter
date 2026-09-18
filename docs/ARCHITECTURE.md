# Backend Initial Architecture

## Context

ProjectFinder.com is an admin-managed project library. The MVP supports discovery, filtering, project details, project start and deliverable submission. Admins manage the project library.

## Logical architecture

```text
Frontend
   |
 HTTPS / REST
   |
Express API
   |
+-- Authentication / Authorization
+-- Validation
+-- Error handling
   |
Controllers
   |
Business logic
   |
Prisma ORM
   |
PostgreSQL
   |
File storage
```

## Core entities

```text
User
Industry
Project
Task
Deliverable
ProjectSelection
Submission
```

## Roles

USER:
- discover/filter projects
- view details
- start project
- submit deliverables

ADMIN:
- create/edit/publish/unpublish projects
- add tasks
- add deliverables

## MVP boundary

Do not add AI generation/grading, leaderboards, gamification, social networking, payments, mobile application, advanced recommendations or advanced analytics without explicit scope approval.

## Integration contract

The frontend should consume `/api/v1/...` endpoints and send/receive JSON unless the endpoint is a file upload.

The frontend should not access PostgreSQL directly.

## Open decisions

- Final deployment provider
- Final object storage provider
- Final token/session strategy after security review
- Whether admin users are provisioned manually or through a controlled admin workflow
- Final API pagination/search requirements
