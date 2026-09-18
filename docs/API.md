# Initial API Contract

Base URL:

```text
/api/v1
```

## Health

`GET /health`

## Authentication

`POST /auth/register`
- body: name, email, password

`POST /auth/login`
- body: email, password

`GET /auth/me`
- requires Bearer token

## Projects

`GET /projects`
- optional query: industry, difficulty, page, limit

`GET /projects/:id`

`POST /projects`
- ADMIN

`PATCH /projects/:id`
- ADMIN

`POST /projects/:id/publish`
- ADMIN

`POST /projects/:id/unpublish`
- ADMIN

`POST /projects/:id/start`
- authenticated

## Admin project content

`POST /projects/:projectId/tasks`
- ADMIN

`POST /projects/:projectId/deliverables`
- ADMIN

## Submission

`POST /projects/:projectId/deliverables/:deliverableId/submissions`
- authenticated
- multipart/form-data
- file field: `file`
