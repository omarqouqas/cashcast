import { parseUsDateToIsoDate, parseUsAmount } from './parse-csv';

export type ExtractedTransaction = {
  date: string; // ISO format YYYY-MM-DD
  description: string;
  amount: number; // Positive = credit, Negative = debit
  rawLine: string;
  lineNumber: number;
  confidence: 'high' | 'medium' | 'low';
};

export type PdfExtractionResult = {
  transactions: ExtractedTransaction[];
  detectedBank: string | null;
  statementPeriod: {
    start: string | null;
    end: string | null;
  };
  errors: { line: number; message: string }[];
  confidence: 'high' | 'medium' | 'low';
};

// Month name to number mapping for Canadian bank formats
const MONTH_MAP: Record<string, string> = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', sept: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12',
};

// Bank detection patterns
const BANK_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  // Canadian Banks
  { pattern: /royal\s*bank|rbc\b/i, name: 'RBC' },
  { pattern: /td\s*canada\s*trust/i, name: 'TD Canada Trust' },
  { pattern: /scotiabank|bank\s*of\s*nova\s*scotia/i, name: 'Scotiabank' },
  { pattern: /bmo|bank\s*of\s*montreal/i, name: 'BMO' },
  { pattern: /cibc/i, name: 'CIBC' },
  { pattern: /national\s*bank\s*of\s*canada/i, name: 'National Bank' },
  { pattern: /tangerine/i, name: 'Tangerine' },
  { pattern: /simplii/i, name: 'Simplii Financial' },
  // US Banks
  { pattern: /chase.*jpmorgan|jpmorgan.*chase/i, name: 'Chase' },
  { pattern: /bank\s*of\s*america/i, name: 'Bank of America' },
  { pattern: /wells\s*fargo/i, name: 'Wells Fargo' },
  { pattern: /capital\s*one/i, name: 'Capital One' },
  { pattern: /citi(?:bank)?/i, name: 'Citibank' },
  { pattern: /us\s*bank/i, name: 'US Bank' },
  { pattern: /pnc\s*bank/i, name: 'PNC Bank' },
  { pattern: /td\s*bank/i, name: 'TD Bank' },
  { pattern: /truist/i, name: 'Truist' },
  { pattern: /navy\s*federal/i, name: 'Navy Federal' },
  { pattern: /usaa/i, name: 'USAA' },
  { pattern: /american\s*express|amex/i, name: 'American Express' },
  { pattern: /discover/i, name: 'Discover' },
  { pattern: /synchrony/i, name: 'Synchrony' },
  { pattern: /ally\s*bank/i, name: 'Ally Bank' },
  { pattern: /charles\s*schwab/i, name: 'Charles Schwab' },
  { pattern: /fidelity/i, name: 'Fidelity' },
  { pattern: /marcus.*goldman|goldman.*marcus/i, name: 'Marcus by Goldman Sachs' },
];

// Transaction line patterns - order matters, more specific first
const TRANSACTION_PATTERNS: RegExp[] = [
  // RBC format: "23 Feb Description 40.00 180.19" (DD Mon + desc + amount + balance)
  // Captures: day+month, description, transaction amount, ignores balance
  /^(\d{1,2}\s+[A-Za-z]{3})\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/,

  // RBC format: "23 Feb Description 192.50" (DD Mon + desc + single amount, no balance)
  /^(\d{1,2}\s+[A-Za-z]{3})\s+(.+?)\s+([\d,]+\.\d{2})$/,

  // Canadian format: "Mar 18, 2026 Monthly fee - $12.95 $423.06" (withdrawal with balance)
  /^([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+(.+?)\s+-\s*\$?([\d,]+\.\d{2})\s+\$?[\d,]+\.\d{2}$/,

  // Canadian format: "Mar 16, 2026 Deposit $500.00 $923.06" (deposit with balance)
  /^([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+(.+?)\s+\$?([\d,]+\.\d{2})\s+\$?[\d,]+\.\d{2}$/,

  // Canadian format without balance: "Mar 18, 2026 Monthly fee - $12.95"
  /^([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+(.+?)\s+-\s*\$?([\d,]+\.\d{2})$/,

  // Canadian format deposit without balance: "Mar 16, 2026 Deposit $500.00"
  /^([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s+(.+?)\s+\$?([\d,]+\.\d{2})$/,

  // Full date with 4-digit year + description + amount (with optional currency symbol and sign)
  // Example: 01/15/2024  VENMO PAYMENT FROM JOHN  +$500.00
  /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.\d{2})$/,

  // Full date with 2-digit year
  // Example: 01/15/24  ADOBE CREATIVE CLOUD  -54.99
  /^(\d{1,2}\/\d{1,2}\/\d{2})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.\d{2})$/,

  // Date without year (common in statements where year is in header)
  // Example: 01/15  SPOTIFY PREMIUM  9.99
  /^(\d{1,2}\/\d{1,2})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.\d{2})$/,

  // Date + description + amount with CR/DR suffix
  // Example: 01/15/2024  DIRECT DEPOSIT  1,500.00 CR
  /^(\d{1,2}\/\d{1,2}\/?\d{0,4})\s+(.+?)\s+([\d,]+\.\d{2})\s*(CR|DR)$/i,

  // ISO date format
  // Example: 2024-01-15  PAYMENT RECEIVED  500.00
  /^(\d{4}-\d{2}-\d{2})\s+(.+?)\s+([\-\+]?\$?[\d,]+\.\d{2})$/,

  // Some banks put amount first, then description
  // Example: 01/15  -$54.99  NETFLIX
  /^(\d{1,2}\/\d{1,2}\/?\d{0,4})\s+([\-\+]?\$?[\d,]+\.\d{2})\s+(.+)$/,

  // RBC continuation: no date, description + amount + balance (same day as previous)
  // Example: "OTHMANS BARBERS   40.00   180.19"
  /^([A-Za-z][A-Za-z\s\*\-0-9]+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/,

  // RBC continuation: no date, description + single amount
  // Example: "Fees/Dues ABC*5293-MOVATI   41.75"
  /^([A-Za-z][A-Za-z\s\*\-0-9]+?)\s+([\d,]+\.\d{2})$/,
];

// Keywords indicating withdrawal/debit transactions
const WITHDRAWAL_KEYWORDS = [
  /purchase/i,
  /\bpayment\b/i,
  /e-transfer sent/i,
  /transfer sent/i,
  /\binsurance\b/i,
  /mortgage/i,
  /fees?\/dues/i,
  /monthly fee/i,
  /utility/i,
  /property tax/i,
  /bill pmt/i,
  /\binvestment\b/i,
  /to find & save/i,
  /find & save/i,
  /moneygram/i,
  /interac purchase/i,
  /visa debit purchase/i,
  /contactless/i,
  /foreign exchange/i,
];

// Keywords indicating deposit/credit transactions
const DEPOSIT_KEYWORDS = [
  /\bdeposit\b/i,
  /payroll/i,
  /direct deposit/i,
  /e-transfer\s+(?:received|from)/i,
  /refund/i,
  /credit/i,
  /interest/i,
];

// Lines to skip (headers, footers, etc.)
const SKIP_PATTERNS: RegExp[] = [
  /^(date|posted|description|amount|balance|transaction|activity)/i,
  /^(beginning|ending|opening|closing)\s*(balance)?/i,
  /^(page|statement|account)/i,
  /^(total|subtotal)/i,
  /^\s*$/,
  // RBC-specific headers and summaries
  /^your\s+(opening|closing)\s+balance/i,
  /^total\s+(deposits|withdrawals)/i,
  /^summary\s+of/i,
  /^details\s+of/i,
  /^how\s+to\s+reach/i,
  /^royal\s+bank/i,
  /^rbc\s+/i,
  /continued$/i,
  // Generic bank statement boilerplate
  /^withdrawals?\s*\(\$\)/i,
  /^deposits?\s*\(\$\)/i,
];

/**
 * Parse Canadian-style date with month name (e.g., "Mar 18, 2026" or "March 18 2026")
 */
function parseMonthNameDate(dateStr: string): string | null {
  // Match: "Mar 18, 2026" or "March 18 2026" or "Mar 18,2026"
  const match = dateStr.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s*(\d{4})$/);
  if (!match || !match[1] || !match[2] || !match[3]) {
    return null;
  }

  const monthName = match[1].toLowerCase();
  const day = match[2].padStart(2, '0');
  const year = match[3];

  const month = MONTH_MAP[monthName];
  if (!month) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

/**
 * Parse RBC-style date (e.g., "23 Feb" -> needs year from statement)
 */
function parseDayMonthDate(dateStr: string, year: number): string | null {
  // Match: "23 Feb" or "2 Mar"
  const match = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})$/);
  if (!match || !match[1] || !match[2]) {
    return null;
  }

  const day = match[1].padStart(2, '0');
  const monthName = match[2].toLowerCase();

  const month = MONTH_MAP[monthName];
  if (!month) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

/**
 * Determine if a transaction is likely a withdrawal based on description keywords.
 * Returns: true = withdrawal, false = deposit, null = ambiguous
 */
function classifyTransaction(description: string): 'withdrawal' | 'deposit' | null {
  // Check deposit keywords first (they're more specific)
  if (DEPOSIT_KEYWORDS.some(pattern => pattern.test(description))) {
    return 'deposit';
  }

  // Check withdrawal keywords
  if (WITHDRAWAL_KEYWORDS.some(pattern => pattern.test(description))) {
    return 'withdrawal';
  }

  // Ambiguous - can't determine from description alone
  return null;
}

/**
 * Determine if a transaction is likely a withdrawal based on description keywords
 */
function isLikelyWithdrawal(description: string): boolean {
  const classification = classifyTransaction(description);
  // Default to withdrawal for ambiguous cases (most bank transactions are expenses)
  return classification !== 'deposit';
}

/**
 * Detect bank from PDF text content.
 */
function detectBank(text: string): string | null {
  for (const { pattern, name } of BANK_PATTERNS) {
    if (pattern.test(text)) {
      return name;
    }
  }
  return null;
}

/**
 * Detect statement period from PDF text.
 */
function detectStatementPeriod(text: string): { start: string | null; end: string | null } {
  // Common patterns for statement periods
  const periodPatterns = [
    // Canadian: "March 1, 2026 to March 31, 2026" or "Mar 1, 2026 - Mar 31, 2026"
    /([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\s*(?:to|-|through|–)\s*([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/i,
    // "Statement Period: 01/01/2024 - 01/31/2024"
    /statement\s+period[:\s]+(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:to|-|through|–)\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    // "01/01/2024 through 01/31/2024"
    /(\d{1,2}\/\d{1,2}\/\d{4})\s+(?:to|through|–|-)\s+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    // "For the period 01/01/2024 to 01/31/2024"
    /for\s+(?:the\s+)?period[:\s]+(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:to|-|through|–)\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
  ];

  for (const pattern of periodPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[2]) {
      // Try Canadian format first, then US format
      let start = parseMonthNameDate(match[1]) || parseUsDateToIsoDate(match[1]);
      let end = parseMonthNameDate(match[2]) || parseUsDateToIsoDate(match[2]);
      if (start && end) {
        return { start, end };
      }
    }
  }

  return { start: null, end: null };
}

/**
 * Check if a line should be skipped.
 */
function shouldSkipLine(line: string): boolean {
  return SKIP_PATTERNS.some((pattern) => pattern.test(line));
}

/**
 * Try to parse a single line as a transaction.
 * @param lastDate - The last successfully parsed date, used for continuation lines
 */
function tryParseLine(
  line: string,
  lineNumber: number,
  statementYear?: number,
  lastDate?: string
): ExtractedTransaction | null {
  // Skip obvious non-transaction lines
  if (shouldSkipLine(line)) {
    return null;
  }

  // Clean up the line
  const cleanedLine = line
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (cleanedLine.length < 10) {
    return null; // Too short to be a transaction
  }

  // Track pattern index to know which one matched
  let patternIndex = -1;

  for (let i = 0; i < TRANSACTION_PATTERNS.length; i++) {
    const pattern = TRANSACTION_PATTERNS[i];
    if (!pattern) continue;
    const match = cleanedLine.match(pattern);
    if (match) {
      patternIndex = i;

      // Pattern groups vary, handle each case
      let dateRaw: string | undefined;
      let description: string | undefined;
      let amountRaw: string | undefined;
      let crDr: string | undefined;
      let isWithdrawal = false;
      let isRbcFormat = false;

      // RBC format: "DD Mon" date (patterns 0-1)
      if (patternIndex <= 1) {
        isRbcFormat = true;
        dateRaw = match[1];
        description = match[2];
        // For RBC, pattern 0 has amount in [3] and balance in [4], pattern 1 just has amount in [3]
        amountRaw = match[3];
        // Determine if withdrawal based on description keywords
        isWithdrawal = isLikelyWithdrawal(description || '');
      }
      // RBC continuation patterns (no date): patterns 12-13
      else if (patternIndex === 12 || patternIndex === 13) {
        // These patterns have: description in [1], amount in [2], optional balance in [3]
        dateRaw = undefined; // No date, will use lastDate
        description = match[1];
        amountRaw = match[2];
        // Determine if withdrawal based on description keywords
        isWithdrawal = isLikelyWithdrawal(description || '');
      }
      // Canadian patterns with full date (indices 2-5) - check for withdrawal pattern in line
      else if (patternIndex <= 5) {
        // Check if original line has "- $" pattern indicating withdrawal
        isWithdrawal = /\s-\s*\$?\d/.test(cleanedLine);
        dateRaw = match[1];
        description = match[2];
        amountRaw = match[3];
      } else if (match[4] && /^(CR|DR)$/i.test(match[4])) {
        // Pattern with CR/DR suffix
        dateRaw = match[1];
        description = match[2];
        amountRaw = match[3];
        crDr = match[4];
      } else if (match[3] && !match[3].match(/^\d/)) {
        // Amount first pattern (amount in match[2], description in match[3])
        dateRaw = match[1];
        amountRaw = match[2];
        description = match[3];
      } else {
        // Standard pattern (date, description, amount)
        dateRaw = match[1];
        description = match[2];
        amountRaw = match[3];
      }

      // Ensure required values are present (date can be missing for continuation lines)
      if (!description || !amountRaw) continue;

      // Try to parse date based on format
      let date: string | null = null;

      // Continuation line (no date) - use last known date
      if (!dateRaw && lastDate) {
        date = lastDate;
      }
      // RBC format: "23 Feb" (day + month name, no year)
      else if (isRbcFormat && dateRaw && statementYear) {
        date = parseDayMonthDate(dateRaw, statementYear);
      }
      // Check if date looks like "Mar 18, 2026" format (month name first with year)
      else if (dateRaw && /^[A-Za-z]/.test(dateRaw)) {
        date = parseMonthNameDate(dateRaw);
      }
      // If not month name format, try US date format (MM/DD/YYYY)
      else if (dateRaw) {
        let dateToParse = dateRaw;
        if (!/\d{4}/.test(dateRaw) && statementYear) {
          // Date doesn't have year, add it
          dateToParse = `${dateRaw}/${statementYear}`;
        }
        date = parseUsDateToIsoDate(dateToParse);
      }

      if (!date) continue;

      // Parse amount
      let amount = parseUsAmount(amountRaw);
      if (amount === null) continue;

      // Handle Canadian withdrawal pattern (- prefix means debit/withdrawal)
      if (isWithdrawal && amount > 0) {
        amount = -amount;
      }

      // Handle CR/DR suffix
      if (crDr) {
        if (crDr.toUpperCase() === 'DR' && amount > 0) {
          amount = -amount;
        } else if (crDr.toUpperCase() === 'CR' && amount < 0) {
          amount = Math.abs(amount);
        }
      }

      // Clean up description
      const cleanDescription = description
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200); // Limit length

      if (!cleanDescription) continue;

      return {
        date,
        description: cleanDescription,
        amount,
        rawLine: line,
        lineNumber,
        confidence: 'high',
      };
    }
  }

  return null;
}

/**
 * Calculate overall extraction confidence.
 */
function calculateConfidence(
  transactions: ExtractedTransaction[],
  detectedBank: string | null
): 'high' | 'medium' | 'low' {
  if (transactions.length === 0) return 'low';
  if (detectedBank && transactions.length >= 5) return 'high';
  if (transactions.length >= 3) return 'medium';
  return 'low';
}

/**
 * Extract year from statement period or text.
 */
function extractStatementYear(text: string, period: { start: string | null }): number | undefined {
  // Try from statement period first
  if (period.start) {
    const year = parseInt(period.start.substring(0, 4), 10);
    if (!isNaN(year)) return year;
  }

  // Look for year in text
  const currentYear = new Date().getFullYear();
  const yearMatch = text.match(/\b(20\d{2})\b/);
  if (yearMatch && yearMatch[1]) {
    const year = parseInt(yearMatch[1], 10);
    // Only use if it's within a reasonable range
    if (year >= currentYear - 5 && year <= currentYear + 1) {
      return year;
    }
  }

  return currentYear; // Default to current year
}

/**
 * Main extraction function - extracts transactions from PDF text.
 */
export function extractTransactions(pdfText: string): PdfExtractionResult {
  const detectedBank = detectBank(pdfText);
  const statementPeriod = detectStatementPeriod(pdfText);
  const statementYear = extractStatementYear(pdfText, statementPeriod);

  const lines = pdfText.split('\n');
  const transactions: ExtractedTransaction[] = [];
  const errors: { line: number; message: string }[] = [];

  // Track seen transactions to avoid duplicates within the same document
  const seen = new Set<string>();

  // Track last parsed date for continuation lines (RBC puts multiple transactions on same date)
  let lastDate: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const lineNumber = i + 1;

    try {
      const transaction = tryParseLine(line, lineNumber, statementYear, lastDate);

      if (transaction) {
        // Update last date for continuation lines
        lastDate = transaction.date;

        // Create a key to detect duplicates
        const key = `${transaction.date}|${transaction.description}|${transaction.amount}`;

        if (!seen.has(key)) {
          seen.add(key);
          transactions.push(transaction);
        }
      }
    } catch (err) {
      errors.push({
        line: lineNumber,
        message: err instanceof Error ? err.message : 'Unknown parsing error',
      });
    }
  }

  const confidence = calculateConfidence(transactions, detectedBank);

  return {
    transactions,
    detectedBank,
    statementPeriod,
    errors,
    confidence,
  };
}

/**
 * Suggest action based on transaction amount.
 * Positive amounts are typically income (deposits, credits).
 * Negative amounts are typically bills (withdrawals, debits).
 */
export function suggestActionFromAmount(amount: number): 'income' | 'bill' {
  return amount >= 0 ? 'income' : 'bill';
}
