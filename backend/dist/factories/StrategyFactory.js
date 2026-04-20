"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyFactory = void 0;
const EqualSplitStrategy_1 = require("../strategies/split/EqualSplitStrategy");
const PercentageSplitStrategy_1 = require("../strategies/split/PercentageSplitStrategy");
const WeightedSplitStrategy_1 = require("../strategies/split/WeightedSplitStrategy");
const ExactSplitStrategy_1 = require("../strategies/split/ExactSplitStrategy");
const InAppNotificationStrategy_1 = require("../strategies/notification/InAppNotificationStrategy");
const EmailNotificationStrategy_1 = require("../strategies/notification/EmailNotificationStrategy");
const AppError_1 = require("../errors/AppError");
class StrategyFactory {
    static createSplitStrategy(type) {
        switch (type) {
            case 'EQUAL': return new EqualSplitStrategy_1.EqualSplitStrategy();
            case 'PERCENTAGE': return new PercentageSplitStrategy_1.PercentageSplitStrategy();
            case 'WEIGHTED': return new WeightedSplitStrategy_1.WeightedSplitStrategy();
            case 'EXACT': return new ExactSplitStrategy_1.ExactSplitStrategy();
            default:
                throw new AppError_1.DomainError('INVALID_SPLIT_TYPE', `Unknown split type: ${type}`);
        }
    }
    static createNotificationStrategy(channel) {
        switch (channel) {
            case 'EMAIL': return new EmailNotificationStrategy_1.EmailNotificationStrategy();
            case 'IN_APP': return new InAppNotificationStrategy_1.InAppNotificationStrategy();
            default:
                throw new AppError_1.DomainError('INVALID_CHANNEL', `Unknown notification channel: ${channel}`);
        }
    }
}
exports.StrategyFactory = StrategyFactory;
