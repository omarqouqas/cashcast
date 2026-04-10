/**
 * Client Payment Risk Scoring
 *
 * Predicts invoice payment timing based on client payment history.
 *
 * Usage:
 * ```ts
 * import {
 *   getClientPaymentHistory,
 *   calculatePaymentRisk,
 *   getRiskBadgeClasses,
 * } from '@/lib/invoices/payment-risk';
 *
 * // Get client history from all invoices
 * const history = getClientPaymentHistory(allInvoices, clientName, clientEmail);
 *
 * // Calculate risk for a specific invoice
 * const risk = calculatePaymentRisk(invoice, history);
 *
 * // Use in UI
 * if (risk) {
 *   console.log(risk.riskLevel); // 'low' | 'medium' | 'high' | 'critical'
 *   console.log(risk.expectedPaymentDate); // '2026-04-15'
 * }
 * ```
 */

export * from './types';
export { getClientPaymentHistory, getUniqueClients } from './history';
export {
  calculatePaymentRisk,
  getRiskLabel,
  getRiskBadgeClasses,
} from './scorer';
