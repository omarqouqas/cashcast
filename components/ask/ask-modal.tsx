'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Send, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showError } from '@/lib/toast';
import type { StreamEvent } from '@/lib/ai/types';

export interface AskModalProps {
  open: boolean;
  onClose: () => void;
}

type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  toolName?: string;
  toolStatus?: 'running' | 'complete';
}

export function AskModal({ open, onClose }: AskModalProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isStreaming) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, isStreaming]);

  // Focus input when opening
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      // Small delay to allow closing animation
      const timeout = setTimeout(() => {
        setMessages([]);
        setQuery('');
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [open]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent, overrideQuery?: string) => {
      e?.preventDefault();

      const trimmedQuery = (overrideQuery ?? query).trim();
      if (!trimmedQuery || isStreaming) return;

      // Add user message
      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `assistant-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: userMessageId, role: 'user', content: trimmedQuery },
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);
      setQuery('');
      setIsStreaming(true);

      // Create abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Build conversation history for context (exclude the empty assistant message we just added)
        const history = messages
          .filter((m) => m.content.trim() !== '')
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmedQuery, history }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to send message');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6);

            try {
              const event: StreamEvent = JSON.parse(jsonStr);

              switch (event.type) {
                case 'text':
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + (event.content ?? '') }
                        : msg
                    )
                  );
                  break;

                case 'tool_start':
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, toolName: event.tool, toolStatus: 'running' }
                        : msg
                    )
                  );
                  break;

                case 'tool_result':
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, toolStatus: 'complete' }
                        : msg
                    )
                  );
                  break;

                case 'done':
                  if (typeof event.remaining === 'number') {
                    setRemaining(event.remaining);
                  }
                  break;

                case 'error':
                  throw new Error(event.message || 'An error occurred');
              }
            } catch (parseError) {
              console.error('Failed to parse SSE event:', parseError);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Request was aborted, ignore
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to send message';
        showError(message);
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [query, isStreaming, messages]
  );

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      if (isStreaming || remaining === 0) return;
      void handleSubmit(undefined, question);
    },
    [handleSubmit, isStreaming, remaining]
  );

  const handleClose = useCallback(() => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onClose();
  }, [isStreaming, onClose]);

  if (!mounted || !open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isStreaming) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-modal-title"
        className={cn(
          'w-full sm:max-w-xl',
          'h-[85dvh] sm:h-[600px]',
          'max-h-[85dvh]',
          'bg-zinc-900 border border-zinc-800',
          'rounded-t-2xl sm:rounded-lg shadow-xl overflow-hidden flex flex-col',
          'animate-in fade-in duration-150'
        )}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 id="ask-modal-title" className="text-lg font-semibold text-zinc-100">
                  Ask Cashcast
                </h2>
                <p className="text-xs text-zinc-500">
                  Ask questions about your finances
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isStreaming}
              className={cn(
                'text-zinc-400 hover:text-zinc-100 p-2 rounded-md transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-violet-500',
                isStreaming && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-200 mb-2">
                What would you like to know?
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mb-6">
                Ask questions about your finances in plain English
              </p>

              {/* Suggested questions */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {[
                  'Can I afford a $500 purchase next week?',
                  'When will my balance be lowest?',
                  'How much should I save for taxes?',
                  'How stable is my income?',
                ].map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={remaining === 0}
                    className={cn(
                      'text-xs px-3 py-2 rounded-full',
                      'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-violet-500/50',
                      'text-zinc-300 hover:text-violet-300',
                      'transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300'
                    )}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-violet-500/20 text-violet-100'
                      : 'bg-zinc-800 text-zinc-200'
                  )}
                >
                  {/* Tool execution indicator */}
                  {msg.role === 'assistant' && msg.toolName && (
                    <div
                      className={cn(
                        'flex items-center gap-2 text-xs mb-2 pb-2 border-b border-zinc-700',
                        msg.toolStatus === 'running'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      )}
                    >
                      {msg.toolStatus === 'running' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      <span>{msg.toolName}</span>
                    </div>
                  )}

                  {/* Message content */}
                  {msg.content ? (
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  ) : msg.role === 'assistant' && isStreaming ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 flex-shrink-0">
          {/* Remaining queries indicator */}
          {remaining !== null && remaining <= 3 && (
            <div className="mb-3 text-xs text-zinc-500 text-center">
              {remaining === 0 ? (
                <span className="text-amber-400">
                  You&apos;ve used all your free questions today.{' '}
                  <a href="/pricing" className="underline hover:text-amber-300">
                    Upgrade to Pro
                  </a>{' '}
                  for unlimited access.
                </span>
              ) : (
                <span>
                  {remaining} free question{remaining === 1 ? '' : 's'} remaining today
                </span>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isStreaming || remaining === 0}
              placeholder={
                remaining === 0
                  ? 'Upgrade to Pro for unlimited questions'
                  : 'Ask about your finances...'
              }
              className={cn(
                'flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3',
                'text-sm text-zinc-100 placeholder-zinc-500',
                'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
            <button
              type="submit"
              disabled={!query.trim() || isStreaming || remaining === 0}
              className={cn(
                'bg-violet-500 hover:bg-violet-600 text-white rounded-lg px-4 py-3',
                'transition-colors flex items-center justify-center',
                'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-500'
              )}
              aria-label="Send message"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
