/**
 * AI Chat API Route
 * Handles natural language queries with streaming responses.
 */

import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getUserTier } from '@/lib/stripe/feature-gate';
import { checkQueryUsage, incrementQueryUsage } from '@/lib/ai/usage';
import { fetchUserFinancialData, buildFinancialContext } from '@/lib/ai/context';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { AI_TOOLS, getToolDisplayName } from '@/lib/ai/tools';
import { executeTool } from '@/lib/ai/execute-tool';
import {
  createAnthropicClient,
  selectModel,
  MAX_TOKENS,
  MAX_TOOL_ITERATIONS,
} from '@/lib/ai/client';
import type { StreamEvent } from '@/lib/ai/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * Helper to encode SSE events
 */
function encodeSSE(event: StreamEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check environment
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Parse request
    let body: {
      query?: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const query = body.query?.trim();
    const history = body.history ?? [];
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Check rate limit
    const tier = await getUserTier(user.id);
    const usageCheck = await checkQueryUsage(user.id, tier);

    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: "You've used your 5 free questions today. Upgrade to Pro for unlimited access.",
          resetAt: usageCheck.resetAt?.toISOString(),
          limit: usageCheck.limit,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Fetch user financial data
    const userData = await fetchUserFinancialData(user.id);
    const context = buildFinancialContext(user.id, userData);
    const systemPrompt = buildSystemPrompt(context);

    // 6. Increment usage count (do this before calling Claude to ensure we count the attempt)
    await incrementQueryUsage(user.id);

    // 7. Create Anthropic client
    const anthropic = createAnthropicClient();
    const model = selectModel(query);

    // 8. Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          type MessageParam = Anthropic.MessageParam;
          // Build messages from history + current query
          const historyMessages: MessageParam[] = history.map((h) => ({
            role: h.role,
            content: h.content,
          }));
          let messages: MessageParam[] = [
            ...historyMessages,
            { role: 'user', content: query },
          ];

          // Tool use loop (max iterations to prevent infinite loops)
          for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
            const response = await anthropic.messages.create({
              model,
              max_tokens: MAX_TOKENS,
              system: systemPrompt,
              tools: AI_TOOLS,
              messages,
              stream: true,
            });

            let textContent = '';
            let toolUseBlock: {
              id: string;
              name: string;
              inputJson: string;
            } | null = null;
            let stopReason: string | null = null;

            for await (const event of response) {
              // Handle text streaming
              if (
                event.type === 'content_block_start' &&
                event.content_block.type === 'text'
              ) {
                // Text block starting, nothing to do
              }

              if (
                event.type === 'content_block_start' &&
                event.content_block.type === 'tool_use'
              ) {
                toolUseBlock = {
                  id: event.content_block.id,
                  name: event.content_block.name,
                  inputJson: '',
                };
                // Send tool start event
                controller.enqueue(
                  encodeSSE({
                    type: 'tool_start',
                    tool: getToolDisplayName(event.content_block.name),
                  })
                );
              }

              if (event.type === 'content_block_delta') {
                if (event.delta.type === 'text_delta') {
                  textContent += event.delta.text;
                  controller.enqueue(
                    encodeSSE({ type: 'text', content: event.delta.text })
                  );
                } else if (
                  event.delta.type === 'input_json_delta' &&
                  toolUseBlock
                ) {
                  toolUseBlock.inputJson += event.delta.partial_json;
                }
              }

              if (event.type === 'message_delta') {
                stopReason = event.delta.stop_reason ?? null;
              }
            }

            // Check if we need to handle tool use
            if (stopReason === 'tool_use' && toolUseBlock) {
              // Parse tool input
              let toolInput: Record<string, unknown> = {};
              try {
                toolInput = JSON.parse(toolUseBlock.inputJson);
              } catch {
                console.error('Failed to parse tool input:', toolUseBlock.inputJson);
              }

              // Execute tool
              const toolResult = await executeTool(
                toolUseBlock.name,
                toolInput,
                userData
              );

              // Send tool result event
              controller.enqueue(
                encodeSSE({
                  type: 'tool_result',
                  tool: getToolDisplayName(toolUseBlock.name),
                  success: toolResult.success,
                })
              );

              // Add assistant message with tool use and user message with tool result
              messages = [
                ...messages,
                {
                  role: 'assistant',
                  content: [
                    ...(textContent
                      ? [{ type: 'text' as const, text: textContent }]
                      : []),
                    {
                      type: 'tool_use' as const,
                      id: toolUseBlock.id,
                      name: toolUseBlock.name,
                      input: toolInput,
                    },
                  ],
                },
                {
                  role: 'user',
                  content: [
                    {
                      type: 'tool_result' as const,
                      tool_use_id: toolUseBlock.id,
                      content: JSON.stringify(toolResult.result),
                    },
                  ],
                },
              ];

              // Reset for next iteration
              toolUseBlock = null;
              textContent = '';
              continue;
            }

            // Response complete (end_turn or max_tokens)
            break;
          }

          // Send done event with remaining queries
          const newRemaining =
            usageCheck.remaining !== null
              ? Math.max(0, usageCheck.remaining - 1)
              : null;
          controller.enqueue(
            encodeSSE({
              type: 'done',
              remaining: newRemaining ?? undefined,
            })
          );
          controller.close();
        } catch (error) {
          console.error('AI streaming error:', error);
          controller.enqueue(
            encodeSSE({
              type: 'error',
              message:
                error instanceof Error
                  ? error.message
                  : 'An error occurred while processing your request',
            })
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
