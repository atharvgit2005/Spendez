# ER Diagram — Spendez AI (MongoDB via Prisma)

## Entity Relationship Model

```mermaid
erDiagram
    USERS {
      string _id PK
      string name
      string email UK
      string password_hash
      string role
      string avatar_url
      boolean is_active
      datetime created_at
      datetime updated_at
      datetime last_login_at
    }

    GROUPS {
      string _id PK
      string name
      string type
      string description
      string created_by FK
      string default_currency
      boolean is_archived
      datetime created_at
      datetime updated_at
    }

    GROUPMEMBERS {
      string _id PK
      string group_id FK
      string user_id FK
      string member_role
      datetime joined_at
      boolean is_active
    }

    EXPENSES {
      string _id PK
      string group_id FK
      string paid_by FK
      string title
      string description
      decimal amount
      string currency
      string category
      string split_type
      string source_type
      string receipt_url
      string ocr_status
      float ocr_confidence
      datetime expense_date
      boolean is_recurring
      string recurring_key
      datetime created_at
      datetime updated_at
    }

    SPLITS {
      string _id PK
      string expense_id FK
      string user_id FK
      decimal share_amount
      float percentage
      float weight
      string status
      datetime settled_at
      datetime created_at
      datetime updated_at
    }

    PAYMENTS {
      string _id PK
      string group_id FK
      string from_user_id FK
      string to_user_id FK
      decimal amount
      string currency
      string method
      string status
      string reference_note
      datetime paid_at
      datetime created_at
      datetime updated_at
    }

    BUDGETS {
      string _id PK
      string owner_type
      string owner_id
      decimal limit_amount
      decimal used_amount
      string period_type
      datetime period_start
      datetime period_end
      float alert_threshold
      boolean alert_enabled
      datetime created_at
      datetime updated_at
    }

    ELECTRICITYRECORDS {
      string _id PK
      string group_id FK
      string recorded_by FK
      int previous_units
      int current_units
      decimal rate_per_unit
      decimal fixed_charge
      decimal total_amount
      datetime billing_start
      datetime billing_end
      datetime created_at
      datetime updated_at
    }

    NOTIFICATIONS {
      string _id PK
      string user_id FK
      string event_type
      string channel
      string title
      string message
      boolean is_read
      datetime scheduled_at
      datetime sent_at
      string delivery_status
      datetime created_at
    }

    AUDITLOGS {
      string _id PK
      string actor_user_id FK
      string action
      string resource_type
      string resource_id
      string request_id
      string ip_address
      json metadata
      datetime created_at
    }

    USERS ||--o{ GROUPS : creates
    USERS ||--o{ GROUPMEMBERS : joins
    GROUPS ||--o{ GROUPMEMBERS : contains

    GROUPS ||--o{ EXPENSES : has
    USERS ||--o{ EXPENSES : pays

    EXPENSES ||--o{ SPLITS : decomposes_into
    USERS ||--o{ SPLITS : owes_share

    GROUPS ||--o{ PAYMENTS : settles_in
    USERS ||--o{ PAYMENTS : pays_from
    USERS ||--o{ PAYMENTS : pays_to

    USERS ||--o{ BUDGETS : owns_personal
    GROUPS ||--o{ BUDGETS : owns_group

    GROUPS ||--o{ ELECTRICITYRECORDS : tracks
    USERS ||--o{ ELECTRICITYRECORDS : records

    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDITLOGS : performs
```

## Constraints and Validation Rules
- `USERS.email` must be unique and normalized.
- `GROUPMEMBERS (group_id, user_id)` composite unique constraint prevents duplicate memberships.
- `SPLITS.share_amount` values for an expense must sum to `EXPENSES.amount` (service-level invariant).
- `EXPENSES.amount`, `PAYMENTS.amount`, `BUDGETS.limit_amount` must be positive.
- `ELECTRICITYRECORDS.current_units >= previous_units`.
- `BUDGETS.owner_type` in (`USER`, `GROUP`) with conditional ownership validation.
- Soft-delete/archival flags for history-safe operations.

## Indexing Considerations (MongoDB + Prisma)
Recommended indexes:
- `USERS`: unique index on `email`
- `GROUPMEMBERS`: compound index on `(group_id, user_id)` unique; secondary on `user_id`
- `EXPENSES`: compound index on `(group_id, expense_date desc)`; index on `paid_by`; index on `recurring_key`
- `SPLITS`: compound index on `(expense_id, user_id)`
- `PAYMENTS`: compound index on `(group_id, paid_at desc)`
- `BUDGETS`: compound index on `(owner_type, owner_id, period_start)`
- `NOTIFICATIONS`: compound index on `(user_id, is_read, created_at desc)`
- `AUDITLOGS`: index on `(actor_user_id, created_at desc)` and `request_id`

## Transaction Boundaries
Use MongoDB transactions (where supported) for:
- Expense creation + split rows + audit log.
- Payment settlement + split status updates.
- Budget update + notification generation.

## Data Retention Notes
- Audit logs are append-only.
- Notifications and processed OCR metadata can be archived after policy threshold.
- Expense and payment records should remain immutable except controlled status transitions.
