# Class Diagram — Spendez AI Backend (TypeScript)

```mermaid
classDiagram
    direction LR

    class BaseEntity {
      +string id
      +Date createdAt
      +Date updatedAt
    }

    class User {
      +string id
      +string name
      +string email
      +string passwordHash
      +Role role
      +string[] groupIds
      +verifyPassword(password: string) boolean
    }

    class Group {
      +string id
      +string name
      +string type
      +string ownerId
      +string[] memberIds
      +addMember(userId: string) void
      +removeMember(userId: string) void
    }

    class Expense {
      +string id
      +string groupId
      +string paidBy
      +number amount
      +string category
      +Date expenseDate
      +SplitType splitType
      +ExpenseStatus status
      +createDraftFromOCR(data: OCRResult) Expense
      +markFinalized() void
    }

    class Split {
      +string id
      +string expenseId
      +string userId
      +number shareAmount
      +number percentage
      +number weight
    }

    class Payment {
      +string id
      +string groupId
      +string fromUserId
      +string toUserId
      +number amount
      +PaymentStatus status
      +Date paidAt
    }

    class Budget {
      +string id
      +string ownerType
      +string ownerId
      +number monthlyLimit
      +number usedAmount
      +checkThreshold() boolean
    }

    class Notification {
      +string id
      +string userId
      +NotificationChannel channel
      +string title
      +string message
      +boolean read
      +markRead() void
    }

    class ElectricityRecord {
      +string id
      +string groupId
      +number previousUnits
      +number currentUnits
      +number ratePerUnit
      +number totalAmount
      +calculateTotal() number
    }

    class SplitStrategy {
      <<interface>>
      +calculateShares(expense: Expense, members: User[], config: SplitConfig) Split[]
    }

    class NotificationStrategy {
      <<interface>>
      +send(notification: Notification) Promise~void~
    }

    class ExpenseRepositoryInterface {
      <<interface>>
      +create(expense: Expense) Promise~Expense~
      +findById(expenseId: string) Promise~Expense~
      +findByGroup(groupId: string, cursor: string) Promise~Expense[]~
      +update(expense: Expense) Promise~Expense~
    }

    class PrismaExpenseRepository {
      -PrismaClient prisma
      +create(expense: Expense) Promise~Expense~
      +findById(expenseId: string) Promise~Expense~
      +findByGroup(groupId: string, cursor: string) Promise~Expense[]~
      +update(expense: Expense) Promise~Expense~
    }

    class EqualSplitStrategy {
      +calculateShares(expense: Expense, members: User[], config: SplitConfig) Split[]
    }

    class PercentageSplitStrategy {
      +calculateShares(expense: Expense, members: User[], config: SplitConfig) Split[]
    }

    class WeightedSplitStrategy {
      +calculateShares(expense: Expense, members: User[], config: SplitConfig) Split[]
    }

    class SplitContext {
      -SplitStrategy strategy
      +setStrategy(strategy: SplitStrategy) void
      +execute(expense: Expense, members: User[], config: SplitConfig) Split[]
    }

    class AuthService {
      -UserRepositoryInterface userRepo
      -JwtService jwtService
      -HashService hashService
      +register(dto: RegisterDTO) AuthResponse
      +login(dto: LoginDTO) AuthResponse
      +refreshToken(token: string) AuthResponse
    }

    class ExpenseService {
      -ExpenseRepositoryInterface expenseRepo
      -SplitService splitService
      -AuditService auditService
      -EventPublisher eventPublisher
      +createExpense(dto: CreateExpenseDTO) Expense
      +createExpenseDraftFromOCR(dto: OCRExpenseDraftDTO) Expense
      +finalizeExpense(expenseId: string) Expense
    }

    class SplitService {
      -SplitContext splitContext
      -SplitRepository splitRepo
      -StrategyFactory strategyFactory
      +splitExpense(expense: Expense, config: SplitConfig) Split[]
      +simplifyDebts(groupId: string) Payment[]
    }

    class AuthController {
      +register(req: Request, res: Response) void
      +login(req: Request, res: Response) void
      +refresh(req: Request, res: Response) void
    }

    class ExpenseController {
      +create(req: Request, res: Response) void
      +uploadBill(req: Request, res: Response) void
      +getGroupExpenses(req: Request, res: Response) void
    }

    class NotificationService {
      -NotificationRepository notificationRepo
      -NotificationStrategy strategy
      +sendExpenseCreated(userIds: string[], payload: NotifyPayload) void
      +sendBudgetAlert(userId: string, payload: NotifyPayload) void
    }

    class OCRService {
      -OCRProvider provider
      +extract(fileUrl: string) OCRResult
      +validateConfidence(result: OCRResult) boolean
    }

    class AnalyticsService {
      -ExpenseRepositoryInterface expenseRepo
      -BudgetRepository budgetRepo
      +getDashboard(groupId: string, from: Date, to: Date) DashboardDTO
      +queryInsights(query: string, userId: string) InsightResponse
      +detectRecurring(groupId: string) RecurringExpenseDTO[]
    }

    class StrategyFactory {
      +createSplitStrategy(type: SplitType) SplitStrategy
      +createNotificationStrategy(channel: NotificationChannel) NotificationStrategy
    }

    class EventPublisher {
      <<singleton>>
      +publish(eventName: string, payload: object) void
      +subscribe(eventName: string, handler: Function) void
    }

    class AppLogger {
      <<singleton>>
      +info(message: string, meta: object) void
      +error(message: string, meta: object) void
      +debug(message: string, meta: object) void
    }

    %% Inheritance
    BaseEntity <|-- User
    BaseEntity <|-- Group
    BaseEntity <|-- Expense
    BaseEntity <|-- Split
    BaseEntity <|-- Payment
    BaseEntity <|-- Budget
    BaseEntity <|-- Notification
    BaseEntity <|-- ElectricityRecord

    %% Interface implementations
    SplitStrategy <|.. EqualSplitStrategy
    SplitStrategy <|.. PercentageSplitStrategy
    SplitStrategy <|.. WeightedSplitStrategy
    ExpenseRepositoryInterface <|.. PrismaExpenseRepository

    %% Composition / aggregation / dependency
    Group o-- User : members
    Expense *-- Split : contains
    Expense --> User : paidBy
    Split --> User : owedBy
    Payment --> User : from/to
    Budget --> User : owner
    ElectricityRecord --> Group : belongsTo
    Notification --> User : recipient

    SplitContext --> SplitStrategy : uses
    SplitService --> SplitContext : composes
    SplitService --> StrategyFactory : resolves strategy

    ExpenseService --> ExpenseRepositoryInterface : depends on
    ExpenseService --> SplitService : coordinates
    ExpenseService --> EventPublisher : publishes events

    AuthController --> AuthService : DI
    ExpenseController --> ExpenseService : DI
    AuthService --> User : manages

    NotificationService --> NotificationStrategy : polymorphic send
    NotificationService --> Notification : persists
    OCRService --> ExpenseService : draft creation support

    AnalyticsService --> ExpenseRepositoryInterface : queries
    AnalyticsService --> Budget : evaluates thresholds
```

## TypeScript-Oriented Modeling Notes
- Interfaces define repository and strategy contracts for strong type safety.
- DTOs (e.g., `CreateExpenseDTO`, `SplitConfig`, `InsightResponse`) prevent controller-service leakage.
- Dependency injection is used at controller/service construction to keep modules testable.
- Polymorphism is achieved by runtime strategy resolution via `StrategyFactory` and interface references.
