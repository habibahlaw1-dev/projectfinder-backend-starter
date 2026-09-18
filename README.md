# ProjectFinder Backend

Starter backend for **PNA 1 – ProjectFinder.com**, aligned with the Week 1 Backend Technical Setup / Initial Architecture deliverable.

## MVP backend responsibilities

- Project discovery
- Industry and difficulty filtering
- Project details
- Project selection/start
- Tasks and required deliverables
- Deliverable submission
- Admin project management
- Authentication and role-based authorization

The PNA 1 scope keeps AI generation/grading, leaderboards, gamification, social features, payments, mobile apps and advanced analytics out of the MVP.

## Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- JWT
- Zod
- Multer
- Jest/Supertest

## Architecture

Frontend → REST API → Controllers → Services/business logic → Prisma → PostgreSQL

This starter keeps the architecture intentionally small. As implementation grows, domain logic can be extracted from controllers into dedicated service files.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup

```bash
git clone <your-repository-url>
cd projectfinder-backend
npm install
cp .env.example .env
```

Create a PostgreSQL database called `projectfinder`, then set `DATABASE_URL` in `.env`.

Generate Prisma Client:

```bash
npm run prisma:generate
```

Create/apply the development schema:

```bash
npm run prisma:migrate -- --name init
```

Seed development data:

```bash
npm run prisma:seed
```

Run:

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/api/v1/health
```

## Seed admin

```text
Email: admin@example.com
Password: AdminPassword123!
```

Use this only for local development. Change/remove it before any shared deployment.

## API overview

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Projects

```text
GET   /api/v1/projects
GET   /api/v1/projects/:id

POST  /api/v1/projects                 ADMIN
PATCH /api/v1/projects/:id             ADMIN
POST  /api/v1/projects/:id/publish     ADMIN
POST  /api/v1/projects/:id/unpublish   ADMIN

POST  /api/v1/projects/:id/start      AUTHENTICATED USER
```

### Project administration

```text
POST /api/v1/admin/industries
POST /api/v1/projects/:projectId/tasks
POST /api/v1/projects/:projectId/deliverables
```

### Submission

```text
POST /api/v1/projects/:projectId/deliverables/:deliverableId/submissions
```

The submission endpoint expects `multipart/form-data` with a `file` field.

## Filtering examples

```text
GET /api/v1/projects?industry=Healthcare
GET /api/v1/projects?difficulty=INTERMEDIATE
GET /api/v1/projects?industry=Healthcare&difficulty=INTERMEDIATE
```

## Security foundations

The starter includes:

- Helmet
- CORS configuration
- Rate limiting
- JWT authentication
- Role-based authorization
- bcrypt password hashing
- Zod request validation
- File size/type restrictions
- Environment-based secrets
- `x-powered-by` disabled

For production, add stronger file scanning, object storage, HTTPS, secure cookie/token strategy as agreed by the security review, audit logging, backup/recovery, and deployment-specific hardening.

## Testing

```bash
npm test
npm run typecheck
npm run build
```

## Week 1 evidence

Recommended screenshots/evidence:

1. Repository and folder structure
2. `/api/v1/health` response
3. Prisma schema / ERD
4. Successful local database migration
5. Seeded project visible in the database
6. README/API documentation

