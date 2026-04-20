# Spendez AI — Intelligent Conversational Expense & Smart Split Platform

## Problem Statement
Students in hostels, flats, and trip groups frequently manage shared costs manually in chats or spreadsheets. This causes delayed settlements, incorrect splits, missed recurring payments, unclear accountability, and weak budget discipline. Existing apps often lack AI-assisted bill ingestion, smart debt optimization, and group-centric financial insights tailored for student collaboration.

## Solution Overview
Spendez AI is a backend-heavy full stack MERN platform that automates shared expense management through OCR-powered bill extraction, intelligent split strategies, debt simplification, recurring expense detection, budget alerts, electricity usage tracking, and conversational financial querying. The platform is designed with clean architecture, OOP principles, and event-driven asynchronous workflows.

## Scope
In-scope for semester implementation:
- User authentication and profile management
- Group lifecycle (create/invite/join/manage)
- Expense CRUD with split configuration
- OCR pipeline (upload bill -> parse -> suggest expense)
- Split engine with multiple strategies
- Debt simplification per group
- Budget setup and alerting
- Electricity tracking for hostels/flats
- Basic conversational query API for insights
- Notification and reminder system
- Audit logs for key actions
- Analytics dashboard APIs (basic React UI)

Out-of-scope (future):
- Direct bank integrations
- Production payment gateway settlement
- Multi-currency forex hedging
- Advanced LLM fine-tuning pipeline

## Key Features
- JWT-based authentication and role-based authorization
- Multi-group expense collaboration
- AI bill scanning (OCR + category recommendation)
- Smart split engine (Equal, Percentage, Weighted)
- Debt graph simplification for minimal transactions
- Recurring expense detection and reminder triggers
- Budget caps with overspending alerts
- Electricity bill + meter unit split module
- Conversational expense insights API
- Event-driven async processing for OCR/notifications
- Audit logging and admin monitoring

## System Architecture Overview
Architecture style: Clean MVC + service orchestration + repository abstraction + event-driven workers.

Layers:
1. Presentation Layer: Express controllers + route validators + DTO mapping.
2. Application Layer: Services (AuthService, ExpenseService, SplitService, AnalyticsService, OCRService).
3. Domain Layer: Core entities, interfaces, strategy contracts.
4. Data Layer: Repository implementations backed by Prisma + MongoDB.
5. Infra Layer: Queue workers, notification providers, logger, cache (optional), config.

## High-Level Component Diagram Explanation
Major components and interactions:
- React Client calls REST API Gateway (Express routes).
- Auth module validates JWT and enforces access control.
- Expense module persists expense + emits domain events.
- OCR module processes uploaded bill asynchronously and returns parsed result.
- Split engine chooses split strategy and writes split records.
- Debt simplifier computes optimized settlement edges.
- Budget module checks thresholds and triggers notifications.
- Notification module dispatches in-app/email/push alerts.
- Audit module records immutable activity trails.
- Analytics module aggregates data for dashboard and chat insights.

## Tech Stack Suggestion (MERN + TypeScript)
- Frontend: React + TypeScript, Redux Toolkit (or Context), Axios, Recharts
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- ORM: Prisma (MongoDB connector)
- Auth: JWT (access + refresh token approach)
- Async queue: BullMQ / Redis (or lightweight in-process queue for milestone)
- File storage: Local in dev, S3-compatible in prod
- Validation: Zod or class-validator
- Logging: Winston/Pino with structured logs
- Testing: Jest + Supertest

## Backend Architecture Explanation
Recommended backend modules:
- `auth`: register/login/refresh, RBAC guards
- `users`: profile management
- `groups`: group lifecycle + memberships
- `expenses`: expense creation/update/history
- `splits`: strategy execution + split persistence
- `payments`: settlement tracking
- `budgets`: limits + alerts
- `electricity`: meter records + bill sharing
- `notifications`: event subscribers + delivery strategies
- `analytics`: summaries/trends/assistant query handlers
- `audit`: activity logs

Flow principle:
Controller -> DTO Validation -> Service -> Repository -> Prisma -> MongoDB

## Split Engine Architecture Explanation
Core design:
- `SplitStrategy` interface defines `calculateShares(expense, participants, config): SplitResult[]`.
- Concrete strategies:
  - `EqualSplitStrategy`
  - `PercentageSplitStrategy`
  - `WeightedSplitStrategy`
- `SplitContext` selects and executes strategy (Strategy Pattern).
- `SplitService` validates split config, invokes context, persists splits, emits `ExpenseSplitCompleted` event.
- Debt simplification runs on resulting balances using a directed weighted graph (min cash flow approximation).

Validation rules:
- Percentage sum must equal 100.
- Weighted shares must be positive.
- Split participants must belong to group.
- Total split amount must match expense amount within precision tolerance.

## AI Processing Pipeline Explanation
Pipeline:
1. User uploads bill image/PDF.
2. API stores metadata and enqueues `BillUploaded` event.
3. OCR Worker fetches file, extracts text/line items.
4. Categorizer maps merchant/items to category using rule + ML model.
5. Validator checks amount/date confidence; low confidence marked `needs_review`.
6. Expense Draft created with suggested fields.
7. User confirms/edits draft and finalizes expense.
8. Split engine executes and notifications dispatch.

AI model boundary (semester-appropriate):
- External OCR API + lightweight categorization model/rule engine.
- Human confirmation loop for reliability.

## Scalability Considerations
- Stateless API instances for horizontal scaling.
- Repository abstraction enables read/write optimization later.
- Async queue decouples OCR and notification workloads from request latency.
- Index-heavy query paths for group timeline and dashboard.
- Pagination and cursor-based retrieval for expenses/audit logs.
- Caching hot analytics responses (short TTL).
- Idempotency keys for bill upload and expense create endpoints.

## Security Design
- JWT access + refresh rotation strategy.
- Password hashing with bcrypt/argon2.
- Role-based access controls (`USER`, `ADMIN`).
- Input validation via DTO schema and centralized sanitizer.
- Rate limiting on auth and upload endpoints.
- Secure file upload constraints (MIME, size, malware scan hook).
- Audit logs for sensitive operations.
- Secrets via environment variables; no hardcoded keys.

## Concurrency Handling
- Optimistic concurrency with `updatedAt` checks (or version field) on mutable records.
- MongoDB transactions for multi-document critical updates (expense + splits + balances).
- Queue retries with dead-letter handling for OCR/notification failures.
- Idempotent event consumers using event IDs.
- Distributed locking (future) for high-contention settlement operations.

## Design Decisions Justification
- TypeScript + interfaces improve safety for DTOs/service contracts.
- Repository pattern isolates persistence and supports future DB changes.
- Strategy pattern cleanly supports split algorithm extension.
- Event-driven OCR/notification avoids blocking API threads.
- Clean module boundaries help parallel team development and testing.
- Backend-first depth aligns with 75% scoring weightage.

## OOP Principles Usage
- Encapsulation:
  - Services encapsulate business rules (e.g., `SplitService` hides validation + execution internals).
  - Entities protect invariants through constructors/factory methods.
- Abstraction:
  - Interfaces (`ExpenseRepositoryInterface`, `SplitStrategy`, `NotificationStrategy`) define contracts decoupled from implementation.
- Inheritance:
  - Optional base classes like `BaseRepository<T>` and `BaseEntity` reduce duplicated behaviors.
- Polymorphism:
  - `SplitContext` and `NotificationService` invoke different strategy implementations uniformly via interface references.

## Design Patterns Used
- Repository Pattern:
  - `ExpenseRepositoryInterface` with `PrismaExpenseRepository` implementation.
- Strategy Pattern:
  - Multiple split and notification strategies selected at runtime.
- Factory Pattern:
  - `StrategyFactory` resolves strategy based on split type (`equal`, `percentage`, `weighted`).
- Singleton Pattern:
  - Shared logger/config/database client instances across modules.

## REST API Design Overview
Sample endpoint groups:
- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`
- `POST /api/v1/groups`, `GET /api/v1/groups/:groupId`
- `POST /api/v1/expenses`, `GET /api/v1/groups/:groupId/expenses`
- `POST /api/v1/expenses/:expenseId/split`
- `POST /api/v1/bills/upload`, `GET /api/v1/bills/:billId/status`
- `POST /api/v1/budgets`, `GET /api/v1/budgets/:groupId`
- `POST /api/v1/electricity/records`, `GET /api/v1/electricity/:groupId`
- `GET /api/v1/analytics/dashboard/:groupId`
- `POST /api/v1/chat/query`

API quality standards:
- DTO validation before service execution
- Consistent error envelope (`code`, `message`, `details`, `traceId`)
- Cursor pagination + filtering
- OpenAPI documentation

## Folder Structure Recommendation
```txt
src/
  app.ts
  server.ts
  config/
    env.ts
    logger.ts
    prisma.ts
    queue.ts
  routes/
    index.ts
    auth.routes.ts
    group.routes.ts
    expense.routes.ts
    analytics.routes.ts
  controllers/
    auth.controller.ts
    group.controller.ts
    expense.controller.ts
    split.controller.ts
  services/
    auth.service.ts
    expense.service.ts
    split.service.ts
    ocr.service.ts
    notification.service.ts
    analytics.service.ts
  repositories/
    interfaces/
      expense.repository.interface.ts
      group.repository.interface.ts
    prisma/
      prisma-expense.repository.ts
      prisma-group.repository.ts
  models/
    dto/
      create-expense.dto.ts
      split-config.dto.ts
    enums/
      split-type.enum.ts
      role.enum.ts
  domain/
    entities/
      user.entity.ts
      expense.entity.ts
    strategies/
      split-strategy.interface.ts
      equal-split.strategy.ts
      percentage-split.strategy.ts
      weighted-split.strategy.ts
      split-context.ts
  middlewares/
    auth.middleware.ts
    validation.middleware.ts
    error.middleware.ts
  events/
    producers/
    consumers/
  jobs/
    ocr.worker.ts
    notification.worker.ts
  utils/
    debt-simplifier.ts
    response.ts
  tests/
```

## Recommended Git Commit Strategy
Use small, meaningful, regular commits:
1. `chore: initialize project structure and configs`
2. `feat(auth): add JWT login/register/refresh APIs`
3. `feat(groups): add group and membership modules`
4. `feat(expenses): add expense CRUD and repository layer`
5. `feat(split): implement equal/percentage/weighted strategies`
6. `feat(ocr): add async bill upload and OCR worker pipeline`
7. `feat(analytics): add dashboard and conversational query endpoints`
8. `feat(notifications): add event-driven reminder dispatch`
9. `test: add service and controller unit tests`
10. `docs: update architecture and API specifications`

## Future Enhancements
- UPI/bank statement ingestion
- ML-based personal budget recommendations
- Predictive overspend forecasting
- Multi-currency and trip settlement optimization
- WhatsApp/Telegram bot integration
- Fraud/anomaly expense detection
