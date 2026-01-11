/**
 * Notifications Validators
 * Business logic validators for notifications feature
 */

import type { NotificationFilter } from '../model/types';

/**
 * Validate notification filter
 */
export function validateNotificationFilter(filter: NotificationFilter): boolean {
  if (filter.page !== undefined && filter.page < 1) {
    return false;
  }
  if (filter.pageSize !== undefined && filter.pageSize < 1) {
    return false;
  }
  return true;
}
