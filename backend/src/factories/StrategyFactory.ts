import { ISplitStrategy, SplitConfig } from '../interfaces/strategies/ISplitStrategy';
import { INotificationStrategy } from '../interfaces/strategies/INotificationStrategy';
import { EqualSplitStrategy } from '../strategies/split/EqualSplitStrategy';
import { PercentageSplitStrategy } from '../strategies/split/PercentageSplitStrategy';
import { WeightedSplitStrategy } from '../strategies/split/WeightedSplitStrategy';
import { ExactSplitStrategy } from '../strategies/split/ExactSplitStrategy';
import { InAppNotificationStrategy } from '../strategies/notification/InAppNotificationStrategy';
import { EmailNotificationStrategy } from '../strategies/notification/EmailNotificationStrategy';
import { DomainError } from '../errors/AppError';

type SplitType = 'EQUAL' | 'PERCENTAGE' | 'WEIGHTED' | 'EXACT';
type NotificationChannel = 'IN_APP' | 'EMAIL';

export class StrategyFactory {
  static createSplitStrategy(type: SplitType): ISplitStrategy {
    switch (type) {
      case 'EQUAL':      return new EqualSplitStrategy();
      case 'PERCENTAGE': return new PercentageSplitStrategy();
      case 'WEIGHTED':   return new WeightedSplitStrategy();
      case 'EXACT':      return new ExactSplitStrategy();
      default:
        throw new DomainError('INVALID_SPLIT_TYPE', `Unknown split type: ${type}`);
    }
  }

  static createNotificationStrategy(channel: NotificationChannel): INotificationStrategy {
    switch (channel) {
      case 'EMAIL':  return new EmailNotificationStrategy();
      case 'IN_APP': return new InAppNotificationStrategy();
      default:
        throw new DomainError('INVALID_CHANNEL', `Unknown notification channel: ${channel}`);
    }
  }
}

export type { SplitType, NotificationChannel, SplitConfig };
