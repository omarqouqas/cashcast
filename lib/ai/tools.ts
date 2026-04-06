/**
 * Tool definitions for Claude AI function calling.
 * These tools expose the existing financial calculation functions to the LLM.
 */

import type Anthropic from '@anthropic-ai/sdk';

type Tool = Anthropic.Tool;

export const AI_TOOLS: Tool[] = [
  {
    name: 'calculate_affordability',
    description:
      'Check if the user can afford a purchase on a specific date without going negative or below their safety buffer. Use this when the user asks "Can I afford X?", "Is it safe to buy X?", or wants to know the impact of a potential purchase.',
    input_schema: {
      type: 'object' as const,
      properties: {
        purchaseAmount: {
          type: 'number',
          description: "The cost of the purchase in the user's currency",
        },
        purchaseDate: {
          type: 'string',
          description:
            'The date of the purchase in YYYY-MM-DD format. Use today\'s date if not specified.',
        },
        purchaseName: {
          type: 'string',
          description: 'Optional name/description of the purchase for context',
        },
      },
      required: ['purchaseAmount', 'purchaseDate'],
    },
  },
  {
    name: 'calculate_payment_date',
    description:
      'Predict when a client invoice will be paid based on payment terms and client payment history. Use this when the user asks "When will [client] pay?", "When should I expect payment?", or about invoice timing.',
    input_schema: {
      type: 'object' as const,
      properties: {
        invoiceDate: {
          type: 'string',
          description: 'The invoice date in YYYY-MM-DD format',
        },
        paymentTerms: {
          type: 'string',
          enum: [
            'due_on_receipt',
            'net_7',
            'net_15',
            'net_30',
            'net_45',
            'net_60',
            'net_90',
          ],
          description: 'The payment terms for the invoice',
        },
        clientHistory: {
          type: 'string',
          enum: ['on_time', 'usually_late', 'very_late'],
          description:
            "The client's historical payment behavior. Assume 'on_time' if not specified.",
        },
        adjustForWeekends: {
          type: 'boolean',
          description:
            'Whether to adjust the expected payment date for weekends (default: true)',
        },
      },
      required: ['invoiceDate', 'paymentTerms', 'clientHistory'],
    },
  },
  {
    name: 'calculate_tax_reserve',
    description:
      'Calculate how much the user should set aside for taxes based on their income and expenses. Supports US (federal + self-employment) and Canadian (federal + provincial + CPP) tax calculations. Use for questions about tax savings, quarterly taxes, or "How much for taxes?"',
    input_schema: {
      type: 'object' as const,
      properties: {
        country: {
          type: 'string',
          enum: ['US', 'CA'],
          description:
            'Country for tax calculation. Infer from context or ask user.',
        },
        annualRevenue: {
          type: 'number',
          description: 'Estimated annual gross revenue',
        },
        businessExpenses: {
          type: 'number',
          description: 'Estimated annual business expenses',
        },
        filingStatus: {
          type: 'string',
          enum: ['single', 'married_joint', 'married_separate', 'head_of_household'],
          description: 'US filing status. Only needed for US calculations.',
        },
        province: {
          type: 'string',
          enum: [
            'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
          ],
          description: 'Canadian province code. Only needed for CA calculations.',
        },
      },
      required: ['country', 'annualRevenue', 'businessExpenses'],
    },
  },
  {
    name: 'calculate_income_variability',
    description:
      "Analyze the variability and stability of the user's income over time. Returns a variability score, recommended emergency fund, and identifies months below the danger threshold. Use when asking about income stability, emergency fund recommendations, or \"How stable is my income?\"",
    input_schema: {
      type: 'object' as const,
      properties: {
        monthlyExpenses: {
          type: 'number',
          description:
            'Optional monthly expenses for calculating danger zone threshold',
        },
      },
      required: [],
    },
  },
  {
    name: 'calculate_hourly_rate',
    description:
      'Calculate the recommended hourly rate for freelance work based on income goals, expenses, and billable hours. Use when asking "What should I charge?", "How much is my hourly rate?", or about pricing services.',
    input_schema: {
      type: 'object' as const,
      properties: {
        annualIncomeGoal: {
          type: 'number',
          description: 'Desired annual take-home income',
        },
        monthlyExpenses: {
          type: 'number',
          description: 'Monthly business operating expenses',
        },
        billableHoursPerWeek: {
          type: 'number',
          description:
            'Expected billable hours per week (typically 20-30 for freelancers)',
        },
        vacationWeeks: {
          type: 'number',
          description: 'Weeks of vacation/time off per year',
        },
      },
      required: [
        'annualIncomeGoal',
        'monthlyExpenses',
        'billableHoursPerWeek',
        'vacationWeeks',
      ],
    },
  },
  {
    name: 'get_forecast_summary',
    description:
      'Get a summary of the cash flow forecast including the lowest balance point and when it occurs. Use for questions like "When will my balance be lowest?", "What does my month look like?", or general cash flow overview questions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        daysAhead: {
          type: 'number',
          description:
            'Number of days to look ahead in the forecast (default: 30, max: 90)',
        },
      },
      required: [],
    },
  },
];

/**
 * Get a human-friendly name for a tool.
 */
export function getToolDisplayName(toolName: string): string {
  const names: Record<string, string> = {
    calculate_affordability: 'Checking affordability',
    calculate_payment_date: 'Calculating payment date',
    calculate_tax_reserve: 'Calculating tax reserve',
    calculate_income_variability: 'Analyzing income stability',
    calculate_hourly_rate: 'Calculating hourly rate',
    get_forecast_summary: 'Analyzing cash flow forecast',
  };
  return names[toolName] ?? toolName;
}
