'use client';

import { useState } from 'react';
import { Check, FileText, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/toast';
import {
  generateSignatureHTML,
  generatePlainText,
  type SignatureData,
  type SignatureTemplate,
} from '@/lib/tools/generate-signature-html';
import posthog from 'posthog-js';

interface EmailSignaturePreviewProps {
  data: SignatureData;
  template: SignatureTemplate;
  onTemplateChange: (template: SignatureTemplate) => void;
  onCopySuccess?: () => void;
}

const TEMPLATES: { id: SignatureTemplate; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'with-photo', label: 'With Photo' },
  { id: 'modern-card', label: 'Modern Card' },
];

export function EmailSignaturePreview({
  data,
  template,
  onTemplateChange,
  onCopySuccess,
}: EmailSignaturePreviewProps) {
  const [copiedFormat, setCopiedFormat] = useState<'html' | 'text' | null>(null);

  const html = generateSignatureHTML(data, template);
  const plainText = generatePlainText(data, template);

  const handleCopyHTML = async () => {
    try {
      // Try rich text copy first (works in most modern browsers)
      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
          }),
        ]);
      } else {
        // Fallback to plain HTML text
        await navigator.clipboard.writeText(html);
      }

      setCopiedFormat('html');
      showSuccess('Signature copied! Paste into your email client.');
      setTimeout(() => setCopiedFormat(null), 2000);

      try {
        posthog.capture('signature_copied', { format: 'html', template });
      } catch {}

      onCopySuccess?.();
    } catch {
      showError('Failed to copy. Please try again.');
    }
  };

  const handleCopyPlainText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);

      setCopiedFormat('text');
      showSuccess('Plain text signature copied!');
      setTimeout(() => setCopiedFormat(null), 2000);

      try {
        posthog.capture('signature_copied', { format: 'text', template });
      } catch {}

      onCopySuccess?.();
    } catch {
      showError('Failed to copy. Please try again.');
    }
  };

  const isValid = data.fullName && data.jobTitle && data.email;

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTemplateChange(t.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg border transition-colors',
              template === t.id
                ? 'bg-teal-500/20 border-teal-500 text-teal-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-zinc-800 bg-white p-6 min-h-[200px]">
        {isValid ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
            Fill in your details to see the preview
          </div>
        )}
      </div>

      {/* Copy Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyHTML}
          disabled={!isValid}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
            isValid
              ? 'bg-teal-500 hover:bg-teal-400 text-zinc-950'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          )}
        >
          {copiedFormat === 'html' ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Code className="h-4 w-4" />
              Copy HTML
            </>
          )}
        </button>

        <button
          onClick={handleCopyPlainText}
          disabled={!isValid}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
            isValid
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
          )}
        >
          {copiedFormat === 'text' ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Copy Plain Text
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-zinc-500">
        Works with Gmail, Outlook, Apple Mail, and most email clients. Paste using Ctrl+V (or Cmd+V on Mac).
      </p>
    </div>
  );
}
