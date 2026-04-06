/**
 * AI Categorization API Route
 * Categorizes transactions using Claude for those that don't match rule-based patterns.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserTier } from '@/lib/stripe/feature-gate';
import { getUserCategories } from '@/lib/actions/manage-categories';
import {
  categorizeWithAI,
  getAICategorizationLimit,
  type TransactionInput,
  type CategorySuggestion,
} from '@/lib/categorization';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get user's subscription tier
    const tier = await getUserTier(user.id);

    // 3. Parse request body
    let body: { transactions?: TransactionInput[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { transactions } = body;

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'transactions array is required' },
        { status: 400 }
      );
    }

    // 4. Validate and sanitize transaction structure
    const validTransactions: TransactionInput[] = [];
    for (const tx of transactions) {
      if (
        tx &&
        typeof tx === 'object' &&
        typeof tx.id === 'string' &&
        typeof tx.description === 'string' &&
        typeof tx.amount === 'number' &&
        tx.id.length > 0 &&
        tx.description.length > 0 &&
        Number.isFinite(tx.amount)
      ) {
        validTransactions.push({
          id: tx.id.slice(0, 100), // Limit ID length
          description: tx.description.slice(0, 500), // Limit description length
          amount: tx.amount,
        });
      }
    }

    // 5. Return empty if no valid transactions
    if (validTransactions.length === 0) {
      return NextResponse.json({ suggestions: {} });
    }

    // 6. Apply tier-based limit
    const limit = getAICategorizationLimit(tier);
    const limitedTransactions = validTransactions.slice(0, limit);

    // 7. Get user's available categories
    const categoriesResult = await getUserCategories();
    if (!categoriesResult.success || !categoriesResult.categories) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    const availableCategories = categoriesResult.categories.map((c) => c.name);

    // 8. Call AI categorization
    const aiSuggestions = await categorizeWithAI(
      limitedTransactions,
      availableCategories
    );

    // 9. Convert Map to object for JSON response
    const suggestionsObject: Record<string, CategorySuggestion> = {};
    aiSuggestions.forEach((value, key) => {
      suggestionsObject[key] = value;
    });

    return NextResponse.json({
      suggestions: suggestionsObject,
      processed: limitedTransactions.length,
      limit,
      truncated: transactions.length > limit,
    });
  } catch (error) {
    console.error('Categorization API error:', error);
    return NextResponse.json(
      { error: 'Categorization failed' },
      { status: 500 }
    );
  }
}
