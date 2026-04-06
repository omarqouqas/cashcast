/**
 * Shared types for email digest functionality.
 * Separated to avoid circular imports between generate-digest-data.ts and generate-ai-insights.ts
 */

export interface AIInsight {
  emoji: string;
  text: string;
}

export interface DigestData {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  weekRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalIncome: number;
    totalBills: number;
    netChange: number;
    startingBalance: number;
    lowestBalance: number;
    lowestBalanceDate: Date;
    endingBalance: number;
  };
  alerts: {
    hasLowBalance: boolean;
    hasOverdraftRisk: boolean;
    hasBillCollisions: boolean;
    collisionCount: number;
  };
  upcomingBills: Array<{
    name: string;
    amount: number;
    date: Date;
  }>;
  upcomingIncome: Array<{
    name: string;
    amount: number;
    date: Date;
  }>;
  currency: string;
  timezone?: string | null;
  safetyBuffer?: number;
  aiInsights?: AIInsight[];
}
