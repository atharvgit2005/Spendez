"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.eventPublisher = void 0;
const events_1 = require("events");
class EventPublisher extends events_1.EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(20);
    }
    static getInstance() {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }
}
exports.eventPublisher = EventPublisher.getInstance();
exports.Events = {
    EXPENSE_CREATED: 'expense.created',
    EXPENSE_PROCESSED: 'expense.processed',
    BILL_UPLOADED: 'bill.uploaded',
    PAYMENT_SETTLED: 'payment.settled',
    BUDGET_ALERT: 'budget.alert',
};
