# Database Notes

PostgreSQL is the proposed relational database.

## Relationships

```text
Industry 1 ──── * Project
Project  1 ──── * Task
Project  1 ──── * Deliverable
User     1 ──── * ProjectSelection
Project  1 ──── * ProjectSelection
User     1 ──── * Submission
Deliverable 1 ── * Submission
```

The unique `(userId, projectId)` constraint prevents duplicate project selections for the same user/project pair.

## Status values

Projects:
- DRAFT
- PUBLISHED
- UNPUBLISHED

Difficulty:
- BEGINNER
- INTERMEDIATE
- ADVANCED

Roles:
- USER
- ADMIN

## MVP data principle

Capture only data required to support the agreed MVP and the basic metrics identified by the Data Analyst. Avoid building an advanced analytics schema during the foundation phase.
