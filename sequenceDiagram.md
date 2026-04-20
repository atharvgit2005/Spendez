# Sequence Diagrams — Spendez AI

## A) Bill Upload -> OCR -> Categorization -> Split -> Notify

```mermaid
sequenceDiagram
    autonumber
    participant U as Student User
    participant API as ExpenseController
    participant V as ValidationMiddleware
    participant A as AuthMiddleware (JWT)
    participant ES as ExpenseService
    participant BR as BillRepository
    participant Q as EventBus/Queue
    participant OW as OCRWorker
    participant OCR as OCRService
    participant CAT as CategorizationService
    participant SS as SplitService
    participant SR as SplitRepository
    participant NS as NotificationService
    participant NR as NotificationRepository

    U->>API: POST /bills/upload (file, groupId, splitConfig)
    API->>V: validate upload DTO
    V-->>API: valid
    API->>A: verify token + membership
    A-->>API: authorized
    API->>ES: createBillUploadJob(dto)
    ES->>BR: save bill metadata(status=queued)
    BR-->>ES: billId
    ES->>Q: publish BillUploaded(billId)
    ES-->>API: 202 Accepted (billId)
    API-->>U: Upload accepted

    Q->>OW: consume BillUploaded
    OW->>OCR: extractText(fileUrl)
    OCR-->>OW: rawText + confidence
    OW->>CAT: classify(rawText, merchant, items)
    CAT-->>OW: category + tags
    OW->>ES: createExpenseDraftFromOCR(billId, parsedData)
    ES->>SS: executeSplit(expenseDraft, splitConfig)
    SS->>SR: persist split records
    SR-->>SS: persisted
    SS-->>ES: split summary
    ES->>BR: update bill status=processed
    ES->>Q: publish ExpenseProcessed(expenseId)

    Q->>NS: consume ExpenseProcessed
    NS->>NR: save notifications
    NS-->>U: in-app/email reminder delivered
```

## B) Smart Split Strategy Execution Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as Student User
    participant C as SplitController
    participant V as ValidationMiddleware
    participant S as SplitService
    participant F as StrategyFactory
    participant X as SplitContext
    participant EQ as EqualSplitStrategy
    participant PC as PercentageSplitStrategy
    participant WT as WeightedSplitStrategy
    participant R as SplitRepository

    U->>C: POST /expenses/{id}/split (type, participants, rules)
    C->>V: validate split payload
    V-->>C: payload valid
    C->>S: splitExpense(expenseId, config)
    S->>F: resolve(type)

    alt type == EQUAL
        F-->>S: EQ instance
        S->>X: setStrategy(EQ)
        X->>EQ: calculateShares(...)
        EQ-->>X: shares[]
    else type == PERCENTAGE
        F-->>S: PC instance
        S->>X: setStrategy(PC)
        X->>PC: calculateShares(...)
        PC-->>X: shares[]
    else type == WEIGHTED
        F-->>S: WT instance
        S->>X: setStrategy(WT)
        X->>WT: calculateShares(...)
        WT-->>X: shares[]
    end

    X-->>S: split result
    S->>S: validate total precision + group membership
    S->>R: saveSplitRecords(expenseId, shares)
    R-->>S: persisted
    S-->>C: split response
    C-->>U: 200 OK + share matrix
```

## C) User Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant AC as AuthController
    participant VM as ValidationMiddleware
    participant AS as AuthService
    participant UR as UserRepository
    participant HS as HashService
    participant JS as JwtService

    U->>AC: POST /auth/login (email, password)
    AC->>VM: validate login DTO
    VM-->>AC: valid
    AC->>AS: login(credentials)
    AS->>UR: findByEmail(email)
    UR-->>AS: user or null

    alt user not found
        AS-->>AC: DomainError(USER_NOT_FOUND)
        AC-->>U: 404 Not Found
    else user exists
        AS->>HS: compare(password, user.passwordHash)
        HS-->>AS: true/false
        alt password mismatch
            AS-->>AC: DomainError(INVALID_CREDENTIALS)
            AC-->>U: 401 Unauthorized
        else password valid
            AS->>JS: signAccessToken(userId, role)
            AS->>JS: signRefreshToken(userId)
            JS-->>AS: tokens
            AS->>UR: updateLastLogin(userId)
            AS-->>AC: auth payload
            AC-->>U: 200 OK (accessToken, refreshToken)
        end
    end
```

## D) Error Handling & Validation Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant R as Route
    participant VM as ValidationMiddleware
    participant CM as Controller
    participant SV as Service
    participant RP as Repository
    participant EH as ErrorMiddleware

    U->>R: Request with payload
    R->>VM: schema validation

    alt validation fails
        VM-->>EH: ValidationError(details)
        EH-->>U: 400 {code,message,details,traceId}
    else validation passes
        VM->>CM: forward
        CM->>SV: execute use-case
        SV->>RP: data operation

        alt repository fails (DB/constraint)
            RP-->>SV: PersistenceError
            SV-->>EH: AppError(DB_WRITE_FAILED)
            EH-->>U: 500/409 standardized error response
        else domain rule violated
            SV-->>EH: DomainError(BUSINESS_RULE_VIOLATION)
            EH-->>U: 422 standardized error response
        else success
            RP-->>SV: data
            SV-->>CM: response DTO
            CM-->>U: 2xx success
        end
    end
```

## E) Async Processing Flow for OCR

```mermaid
sequenceDiagram
    autonumber
    participant API as BillController
    participant Q as QueueProducer
    participant W as OCRWorker
    participant O as OCRService
    participant E as ExpenseService
    participant N as NotificationWorker
    participant DLQ as DeadLetterQueue

    API->>Q: enqueue(BillUploadedJob)
    Q-->>API: jobId
    API-->>API: return 202 immediately

    Q->>W: deliver job
    W->>O: parseDocument(file)

    alt OCR success
        O-->>W: parsed payload
        W->>E: createExpenseDraft(parsed payload)
        E-->>W: expenseDraftId
        W->>Q: enqueue(NotificationJob)
        Q->>N: deliver notification job
        N-->>N: send user alert
    else OCR temporary failure
        O-->>W: timeout/transient error
        W-->>Q: retry with backoff
    else OCR permanent failure
        O-->>W: malformed/unsupported document
        W->>DLQ: move failed job + reason
        W->>Q: emit BillProcessingFailed event
    end
```
