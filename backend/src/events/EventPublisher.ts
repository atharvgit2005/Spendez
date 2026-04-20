import { EventEmitter } from 'events';

class EventPublisher extends EventEmitter {
  private static instance: EventPublisher;

  private constructor() {
    super();
    this.setMaxListeners(20);
  }

  static getInstance(): EventPublisher {
    if (!EventPublisher.instance) {
      EventPublisher.instance = new EventPublisher();
    }
    return EventPublisher.instance;
  }
}

export const eventPublisher = EventPublisher.getInstance();

export const Events = {
  EXPENSE_CREATED: 'expense.created',
  EXPENSE_PROCESSED: 'expense.processed',
  BILL_UPLOADED: 'bill.uploaded',
  PAYMENT_SETTLED: 'payment.settled',
  BUDGET_ALERT: 'budget.alert',
} as const;
