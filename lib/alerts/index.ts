/**
 * Proactive AI Alerts Module
 *
 * Generates context-aware alerts based on user financial data.
 */

export { generateAlerts, buildAlertContext } from './engine';
export type {
  Alert,
  AlertType,
  AlertPriority,
  AlertContext,
  AlertRule,
  AlertRuleResult,
} from './types';
