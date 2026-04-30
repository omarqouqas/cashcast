import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { DocumentProps } from '@react-pdf/renderer';
import type { Tables } from '@/types/supabase';
import { formatCurrency, formatDateOnly } from '@/lib/utils/format';

type Invoice = Tables<'invoices'>;

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 11,
    color: '#111827',
    fontFamily: 'Helvetica',
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    objectFit: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'right',
  },
  sectionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  section: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionValue: {
    fontSize: 11,
    color: '#111827',
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
    marginTop: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  amount: {
    fontSize: 26,
    fontWeight: 700,
  },
  meta: {
    fontSize: 11,
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  descriptionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 11,
    color: '#111827',
  },
  // Line items table styles
  table: {
    marginTop: 6,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRowLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  colDescription: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  colQty: {
    width: 60,
    textAlign: 'right',
  },
  colRate: {
    width: 80,
    textAlign: 'right',
  },
  colAmount: {
    width: 90,
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 700,
  },
  tableCellText: {
    fontSize: 11,
    color: '#111827',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    paddingRight: 12,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: 700,
    marginRight: 24,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    width: 90,
    textAlign: 'right',
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
  },
  paymentBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  paymentLabel: {
    fontSize: 10,
    color: '#0F766E',
    fontWeight: 700,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  paymentUrl: {
    fontSize: 9,
    color: '#115E59',
    wordBreak: 'break-all',
  },
});

export function InvoiceTemplate({
  invoice,
  fromEmail,
  paymentUrl,
  businessName,
  logoUrl,
  lineItems,
}: {
  invoice: Invoice;
  fromEmail: string;
  paymentUrl?: string;
  businessName?: string | null;
  logoUrl?: string | null;
  lineItems?: InvoiceLineItem[];
}): React.ReactElement<DocumentProps> {
  const status = invoice.status ?? 'draft';
  const hasLineItems = lineItems && lineItems.length > 0;

  return (
    <Document
      title={`Invoice ${invoice.invoice_number}`}
      author={fromEmail}
      subject={`Invoice ${invoice.invoice_number} for ${invoice.client_name}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {logoUrl && (
              <Image src={logoUrl} style={styles.logo} />
            )}
            <Text style={styles.title}>INVOICE</Text>
          </View>
          <View>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.invoiceNumber}>Status: {status}</Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>From</Text>
            {businessName && (
              <Text style={styles.sectionValue}>{businessName}</Text>
            )}
            <Text style={styles.sectionValue}>{fromEmail}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>To</Text>
            <Text style={styles.sectionValue}>{invoice.client_name}</Text>
            {invoice.client_email ? (
              <Text style={styles.sectionValue}>{invoice.client_email}</Text>
            ) : null}
          </View>
        </View>

        {/* Line Items Table (if itemized) */}
        {hasLineItems ? (
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={styles.colDescription}>
                <Text style={styles.tableHeaderText}>Description</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.tableHeaderText}>Qty</Text>
              </View>
              <View style={styles.colRate}>
                <Text style={styles.tableHeaderText}>Rate</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.tableHeaderText}>Amount</Text>
              </View>
            </View>

            {/* Table Rows */}
            {lineItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  ...(index === lineItems.length - 1 ? [styles.tableRowLast] : []),
                ]}
              >
                <View style={styles.colDescription}>
                  <Text style={styles.tableCellText}>{item.description}</Text>
                </View>
                <View style={styles.colQty}>
                  <Text style={styles.tableCellText}>
                    {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.colRate}>
                  <Text style={styles.tableCellText}>{formatCurrency(item.unit_price, invoice.currency)}</Text>
                </View>
                <View style={styles.colAmount}>
                  <Text style={styles.tableCellText}>{formatCurrency(item.amount, invoice.currency)}</Text>
                </View>
              </View>
            ))}

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatCurrency(invoice.amount, invoice.currency)}</Text>
            </View>
          </View>
        ) : (
          /* Simple invoice - single amount */
          <View style={styles.detailsBox}>
            <View style={styles.detailsRow}>
              <Text style={styles.amount}>{formatCurrency(invoice.amount, invoice.currency)}</Text>
              <View>
                <Text style={styles.meta}>Due: {formatDateOnly(invoice.due_date)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>
              {invoice.description?.trim()
                ? invoice.description
                : 'No description provided.'}
            </Text>
          </View>
        )}

        {/* Due date for itemized invoices (shown separately) */}
        {hasLineItems && (
          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <Text style={styles.meta}>Due: {formatDateOnly(invoice.due_date)}</Text>
            {invoice.description?.trim() && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.descriptionLabel}>Notes</Text>
                <Text style={styles.description}>{invoice.description}</Text>
              </View>
            )}
          </View>
        )}

        {/* Payment URL */}
        {paymentUrl && (
          <View style={styles.paymentBox}>
            <Text style={styles.paymentLabel}>Pay Online</Text>
            <Text style={styles.paymentUrl}>{paymentUrl}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business</Text>
      </Page>
    </Document>
  );
}
